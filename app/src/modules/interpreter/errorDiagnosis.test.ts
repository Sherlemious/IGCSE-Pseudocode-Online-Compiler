import { describe, expect, it } from 'vitest';
import { diagnoseRuntimeError, humanizeParseError, parseHintDetail } from './errorMessages';

const ctx = (code: string, line: number) => ({ lines: code.split('\n'), line });

describe('undeclared variable diagnosis', () => {
  const celsius = `DECLARE Celsius : INTEGER
DECLARE Fahrenheit : INTEGER
INPUT Celsius
Fahrenheit <- (Celcius * 9) DIV 5 + 32
OUTPUT Fahrenheit`;

  it('suggests the nearest declared name for a typo, with a one-click fix', () => {
    const d = diagnoseRuntimeError("Variable 'Celcius' is not defined", ctx(celsius, 4));
    expect(d.detail).toBe('typo');
    expect(d.message).toContain("did you mean 'Celsius'");
    expect(d.fix?.text).toBe('Fahrenheit <- (Celsius * 9) DIV 5 + 32');
    expect(d.fix?.line).toBe(4);
  });

  it('explains case-sensitivity when only the capitals differ', () => {
    const code = 'DECLARE Score : INTEGER\nscore <- 5\nOUTPUT score + Total';
    const d = diagnoseRuntimeError("Variable 'score' is not defined", ctx('DECLARE Score : INTEGER\nOUTPUT score', 2));
    expect(d.detail).toBe('case_mismatch');
    expect(d.message).toContain('case-sensitive');
    expect(d.fix?.text).toBe('OUTPUT Score');
    expect(code).toBeTruthy();
  });

  it('says when the variable is only set up further down', () => {
    const d = diagnoseRuntimeError(
      "Variable 'Total' is not defined",
      ctx('OUTPUT Total\nDECLARE Total : INTEGER\nTotal <- 1', 1),
    );
    expect(d.detail).toBe('declared_later');
    expect(d.message).toContain('line 2');
    expect(d.fix).toBeUndefined();
  });

  it('does not guess when nothing is close, or two names tie', () => {
    const none = diagnoseRuntimeError("Variable 'Banana' is not defined", ctx(celsius, 4));
    expect(none.detail).toBe('undeclared');
    expect(none.fix).toBeUndefined();

    const tie = diagnoseRuntimeError(
      "Variable 'Cat' is not defined",
      ctx('DECLARE Car : INTEGER\nDECLARE Cap : INTEGER\nOUTPUT Cat', 3),
    );
    expect(tie.fix).toBeUndefined();
  });

  it('leaves text inside strings and field names alone when renaming', () => {
    const code = 'DECLARE Name : STRING\nOUTPUT "Nmae", Nmae, Pupil.Nmae';
    const d = diagnoseRuntimeError("Variable 'Nmae' is not defined", ctx(code, 2));
    expect(d.fix?.text).toBe('OUTPUT "Nmae", Name, Pupil.Nmae');
  });

  it('keeps the plain message without program context', () => {
    const d = diagnoseRuntimeError("Variable 'x' is not defined");
    expect(d.message).toContain('DECLARE x : INTEGER');
    expect(d.detail).toBe('undeclared');
  });
});

