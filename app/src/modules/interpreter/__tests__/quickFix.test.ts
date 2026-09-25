import { describe, it, expect } from 'vitest';
import { parse } from '../parser';
import { resolveOffendingLine } from '../errorMessages';
import { findQuickFix, applyQuickFix } from '../quickFix';

/** Parse, find the fix for the first error, and return the fixed program. */
function fixOf(src: string) {
  const { errors } = parse(src);
  expect(errors.length, 'program should not parse').toBeGreaterThan(0);
  const lines = src.split('\n');
  const line = resolveOffendingLine(lines, errors[0].line).line;
  const fix = findQuickFix(src, line);
  return { fix, fixed: fix ? applyQuickFix(src, fix) : null };
}

function expectFixedTo(src: string, expected: string) {
  const { fix, fixed } = fixOf(src);
  expect(fix, 'expected a quick fix').not.toBeNull();
  expect(fixed).toBe(expected);
  expect(parse(fixed!).errors).toEqual([]);
}

const prog = (...lines: string[]) => lines.join('\n');

describe('quick fixes', () => {
  it('joins a spaced block closer', () => {
    expectFixedTo(prog('IF x > 1 THEN', '  OUTPUT x', 'END IF'), prog('IF x > 1 THEN', '  OUTPUT x', 'ENDIF'));
  });

  it('turns ENDFOR into NEXT <var>', () => {
    expectFixedTo(prog('FOR i <- 1 TO 3', '  OUTPUT i', 'ENDFOR'), prog('FOR i <- 1 TO 3', '  OUTPUT i', 'NEXT i'));
  });

  it('sets the FOR counter with <-', () => {
    expectFixedTo(prog('FOR i 1 TO 3', '  OUTPUT i', 'NEXT i'), prog('FOR i <- 1 TO 3', '  OUTPUT i', 'NEXT i'));
    expectFixedTo(
      prog('FOR count : 1 TO 3', '  OUTPUT count', 'NEXT count'),
      prog('FOR count <- 1 TO 3', '  OUTPUT count', 'NEXT count'),
    );
  });

  it('drops DO from a FOR line', () => {
    expectFixedTo(prog('FOR i <- 1 TO 3 DO', '  OUTPUT i', 'NEXT i'), prog('FOR i <- 1 TO 3', '  OUTPUT i', 'NEXT i'));
  });

  it('replaces != with <>', () => {
    expectFixedTo(
      prog('x <- 1', 'IF x != 2 THEN', '  OUTPUT x', 'ENDIF'),
      prog('x <- 1', 'IF x <> 2 THEN', '  OUTPUT x', 'ENDIF'),
    );
  });

  it('adds a missing comma between OUTPUT items', () => {
    expectFixedTo(prog('Total <- 3', 'OUTPUT "Total is " Total'), prog('Total <- 3', 'OUTPUT "Total is ", Total'));
  });

  it('uses double quotes for text', () => {
    expectFixedTo("OUTPUT 'POOR'", 'OUTPUT "POOR"');
  });

  it('converts Python headers', () => {
    expectFixedTo(
      prog('x <- 1', 'IF x > 0 THEN', '  OUTPUT x', 'else:', '  OUTPUT 0', 'ENDIF'),
      prog('x <- 1', 'IF x > 0 THEN', '  OUTPUT x', 'ELSE', '  OUTPUT 0', 'ENDIF'),
    );
    expectFixedTo(prog('x <- 1', 'if x > 0:', '  OUTPUT x', 'ENDIF'), prog('x <- 1', 'IF x > 0 THEN', '  OUTPUT x', 'ENDIF'));
  });

  it('adds the colon to a DECLARE', () => {
    expectFixedTo('DECLARE Age INTEGER', 'DECLARE Age : INTEGER');
  });

  it('closes an IF left open at the end', () => {
    expectFixedTo(
      prog('x <- 5', 'IF x > 1 THEN', '  OUTPUT "big"'),
      prog('x <- 5', 'IF x > 1 THEN', '  OUTPUT "big"', 'ENDIF'),
    );
  });

  it('closes a FOR after its indented body, not at the end', () => {
    expectFixedTo(
      prog('FOR i <- 1 TO 3', '  OUTPUT i', 'OUTPUT "done"'),
      prog('FOR i <- 1 TO 3', '  OUTPUT i', 'NEXT i', 'OUTPUT "done"'),
    );
  });

  it('closes an outer IF after the inner block, even with loose indentation', () => {
    // PRINT is unindented but sits before the inner IF's ENDIF, so it belongs
    // inside — the outer ENDIF must go after line 4, not after the inner IF line.
    expectFixedTo(
      prog('IF a < b THEN', '  IF b < c THEN', 'OUTPUT a', 'ENDIF'),
      prog('IF a < b THEN', '  IF b < c THEN', 'OUTPUT a', 'ENDIF', 'ENDIF'),
    );
  });

  it('keeps a trailing comment', () => {
    expectFixedTo(
      prog('FOR i : 1 TO 3 // loop', '  OUTPUT i', 'NEXT i'),
      prog('FOR i <- 1 TO 3 // loop', '  OUTPUT i', 'NEXT i'),
    );
  });

  it('fixes a misspelled keyword', () => {
    expectFixedTo('OUPUT "hi"', 'OUTPUT "hi"');
  });

  it('handles other-dialect lines', () => {
    expectFixedTo(prog('CASE day OF', ' 1 : OUTPUT "a"', 'ENDCASE'), prog('CASE OF day', ' 1 : OUTPUT "a"', 'ENDCASE'));
    expectFixedTo('SET x = 0', 'x <- 0');
    expectFixedTo('INPUT "Age" Age', 'INPUT Age, "Age"');
    expectFixedTo('x <- 2 ** 3', 'x <- 2 ^ 3');
    expectFixedTo('x <- 1;', 'x <- 1');
    expectFixedTo('12 OUTPUT "a"', 'OUTPUT "a"');
    expectFixedTo(
      prog('PROCEDURE S()', ' OUTPUT 1', 'ENDPROCEDURE', 'S()'),
      prog('PROCEDURE S()', ' OUTPUT 1', 'ENDPROCEDURE', 'CALL S()'),
    );
    expectFixedTo(
      prog('FUNCTION F(a : INTEGER) RETURN INTEGER', ' RETURN a', 'ENDFUNCTION'),
      prog('FUNCTION F(a : INTEGER) RETURNS INTEGER', ' RETURN a', 'ENDFUNCTION'),
    );
    expectFixedTo(
      prog('x <- 1', 'IF x = 1 THEN', ' OUTPUT 1', 'ELSE x > 2 THEN', ' OUTPUT 2', 'ENDIF'),
      prog('x <- 1', 'IF x = 1 THEN', ' OUTPUT 1', 'ELSE IF x > 2 THEN', ' OUTPUT 2', 'ENDIF'),
    );
  });

  it('removes a BEGIN wrapper line', () => {
    expectFixedTo(prog('BEGIN', 'OUTPUT "hi"'), 'OUTPUT "hi"');
  });

  it('offers nothing when no mechanical fix clears the error', () => {
    expect(fixOf('OUTPUT (').fix).toBeNull();
  });

  it('does not close a PROCEDURE by swallowing the main program', () => {
    // No indented body: appending ENDPROCEDURE at the end would pull CALL Hi()
    // into the procedure, so no fix is offered.
    expect(fixOf(prog('PROCEDURE Hi()', 'OUTPUT "hi"', 'CALL Hi()')).fix).toBeNull();
  });
});
