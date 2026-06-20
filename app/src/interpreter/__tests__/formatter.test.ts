import { describe, it, expect } from 'vitest';
import { formatPseudocode } from '../formatter';

const fmt = (s: string) => formatPseudocode(s);

describe('formatPseudocode — conditionals', () => {
  it('indents nested IF / ELSEIF / ELSE / ENDIF', () => {
    const input = [
      'IF x > 5 THEN',
      'OUTPUT "big"',
      'ELSEIF x > 0 THEN',
      'OUTPUT "small"',
      'ELSE',
      'OUTPUT "neg"',
      'ENDIF',
    ].join('\n');
    const expected = [
      'IF x > 5 THEN',
      '    OUTPUT "big"',
      'ELSEIF x > 0 THEN',
      '    OUTPUT "small"',
      'ELSE',
      '    OUTPUT "neg"',
      'ENDIF',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });
});

describe('formatPseudocode — loops', () => {
  it('indents a FOR/NEXT nested inside WHILE/ENDWHILE', () => {
    const input = ['WHILE running DO', 'FOR i <- 1 TO 10', 'OUTPUT i', 'NEXT i', 'ENDWHILE'].join('\n');
    const expected = [
      'WHILE running DO',
      '    FOR i <- 1 TO 10',
      '        OUTPUT i',
      '    NEXT i',
      'ENDWHILE',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('handles REPEAT/UNTIL', () => {
    const input = ['REPEAT', 'INPUT x', 'UNTIL x > 0'].join('\n');
    const expected = ['REPEAT', '    INPUT x', 'UNTIL x > 0'].join('\n');
    expect(fmt(input)).toBe(expected);
  });
});

describe('formatPseudocode — subroutines', () => {
  it('indents FUNCTION / ENDFUNCTION bodies', () => {
    const input = ['FUNCTION Square(n : INTEGER) RETURNS INTEGER', 'RETURN n * n', 'ENDFUNCTION'].join('\n');
    const expected = [
      'FUNCTION Square(n : INTEGER) RETURNS INTEGER',
      '    RETURN n * n',
      'ENDFUNCTION',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('indents PROCEDURE / ENDPROCEDURE bodies', () => {
    const input = ['PROCEDURE Greet()', 'OUTPUT "hi"', 'ENDPROCEDURE'].join('\n');
    const expected = ['PROCEDURE Greet()', '    OUTPUT "hi"', 'ENDPROCEDURE'].join('\n');
    expect(fmt(input)).toBe(expected);
  });
});

describe('formatPseudocode — CASE', () => {
  it('indents inline case labels at one level', () => {
    const input = ['CASE OF grade', '1 : OUTPUT "A"', '2 : OUTPUT "B"', 'OTHERWISE : OUTPUT "?"', 'ENDCASE'].join('\n');
    const expected = [
      'CASE OF grade',
      '    1 : OUTPUT "A"',
      '    2 : OUTPUT "B"',
      '    OTHERWISE : OUTPUT "?"',
      'ENDCASE',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });
});

describe('formatPseudocode — A Level constructs', () => {
  it('indents a record TYPE ... ENDTYPE', () => {
    const input = ['TYPE Student', 'DECLARE Name : STRING', 'DECLARE Age : INTEGER', 'ENDTYPE'].join('\n');
    const expected = [
      'TYPE Student',
      '    DECLARE Name : STRING',
      '    DECLARE Age : INTEGER',
      'ENDTYPE',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('does NOT indent single-line TYPE definitions (enum / pointer)', () => {
    const input = ['TYPE Colour = (Red, Green, Blue)', 'TYPE IntPtr = ^INTEGER', 'DECLARE x : INTEGER'].join('\n');
    // Every line stays at level 0 — the single-line forms must not open a block.
    expect(fmt(input)).toBe(input);
  });

  it('indents CLASS bodies and PUBLIC/PRIVATE methods', () => {
    const input = [
      'CLASS Animal',
      'PRIVATE name : STRING',
      'ENDCLASS',
      'CLASS Dog INHERITS Animal',
      'PUBLIC PROCEDURE Bark()',
      'OUTPUT "Woof"',
      'ENDPROCEDURE',
      'ENDCLASS',
    ].join('\n');
    const expected = [
      'CLASS Animal',
      '    PRIVATE name : STRING',
      'ENDCLASS',
      'CLASS Dog INHERITS Animal',
      '    PUBLIC PROCEDURE Bark()',
      '        OUTPUT "Woof"',
      '    ENDPROCEDURE',
      'ENDCLASS',
    ].join('\n');
    expect(fmt(input)).toBe(expected);
  });
});

describe('formatPseudocode — hazard preservation (content untouched)', () => {
  it('keeps date literals intact', () => {
    const input = ['IF ok THEN', 'd <- 14/03/2025', 'ENDIF'].join('\n');
    const expected = ['IF ok THEN', '    d <- 14/03/2025', 'ENDIF'].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('keeps pointer dereference intact', () => {
    expect(fmt('ptr^ <- 5')).toBe('ptr^ <- 5');
  });

  it('does not treat a keyword inside a string as a block token', () => {
    const input = ['IF x THEN', 'OUTPUT "ENDIF"', 'ENDIF'].join('\n');
    const expected = ['IF x THEN', '    OUTPUT "ENDIF"', 'ENDIF'].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('does not treat a keyword inside a comment as a block token', () => {
    const input = ['IF x THEN', '// ENDIF goes here', 'OUTPUT 1', 'ENDIF'].join('\n');
    const expected = ['IF x THEN', '    // ENDIF goes here', '    OUTPUT 1', 'ENDIF'].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('preserves single-line multi-assignment', () => {
    expect(fmt('x <- 1, y <- 2')).toBe('x <- 1, y <- 2');
  });
});

describe('formatPseudocode — whitespace handling', () => {
  it('trims trailing whitespace and normalises leading indentation', () => {
    expect(fmt('   OUTPUT 1   ')).toBe('OUTPUT 1');
  });

  it('preserves blank lines without leaving trailing spaces', () => {
    const input = ['IF x THEN', '', 'OUTPUT 1', '', 'ENDIF'].join('\n');
    const expected = ['IF x THEN', '', '    OUTPUT 1', '', 'ENDIF'].join('\n');
    expect(fmt(input)).toBe(expected);
  });

  it('preserves a trailing newline', () => {
    expect(fmt('x <- 1\n')).toBe('x <- 1\n');
  });

  it('preserves the absence of a trailing newline', () => {
    expect(fmt('x <- 1')).toBe('x <- 1');
  });

  it('handles CRLF line endings', () => {
    expect(fmt('IF x THEN\r\nOUTPUT 1\r\nENDIF\r\n')).toBe('IF x THEN\n    OUTPUT 1\nENDIF\n');
  });
});

describe('formatPseudocode — robustness', () => {
  it('never produces negative indentation on unbalanced closers', () => {
    const input = ['ENDIF', 'OUTPUT 1'].join('\n');
    expect(fmt(input)).toBe(['ENDIF', 'OUTPUT 1'].join('\n'));
  });

  it('does not throw on a block that is never closed', () => {
    const input = ['IF x THEN', 'OUTPUT 1'].join('\n');
    expect(fmt(input)).toBe(['IF x THEN', '    OUTPUT 1'].join('\n'));
  });

  it('is idempotent', () => {
    const messy = [
      '  IF x > 5 THEN',
      'FOR i <- 1 TO 3',
      '          OUTPUT i',
      'NEXT i',
      '   ENDIF',
    ].join('\n');
    const once = fmt(messy);
    expect(fmt(once)).toBe(once);
  });
});