describe('array index diagnosis', () => {
  const loop = `DECLARE Scores : ARRAY[1:5] OF INTEGER
FOR i <- 1 TO 6
    Scores[i] <- 0
NEXT i`;

  it('points at the loop bound when the loop runs one past the end', () => {
    const d = diagnoseRuntimeError('Array index 6 out of bounds [1:5]', ctx(loop, 3));
    expect(d.detail).toBe('off_by_one_loop');
    expect(d.message).toContain('`Scores[6]`');
    expect(d.message).toContain('line 2');
    expect(d.message).toContain('FOR i <- 1 TO 5');
  });

  it('says arrays start at 1 for index 0', () => {
    const d = diagnoseRuntimeError('Array index 0 out of bounds [1:5]', ctx('OUTPUT Scores[0]', 1));
    expect(d.detail).toBe('index_zero');
    expect(d.message).toContain('start at 1');
  });

  it('points at a loop that starts at 0 (the Python habit)', () => {
    const code = 'DECLARE Names : ARRAY[1:10] OF STRING\nFOR i <- 0 TO 9\n    OUTPUT Names[i]\nNEXT i';
    const d = diagnoseRuntimeError('Array index 0 out of bounds [1:10]', ctx(code, 3));
    expect(d.detail).toBe('index_zero_loop');
    expect(d.message).toContain('line 2 starts i at 0');
    expect(d.message).toContain('FOR i <- 1 TO 10');
  });

  it('does not blame the loop start when the index is worked out from it', () => {
    const code = 'DECLARE A : ARRAY[1:5] OF INTEGER\nFOR i <- 1 TO 5\n    OUTPUT A[i - 1]\nNEXT i';
    const d = diagnoseRuntimeError('Array index 0 out of bounds [1:5]', ctx(code, 3));
    expect(d.detail).toBe('index_zero');
  });

  it('reads a FOR written with = and picks the loop the index uses', () => {
    const code = [
      'DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER',
      'FOR r = 1 TO 3',
      '    FOR c = 1 TO 4',
      '        Grid[r, c] <- 0',
      '    NEXT c',
      'NEXT r',
    ].join('\n');
    const d = diagnoseRuntimeError('Array index 4 out of bounds [1:3]', ctx(code, 4));
    expect(d.detail).toBe('off_by_one_loop');
    expect(d.message).toContain('line 3');
  });

  it('names the WHILE condition and an increase before the use', () => {
    const code = [
      'DECLARE Marks : ARRAY[1:5] OF INTEGER',
      'Count <- 1',
      'WHILE Count <= 5',
      '    Count <- Count + 1',
      '    Marks[Count] <- 0',
      'ENDWHILE',
    ].join('\n');
    const d = diagnoseRuntimeError('Array index 6 out of bounds [1:5]', ctx(code, 5));
    expect(d.detail).toBe('off_by_one_while');
    expect(d.message).toContain('WHILE Count <= 5');
    expect(d.message).toContain('goes up on line 4');
  });

  it('names the UNTIL condition of a REPEAT loop', () => {
    const code = [
      'DECLARE Marks : ARRAY[1:5] OF INTEGER',
      'Count <- 1',
      'REPEAT',
      '    Marks[Count] <- 0',
      '    Count <- Count + 1',
      'UNTIL Count > 6',
    ].join('\n');
    const d = diagnoseRuntimeError('Array index 6 out of bounds [1:5]', ctx(code, 4));
    expect(d.detail).toBe('off_by_one_repeat');
    expect(d.message).toContain('UNTIL Count > 6');
    expect(d.message).toContain('Make the loop stop once Count is 5');
  });

  it('falls back to the plain range without context', () => {
    const d = diagnoseRuntimeError('Array index 9 out of bounds [1:5]');
    expect(d.message).toContain('out of range');
    expect(d.message).toContain('1');
  });
});

describe('stray ELSE / ENDIF diagnosis', () => {
  it('names the block that is still open', () => {
    const code = `IF x > 1 THEN
  FOR i <- 1 TO 3
    OUTPUT i
ELSE
  OUTPUT 0
ENDIF`;
    const msg = humanizeParseError("no viable alternative at input '\\nELSE'", 'ELSE', ctx(code, 4));
    expect(msg).toContain('FOR from line 2');
    expect(msg).toContain('NEXT i');
    expect(parseHintDetail('ELSE', ctx(code, 4))).toBe('inner_block_open');
  });

  it('spots an IF with no THEN', () => {
    const code = 'IF x > 1\n  OUTPUT 1\nELSE\n  OUTPUT 0\nENDIF';
    expect(parseHintDetail('ELSE', ctx(code, 3))).toBe('missing_then');
    expect(humanizeParseError('no viable alternative', 'ELSE', ctx(code, 3))).toContain('line 1 has no THEN');
  });

  it('reports an extra ENDIF after the IF was already closed', () => {
    const code = 'IF x > 1 THEN\n  OUTPUT 1\nENDIF\nENDIF';
    expect(parseHintDetail('ENDIF', ctx(code, 4))).toBe('already_closed');
    expect(humanizeParseError('no viable alternative', 'ENDIF', ctx(code, 4))).toContain('line 3');
  });

  it('flags a second ELSE on the same IF', () => {
    const code = 'IF x > 1 THEN\n  OUTPUT 1\nELSE\n  OUTPUT 2\nELSE\n  OUTPUT 3\nENDIF';
    expect(parseHintDetail('ELSE', ctx(code, 5))).toBe('second_else');
  });

  it('keeps the plain hint when there is no IF at all', () => {
    expect(parseHintDetail('ELSE', ctx('OUTPUT 1\nELSE', 2))).toBe('no_if');
    expect(humanizeParseError('no viable alternative', 'ELSE')).toContain('ELSE must sit inside an IF');
  });
});
