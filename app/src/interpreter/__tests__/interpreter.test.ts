import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from '../parser';
import { Interpreter } from '../core/interpreter';
import { ServerVirtualFileSystem } from '../core/serverFilesystem';
import { humanizeParseError } from '../errorMessages';
import type { PseudocodeError } from '../core/types';
import { examples } from '../../data/examples';

// Runs pseudocode and collects outputs. Provide `inputs` in order for INPUT statements.
// File I/O uses the server filesystem (vitest's node env has no localStorage),
// which also exercises the same path the autograder uses.
async function runCode(
  source: string,
  inputs: string[] = [],
): Promise<{ outputs: string[]; errors: PseudocodeError[] }> {
  const { tree, errors } = parse(source);
  if (errors.length > 0 || !tree) return { outputs: [], errors };

  const outputs: string[] = [];
  const inputQueue = [...inputs];
  const controller = new AbortController();

  const interpreter = new Interpreter(
    {
      onOutput: (text) => outputs.push(text),
      onInputRequest: () => {},
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
    },
    controller.signal,
    new ServerVirtualFileSystem(),
  );

  // Feed queued inputs automatically
  const originalProvide = interpreter.provideInput.bind(interpreter);
  void originalProvide; // suppress unused warning

  // Intercept input requests by advancing the queue
  const patchedInterpreter = interpreter as unknown as {
    inputResolver: ((v: string) => void) | null;
    callbacks: { onInputRequest: (name: string, prompt?: string) => void };
  };
  const originalOnInputRequest = patchedInterpreter.callbacks.onInputRequest;
  patchedInterpreter.callbacks.onInputRequest = (name, prompt) => {
    originalOnInputRequest(name, prompt);
    const next = inputQueue.shift() ?? '';
    // Give the event loop a tick so the interpreter sets up inputResolver first
    setTimeout(() => interpreter.provideInput(next), 0);
  };

  await interpreter.execute(tree);
  return { outputs, errors: [] };
}

function parseErrors(source: string): string[] {
  const { errors } = parse(source);
  return errors.map((e) => e.message);
}

// ─── Parse tests ─────────────────────────────────────────────────────────────

describe('parse — single assignment', () => {
  it('parses with arrow', () => {
    expect(parseErrors('x <- 5\n')).toEqual([]);
  });

  it('parses with EQUALS token', () => {
    expect(parseErrors('x = 5\n')).toEqual([]);
  });

  it('parses array element assignment', () => {
    expect(parseErrors('arr[1] <- 42\n')).toEqual([]);
  });

  it('parses 2D array element assignment', () => {
    expect(parseErrors('grid[1, 2] <- 99\n')).toEqual([]);
  });
});

describe('parse — multi-assignment (comma-separated)', () => {
  it('parses two assignments on one line', () => {
    expect(parseErrors('x <- 1, y <- 2\n')).toEqual([]);
  });

  it('parses three assignments on one line', () => {
    expect(parseErrors('x <- 1, y <- 2, z <- 3\n')).toEqual([]);
  });

  it('parses mixed types on one line', () => {
    expect(parseErrors('a <- "hello", b <- TRUE, c <- 3.14\n')).toEqual([]);
  });
});

// ─── Execution tests ─────────────────────────────────────────────────────────

describe('execute — single assignment', () => {
  it('assigns and outputs an integer', async () => {
    const { outputs } = await runCode('x <- 42\nOUTPUT x\n');
    expect(outputs).toEqual(['42']);
  });

  it('assigns a string', async () => {
    const { outputs } = await runCode('s <- "hello"\nOUTPUT s\n');
    expect(outputs).toEqual(['hello']);
  });

  it('assigns result of expression', async () => {
    const { outputs } = await runCode('x <- 3 + 4 * 2\nOUTPUT x\n');
    expect(outputs).toEqual(['11']);
  });

  it('reassigns variable', async () => {
    const { outputs } = await runCode('x <- 1\nx <- x + 1\nOUTPUT x\n');
    expect(outputs).toEqual(['2']);
  });
});

describe('execute — multi-assignment', () => {
  it('assigns two variables and both are readable', async () => {
    const { outputs } = await runCode('x <- 10, y <- 20\nOUTPUT x\nOUTPUT y\n');
    expect(outputs).toEqual(['10', '20']);
  });

  it('assigns three variables', async () => {
    const { outputs } = await runCode('a <- 1, b <- 2, c <- 3\nOUTPUT a & " " & b & " " & c\n');
    expect(outputs).toEqual(['1 2 3']);
  });

  it('assigns are independent — right-hand sides evaluated before any write', async () => {
    // x starts at 5; both rhs evaluate against the old x
    const { outputs } = await runCode('x <- 5\nx <- x + 1, y <- x + 10\nOUTPUT x\nOUTPUT y\n');
    // After multi-assign: x = 6, y = 15 (rhs of y saw x=5 at time of eval)
    // Note: assignments are sequential left-to-right so y sees updated x=6
    expect(outputs[0]).toBe('6');
    expect(outputs[1]).toBe('16');
  });

  it('works inside a FOR loop', async () => {
    const code = [
      'FOR i <- 1 TO 3',
      '  x <- i * 2, y <- i * 3',
      '  OUTPUT x & " " & y',
      'NEXT i',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['2 3', '4 6', '6 9']);
  });
});

describe('execute — array assignment', () => {
  it('assigns to a 1D array element', async () => {
    const { outputs } = await runCode(
      'DECLARE arr : ARRAY[1:3] OF INTEGER\narr[2] <- 99\nOUTPUT arr[2]\n',
    );
    expect(outputs).toEqual(['99']);
  });

  it('assigns to a 2D array element', async () => {
    const { outputs } = await runCode(
      'DECLARE grid : ARRAY[1:2, 1:2] OF INTEGER\ngrid[1, 2] <- 7\nOUTPUT grid[1, 2]\n',
    );
    expect(outputs).toEqual(['7']);
  });
});

// ─── Error message tests ──────────────────────────────────────────────────────

describe('humanizeParseError — new hints', () => {
  it('array comma before a closing bracket points to valid 1D and 2D forms', () => {
    const msg = humanizeParseError("missing ']' at ','");
    expect(msg).toContain('ARRAY[1:10]');
    expect(msg).toContain('ARRAY[1:3, 1:3]');
    expect(msg).toContain('Grid[row, col]');
  });

  it('unclosed IF at end of program includes a complete IF example', () => {
    const raw = "extraneous input '<EOF>' expecting {ENDIF, NEWLINE}";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('IF block is not closed');
    expect(msg).toContain('IF Score >= 50 THEN');
    expect(msg).toContain('ENDIF');
  });

  it('ELSE without a matching IF explains the block shape', () => {
    const msg = humanizeParseError("no viable alternative at input '\\nELSE'");
    expect(msg).toContain('ELSE must belong to an open IF block');
    expect(msg).toContain('ELSE');
    expect(msg).toContain('ENDIF');
  });

  it('single quote lexer error explains STRING vs CHAR quotes', () => {
    const msg = humanizeParseError("token recognition error at: '''");
    expect(msg).toContain('double quotes for STRING');
    expect(msg).toContain('OUTPUT "Hello"');
    expect(msg).toContain("Letter <- 'A'");
  });

  it('assignment arrow at the start of a line asks for a variable on the left', () => {
    const raw = "mismatched input '<-' expecting {DECLARE, CONSTANT, INPUT, OUTPUT, PRINT, IF, THEN, CASE, FOR, WHILE, REPEAT, PROCEDURE, FUNCTION, RETURN, CALL, OPENFILE, READFILE, WRITEFILE, CLOSEFILE, IDENTIFIER, NEWLINE}";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('variable name before `<-`');
    expect(msg).toContain('Total <- Total + 1');
  });

  it('dot notation now parses as a designator (A Level records)', () => {
    expect(parseErrors('Pupil.LastName <- "Johnson"\n')).toEqual([]);
    expect(parseErrors('OUTPUT Pupil.LastName\n')).toEqual([]);
  });

  it('DECLARE followed directly by colon shows correct declaration syntax', () => {
    const msg = humanizeParseError("no viable alternative at input 'DECLARE:'");
    expect(msg).toContain('Do not put `:` immediately after DECLARE');
    expect(msg).toContain('DECLARE Count : INTEGER');
  });

  it('missing declaration colon before OUTPUT points to the previous DECLARE', () => {
    const msg = humanizeParseError("missing ':' at 'OUTPUT'");
    expect(msg).toContain('previous DECLARE line');
    expect(msg).toContain('DECLARE Count : INTEGER');
  });

  it('TO where a colon is expected separates declaration and loop examples', () => {
    const msg = humanizeParseError("mismatched input 'TO' expecting ':'");
    expect(msg).toContain('Declarations need a colon');
    expect(msg).toContain('DECLARE i : INTEGER');
    expect(msg).toContain('FOR i <- 1 TO 10');
  });

  it('INPUT prompt without a string literal shows quoted prompt syntax', () => {
    const msg = humanizeParseError("missing STRING_LITERAL at 'numCustomers'");
    expect(msg).toContain('INPUT prompts must be text in double quotes');
    expect(msg).toContain('INPUT NumCustomers, "Enter number of customers"');
  });

  it('START and STOP wrapper keywords explain that no wrapper is needed', () => {
    const startMsg = humanizeParseError("no viable alternative at input 'START\\n'");
    const stopMsg = humanizeParseError("no viable alternative at input 'STOP\\n'");
    expect(startMsg).toContain('does not need START, STOP, BEGIN');
    expect(stopMsg).toContain('specific closers');
  });

  it('number at statement start suggests assignment or output', () => {
    const raw = "extraneous input '1' expecting {<EOF>, DECLARE, CONSTANT, INPUT, OUTPUT, PRINT, IF, CASE, FOR, WHILE, REPEAT, PROCEDURE, FUNCTION, RETURN, CALL, OPENFILE, READFILE, WRITEFILE, CLOSEFILE, IDENTIFIER, NEWLINE}";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('A statement cannot start with 1');
    expect(msg).toContain('Total <- 1');
    expect(msg).toContain('OUTPUT 1');
  });

  it('comparison operator without a left operand shows a complete IF condition', () => {
    const raw = "extraneous input '>=' expecting {NOT, TRUE, FALSE, MOD, DIV, '-', '(', REAL_LITERAL, INTEGER_LITERAL, STRING_LITERAL, CHAR_LITERAL, IDENTIFIER}";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('needs a value on both sides');
    expect(msg).toContain('IF Score >= 50 THEN');
  });

  it('bare identifier line suggests assignment, output, or quoted text', () => {
    const msg = humanizeParseError("no viable alternative at input 'sum\\n'");
    expect(msg).toContain('not a complete statement');
    expect(msg).toContain('sum <- value');
    expect(msg).toContain('OUTPUT sum');
    expect(msg).toContain('OUTPUT "sum"');
  });

  it('INPUT used as expression', () => {
    const raw = "mismatched input 'INPUT' expecting";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('INPUT is a statement');
    expect(msg).toContain('INPUT variableName');
  });

  it('comma where colon expected in array declaration', () => {
    const raw = "mismatched input ',' expecting ':'";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('`:` not `,`');
    expect(msg).toContain('ARRAY[1:6]');
  });

  it('unexpected ( hint includes reserved word note', () => {
    const raw = "mismatched input '(' expecting";
    const msg = humanizeParseError(raw);
    expect(msg).toContain('CALL name(args)');
    expect(msg).toContain('ARRAY');
  });
});

describe('humanizeParseError — misspelled block closers', () => {
  // ANTLR reports a botched closer as a stray-newline symptom on that line; the
  // source-line argument lets the humanizer surface the real cause.
  const NEWLINE_SYMPTOM = "mismatched input '\\n' expecting ':'";

  it('truncated ENDCLASS (ENDCLA) is identified as the root cause', () => {
    const msg = humanizeParseError(NEWLINE_SYMPTOM, 'ENDCLA');
    expect(msg).toContain('did you mean ENDCLASS?');
    expect(msg).toContain('leaves its block open');
  });

  it('truncated ENDPROCEDURE (ENDPROC) maps to ENDPROCEDURE', () => {
    expect(humanizeParseError(NEWLINE_SYMPTOM, 'ENDPROC')).toContain('did you mean ENDPROCEDURE?');
  });

  it('misspelled closers within edit distance 2 are caught', () => {
    expect(humanizeParseError(NEWLINE_SYMPTOM, '    ENDWHILEE')).toContain('did you mean ENDWHILE?');
    expect(humanizeParseError(NEWLINE_SYMPTOM, 'ENDFuncton')).toContain('did you mean ENDFUNCTION?');
  });

  it('does not fire for a correctly spelled closer', () => {
    expect(humanizeParseError(NEWLINE_SYMPTOM, 'ENDCLASS')).not.toContain('did you mean');
  });

  it('stays quiet for ambiguous or unrelated lone words (non-greedy)', () => {
    // bare END is ambiguous; ENDPOINT is a real identifier; both fall through.
    expect(humanizeParseError("no viable alternative at input 'END\\n'", 'END')).not.toContain('did you mean END');
    expect(humanizeParseError("no viable alternative at input 'ENDPOINT\\n'", 'ENDPOINT')).not.toContain('did you mean');
  });

  it('does not touch lines that are not a lone bareword', () => {
    const msg = humanizeParseError("mismatched input '<-' expecting ':'", 'MyCat <- NEW Cat("Kitty")');
    expect(msg).not.toContain('did you mean');
    expect(msg).toContain('variable name before `<-`');
  });
});

// ─── Characterization tests (pin behavior through the A Level refactor) ──────

describe('execute — power operator', () => {
  it('computes integer power with literals', async () => {
    const { outputs } = await runCode('OUTPUT 2 ^ 3\n');
    expect(outputs).toEqual(['8']);
  });

  it('computes power with an identifier base', async () => {
    const { outputs } = await runCode('x <- 5\nOUTPUT x ^ 2\n');
    expect(outputs).toEqual(['25']);
  });

  it('power is right-associative', async () => {
    const { outputs } = await runCode('OUTPUT 2 ^ 3 ^ 2\n');
    expect(outputs).toEqual(['512']);
  });
});

describe('execute — division chains', () => {
  it('evaluates spaced division left to right', async () => {
    const { outputs } = await runCode('OUTPUT 100 / 2 / 5\n');
    expect(outputs).toEqual(['10']);
  });
});

describe('execute — CASE with OTHERWISE', () => {
  it('matches a clause and skips OTHERWISE', async () => {
    const code = [
      'x <- 5',
      'CASE OF x',
      '  1 : OUTPUT "one"',
      '  5 : OUTPUT "five"',
      '  OTHERWISE : OUTPUT "other"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['five']);
  });

  it('falls back to OTHERWISE when nothing matches', async () => {
    const code = [
      'x <- 99',
      'CASE OF x',
      '  1 : OUTPUT "one"',
      '  OTHERWISE : OUTPUT "other"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['other']);
  });
});

describe('execute — INPUT into array element', () => {
  it('stores input into a 1D element', async () => {
    const { outputs } = await runCode('INPUT arr[2]\nOUTPUT arr[2]\n', ['42']);
    expect(outputs).toEqual(['42']);
  });
});

describe('execute — parameter passing', () => {
  it('passes scalars by value (caller unchanged)', async () => {
    const code = [
      'PROCEDURE Double(x : INTEGER)',
      '  x <- x * 2',
      '  OUTPUT x',
      'ENDPROCEDURE',
      'n <- 5',
      'CALL Double(n)',
      'OUTPUT n',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['10', '5']);
  });

  it('calls a user function in an expression', async () => {
    const code = [
      'FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER',
      '  RETURN a + b',
      'ENDFUNCTION',
      'OUTPUT Add(2, 3)',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['5']);
  });
});

describe('execute — RANDOM builtin', () => {
  it('RANDOM() returns a real in [0, 1)', async () => {
    const { outputs } = await runCode('x <- RANDOM()\nOUTPUT x >= 0 AND x < 1\n');
    expect(outputs).toEqual(['TRUE']);
  });
});

describe('execute — whole-array misuse', () => {
  it('OUTPUT of a whole array raises a friendly error', async () => {
    await expect(
      runCode('DECLARE arr : ARRAY[1:3] OF INTEGER\nOUTPUT arr\n'),
    ).rejects.toThrow(/is an array/);
  });
});

// ─── A Level (9618): records, enums, sets, DATE ──────────────────────────────

describe('A Level — record types', () => {
  it('declares a record type and uses dot notation (guide example)', async () => {
    const code = [
      'TYPE StudentRecord',
      '  DECLARE LastName : STRING',
      '  DECLARE FirstName : STRING',
      '  DECLARE YearGroup : INTEGER',
      '  DECLARE FormGroup : CHAR',
      'ENDTYPE',
      'DECLARE Pupil1 : StudentRecord',
      'Pupil1.LastName <- "Johnson"',
      'Pupil1.Firstname <- "Leroy"',
      'Pupil1.YearGroup <- 6',
      "Pupil1.FormGroup <- 'A'",
      'OUTPUT Pupil1.LastName & " " & Pupil1.FirstName',
      'OUTPUT Pupil1.YearGroup',
      'OUTPUT Pupil1.FormGroup',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Johnson Leroy', '6', 'A']);
  });

  it('records are copied by value on assignment', async () => {
    const code = [
      'TYPE StudentRecord',
      '  DECLARE LastName : STRING',
      '  DECLARE YearGroup : INTEGER',
      'ENDTYPE',
      'DECLARE Pupil1 : StudentRecord',
      'DECLARE Pupil2 : StudentRecord',
      'Pupil1.LastName <- "Johnson"',
      'Pupil1.YearGroup <- 6',
      'Pupil2 <- Pupil1',
      'Pupil1.LastName <- "Smith"',
      'OUTPUT Pupil2.LastName',
      'OUTPUT Pupil2.YearGroup',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Johnson', '6']);
  });

  it('supports arrays of records with chained designators (guide example)', async () => {
    const code = [
      'TYPE StudentRecord',
      '  DECLARE YearGroup : INTEGER',
      'ENDTYPE',
      'DECLARE Form : ARRAY[1:30] OF StudentRecord',
      'FOR Index <- 1 TO 30',
      '  Form[Index].YearGroup <- Form[Index].YearGroup + 1',
      'NEXT Index',
      'OUTPUT Form[15].YearGroup',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['1']);
  });

  it('INPUT can target a record field', async () => {
    const code = [
      'TYPE R',
      '  DECLARE Name : STRING',
      'ENDTYPE',
      'DECLARE p : R',
      'INPUT p.Name',
      'OUTPUT p.Name',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code, ['Alice']);
    expect(outputs).toEqual(['Alice']);
  });

  it('unknown record field raises a friendly error', async () => {
    const code = [
      'TYPE R',
      '  DECLARE Name : STRING',
      'ENDTYPE',
      'DECLARE p : R',
      'p.Age <- 5',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/no field 'Age'/);
  });
});

describe('A Level — enumerated types', () => {
  it('declares an enum and assigns members (guide example)', async () => {
    const code = [
      'TYPE Season = (Spring, Summer, Autumn, Winter)',
      'DECLARE ThisSeason : Season',
      'ThisSeason <- Spring',
      'OUTPUT ThisSeason',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Spring']);
  });

  it('supports ordinal arithmetic on enum values', async () => {
    const code = [
      'TYPE Season = (Spring, Summer, Autumn, Winter)',
      'ThisSeason <- Spring',
      'NextSeason <- ThisSeason + 1',
      'OUTPUT NextSeason',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Summer']);
  });

  it('compares enum values by position', async () => {
    const code = [
      'TYPE Season = (Spring, Summer, Autumn, Winter)',
      'a <- Spring',
      'b <- Winter',
      'OUTPUT a < b',
      'OUTPUT a = Spring',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['TRUE', 'TRUE']);
  });

  it('stepping outside the enum range raises an error', async () => {
    const code = [
      'TYPE Season = (Spring, Summer, Autumn, Winter)',
      'a <- Winter',
      'b <- a + 1',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/outside the values of 'Season'/);
  });
});

describe('A Level — sets', () => {
  it('declares a set type and DEFINEs a set value (guide example)', async () => {
    const code = [
      'TYPE LetterSet = SET OF CHAR',
      "DEFINE Vowels ('A', 'E', 'I', 'O', 'U') : LetterSet",
      'OUTPUT "ok"',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['ok']);
  });
});

describe('A Level — DATE type', () => {
  it('parses date literals and formats them as dd/mm/yyyy', async () => {
    const { outputs } = await runCode('d <- 02/01/2005\nOUTPUT d\n');
    expect(outputs).toEqual(['02/01/2005']);
  });

  it('compares dates chronologically', async () => {
    const code = [
      'a <- 02/01/2005',
      'b <- 15/06/2010',
      'OUTPUT a < b',
      'OUTPUT a = 02/01/2005',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['TRUE', 'TRUE']);
  });

  it('DECLARE with DATE gives a default date', async () => {
    const { outputs } = await runCode('DECLARE d : DATE\nOUTPUT d\n');
    expect(outputs).toEqual(['01/01/1900']);
  });

  it('rejects impossible dates', async () => {
    await expect(runCode('d <- 31/02/2005\nOUTPUT d\n')).rejects.toThrow(/not a valid date/);
  });

  it('spaced division is not parsed as a date', async () => {
    const { outputs } = await runCode('OUTPUT 10 / 02 / 2005\n');
    expect(outputs).toEqual([String(10 / 2 / 2005)]);
  });
});

describe('A Level — whole-array and 2D INPUT', () => {
  it('whole arrays are copied by value on assignment', async () => {
    const code = [
      'DECLARE a : ARRAY[1:3] OF INTEGER',
      'a[1] <- 5',
      'b <- a',
      'b[1] <- 9',
      'OUTPUT a[1] & " " & b[1]',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['5 9']);
  });

  it('INPUT can target a 2D array element', async () => {
    const code = [
      'DECLARE g : ARRAY[1:2, 1:2] OF INTEGER',
      'INPUT g[1, 2]',
      'OUTPUT g[1, 2]',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code, ['7']);
    expect(outputs).toEqual(['7']);
  });
});

// ─── A Level (9618): pointers ────────────────────────────────────────────────

describe('A Level — pointers', () => {
  it('address-of and dereference read/write (guide example)', async () => {
    const code = [
      'TYPE TIntPointer = ^INTEGER',
      'DECLARE MyPointer : TIntPointer',
      'DECLARE Num : INTEGER',
      'Num <- 5',
      'MyPointer <- ^Num',
      'OUTPUT MyPointer^',
      'MyPointer^ <- 10',
      'OUTPUT Num',
      'OUTPUT MyPointer^ + 1',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['5', '10', '11']);
  });

  it('pointer to an enum variable advances via deref arithmetic (guide example)', async () => {
    const code = [
      'TYPE Season = (Spring, Summer, Autumn, Winter)',
      'DECLARE ThisSeason : Season',
      'DECLARE NextSeason : Season',
      'ThisSeason <- Spring',
      'MyPointer <- ^ThisSeason',
      'NextSeason <- MyPointer^ + 1',
      'OUTPUT NextSeason',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Summer']);
  });

  it('deref binds tighter than subtraction (p^ - 1 means (p^) - 1)', async () => {
    const code = [
      'x <- 5',
      'p <- ^x',
      'OUTPUT p^ - 1',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['4']);
  });

  it('dereferencing an unassigned pointer raises a friendly error', async () => {
    const code = [
      'TYPE TIntPointer = ^INTEGER',
      'DECLARE p : TIntPointer',
      'OUTPUT p^',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/does not point anywhere yet/);
  });
});

// ─── A Level (9618): CASE ranges and BYREF/BYVAL ─────────────────────────────

describe('A Level — CASE enhancements', () => {
  it('matches range labels (value TO value)', async () => {
    const code = [
      'x <- 7',
      'CASE OF x',
      '  1 TO 5 : OUTPUT "low"',
      '  6 TO 10 : OUTPUT "high"',
      '  OTHERWISE : OUTPUT "other"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['high']);
  });

  it('matches char ranges', async () => {
    const code = [
      "c <- 'm'",
      'CASE OF c',
      "  'a' TO 'z' : OUTPUT \"lower\"",
      '  OTHERWISE : OUTPUT "other"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['lower']);
  });

  it('matches multi-value labels', async () => {
    const code = [
      "c <- 'w'",
      'CASE OF c',
      "  'W', 'w' : OUTPUT \"up\"",
      '  OTHERWISE : OUTPUT "?"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['up']);
  });

  it('CASE OF works on an array element designator', async () => {
    const code = [
      'DECLARE a : ARRAY[1:3] OF INTEGER',
      'a[2] <- 2',
      'CASE OF a[2]',
      '  1 : OUTPUT "one"',
      '  2 : OUTPUT "two"',
      'ENDCASE',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['two']);
  });
});

describe('A Level — BYREF / BYVAL parameters', () => {
  it('SWAP with sticky BYREF swaps both arguments (guide example)', async () => {
    const code = [
      'PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)',
      '  Temp <- X',
      '  X <- Y',
      '  Y <- Temp',
      'ENDPROCEDURE',
      'a <- 1',
      'b <- 2',
      'CALL SWAP(a, b)',
      'OUTPUT a',
      'OUTPUT b',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['2', '1']);
  });

  it('BYVAL after BYREF switches back to copying', async () => {
    const code = [
      'PROCEDURE P(BYREF X : INTEGER, BYVAL Y : INTEGER)',
      '  X <- 100',
      '  Y <- 100',
      'ENDPROCEDURE',
      'a <- 1',
      'b <- 2',
      'CALL P(a, b)',
      'OUTPUT a',
      'OUTPUT b',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['100', '2']);
  });

  it('BYREF works with array elements', async () => {
    const code = [
      'PROCEDURE Reset(BYREF n : INTEGER)',
      '  n <- 0',
      'ENDPROCEDURE',
      'DECLARE arr : ARRAY[1:3] OF INTEGER',
      'arr[2] <- 9',
      'CALL Reset(arr[2])',
      'OUTPUT arr[2]',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['0']);
  });

  it('BYVAL arrays are copied — the caller array is untouched', async () => {
    const code = [
      'PROCEDURE Wipe(a : ARRAY[1:3] OF INTEGER)',
      '  a[1] <- 0',
      'ENDPROCEDURE',
      'DECLARE arr : ARRAY[1:3] OF INTEGER',
      'arr[1] <- 5',
      'CALL Wipe(arr)',
      'OUTPUT arr[1]',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['5']);
  });

  it('passing an expression to a BYREF parameter raises a friendly error', async () => {
    const code = [
      'PROCEDURE Reset(BYREF n : INTEGER)',
      '  n <- 0',
      'ENDPROCEDURE',
      'CALL Reset(1 + 2)',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/needs a variable/);
  });
});

// ─── A Level (9618): random-access files ─────────────────────────────────────

describe('A Level — random-access files', () => {
  it('round-trips a record with SEEK / PUTRECORD / GETRECORD (guide pattern)', async () => {
    const code = [
      'TYPE Student',
      '  DECLARE Name : STRING',
      '  DECLARE YearGroup : INTEGER',
      'ENDTYPE',
      'DECLARE Pupil : Student',
      'DECLARE Found : Student',
      'Pupil.Name <- "Leroy"',
      'Pupil.YearGroup <- 6',
      'OPENFILE "students.dat" FOR RANDOM',
      'SEEK "students.dat", 10',
      'PUTRECORD "students.dat", Pupil',
      'CLOSEFILE "students.dat"',
      'OPENFILE "students.dat" FOR RANDOM',
      'SEEK "students.dat", 10',
      'GETRECORD "students.dat", Found',
      'CLOSEFILE "students.dat"',
      'OUTPUT Found.Name',
      'OUTPUT Found.YearGroup',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Leroy', '6']);
  });

  it('reading an empty record slot raises a friendly error', async () => {
    const code = [
      'DECLARE x : INTEGER',
      'OPENFILE "f.dat" FOR RANDOM',
      'SEEK "f.dat", 3',
      'GETRECORD "f.dat", x',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/No record at position 3/);
  });

  it('text files still work end to end', async () => {
    const code = [
      'OPENFILE "notes.txt" FOR WRITE',
      'WRITEFILE "notes.txt", "hello"',
      'CLOSEFILE "notes.txt"',
      'OPENFILE "notes.txt" FOR READ',
      'READFILE "notes.txt", line',
      'CLOSEFILE "notes.txt"',
      'OUTPUT line',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['hello']);
  });
});

// ─── A Level (9618): classes and inheritance ─────────────────────────────────

describe('A Level — classes', () => {
  it('runs the guide Pet/Cat inheritance example end to end', async () => {
    const code = [
      'CLASS Pet',
      '  PRIVATE Name : STRING',
      '  PUBLIC PROCEDURE NEW(GivenName : STRING)',
      '    Name <- GivenName',
      '  ENDPROCEDURE',
      '  PUBLIC FUNCTION GetName() RETURNS STRING',
      '    RETURN Name',
      '  ENDFUNCTION',
      'ENDCLASS',
      'CLASS Cat INHERITS Pet',
      '  PRIVATE Breed : STRING',
      '  PUBLIC PROCEDURE NEW(GivenName : STRING, GivenBreed : STRING)',
      '    SUPER.NEW(GivenName)',
      '    Breed <- GivenBreed',
      '  ENDPROCEDURE',
      '  PUBLIC FUNCTION Describe() RETURNS STRING',
      '    RETURN GetName() & " is a " & Breed',
      '  ENDFUNCTION',
      'ENDCLASS',
      'MyCat <- NEW Cat("Kitty", "Shorthaired")',
      'OUTPUT MyCat.Describe()',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Kitty is a Shorthaired']);
  });

  it('supports bare and CALL method-call statements (guide example)', async () => {
    const code = [
      'CLASS Player',
      '  PRIVATE Attempts : INTEGER',
      '  PUBLIC PROCEDURE SetAttempts(Number : INTEGER)',
      '    Attempts <- Number',
      '  ENDPROCEDURE',
      '  PUBLIC FUNCTION GetAttempts() RETURNS INTEGER',
      '    RETURN Attempts',
      '  ENDFUNCTION',
      'ENDCLASS',
      'P1 <- NEW Player()',
      'P1.SetAttempts(5)',
      'OUTPUT P1.GetAttempts()',
      'CALL P1.SetAttempts(3)',
      'OUTPUT P1.GetAttempts()',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['5', '3']);
  });

  it('fields default per their declared type', async () => {
    const code = [
      'CLASS Counter',
      '  PUBLIC Count : INTEGER',
      '  PUBLIC PROCEDURE Increment()',
      '    Count <- Count + 1',
      '  ENDPROCEDURE',
      'ENDCLASS',
      'c <- NEW Counter()',
      'c.Increment()',
      'c.Increment()',
      'OUTPUT c.Count',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['2']);
  });

  it('private fields cannot be read from outside the class', async () => {
    const code = [
      'CLASS Pet',
      '  PRIVATE Name : STRING',
      'ENDCLASS',
      'p <- NEW Pet()',
      'OUTPUT p.Name',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/private property 'Name'/);
  });

  it('private methods cannot be called from outside the class', async () => {
    const code = [
      'CLASS Pet',
      '  PRIVATE FUNCTION Secret() RETURNS INTEGER',
      '    RETURN 42',
      '  ENDFUNCTION',
      'ENDCLASS',
      'p <- NEW Pet()',
      'OUTPUT p.Secret()',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow(/private method 'Secret'/);
  });

  it('SUPER outside a class raises a friendly error', async () => {
    await expect(runCode('SUPER.NEW(1)\n')).rejects.toThrow(/inside a class method/);
  });
});

// ─── Soft keywords: A Level keywords stay usable as variable names ───────────

describe('soft keywords as variable names', () => {
  it('Date works as a variable name', async () => {
    const { outputs } = await runCode('DECLARE Date : STRING\nDate <- "Monday"\nOUTPUT Date\n');
    expect(outputs).toEqual(['Monday']);
  });

  it('Class works as a variable name (common in IGCSE questions)', async () => {
    const { outputs } = await runCode('DECLARE Class : STRING\nClass <- "10B"\nOUTPUT Class\n');
    expect(outputs).toEqual(['10B']);
  });

  it('Random works as a variable while RANDOM() stays a builtin', async () => {
    const { outputs } = await runCode('Random <- RANDOM()\nOUTPUT Random >= 0 AND Random < 1\n');
    expect(outputs).toEqual(['TRUE']);
  });

  it('Type, New, Set and Seek work as variable names', async () => {
    const code = [
      'Type <- "bus"',
      'New <- 5',
      'Set <- 2',
      'Seek <- New + Set',
      'OUTPUT Type & New & Set & Seek',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['bus527']);
  });

  it('soft keywords work as FOR loop variables', async () => {
    const code = [
      'Total <- 0',
      'FOR Date <- 1 TO 3',
      '    Total <- Total + Date',
      'NEXT Date',
      'OUTPUT Total',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['6']);
  });

  it('soft keywords work as record field names', async () => {
    const code = [
      'TYPE Booking',
      '  DECLARE Date : DATE',
      '  DECLARE Class : STRING',
      'ENDTYPE',
      'DECLARE b : Booking',
      'b.Date <- 02/01/2005',
      'b.Class <- "Economy"',
      'OUTPUT b.Date',
      'OUTPUT b.Class',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['02/01/2005', 'Economy']);
  });

  it('soft keywords work as parameter names', async () => {
    const code = [
      'PROCEDURE Show(Date : STRING)',
      '    OUTPUT Date',
      'ENDPROCEDURE',
      'CALL Show("Tuesday")',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['Tuesday']);
  });

  it('A Level constructs still parse alongside soft keywords', () => {
    expect(parseErrors('TYPE Season = (Spring, Summer)\n')).toEqual([]);
    expect(parseErrors('OPENFILE "f.dat" FOR RANDOM\n')).toEqual([]);
    expect(parseErrors('SEEK "f.dat", 2\n')).toEqual([]);
  });
});

// ─── Empty blocks (comment-only scaffolds must parse and run) ────────────────

describe('empty blocks', () => {
  it('IF with a comment-only branch runs the other branch', async () => {
    const code = [
      'x <- 5',
      'IF x > 10 THEN',
      '    // nothing here yet',
      'ELSE',
      '    OUTPUT "small"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['small']);
  });

  it('ELSEIF chain with an empty branch keeps correct indexing', async () => {
    const code = [
      'x <- 85',
      'IF x >= 90 THEN',
      '    // todo',
      'ELSEIF x >= 80 THEN',
      '    OUTPUT "B"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['B']);
  });

  it('empty FOR, WHILE and REPEAT bodies run as no-ops', async () => {
    const code = [
      'FOR i <- 1 TO 3',
      'NEXT i',
      'WHILE FALSE DO',
      'ENDWHILE',
      'REPEAT',
      'UNTIL TRUE',
      'OUTPUT "done"',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['done']);
  });

  it('empty procedure body is callable', async () => {
    const code = [
      'PROCEDURE P()',
      'ENDPROCEDURE',
      'CALL P()',
      'OUTPUT "ok"',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['ok']);
  });

  it('empty CASE clause matches and does nothing', async () => {
    const code = [
      'x <- 1',
      'CASE OF x',
      '  1 :',
      '  OTHERWISE : OUTPUT "other"',
      'ENDCASE',
      'OUTPUT "end"',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['end']);
  });
});

// ─── Bundled programs must always parse ──────────────────────────────────────

describe('bundled programs parse with the current grammar', () => {
  it('every example in data/examples.ts parses', () => {
    const failures: string[] = [];
    for (const ex of examples) {
      const errors = parseErrors(ex.code + '\n');
      if (errors.length > 0) {
        failures.push(`"${ex.title}": ${errors[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });

  // starterCode blocks are deliberately incomplete scaffolds in places (e.g. the
  // literal `...` placeholders referenced by hints), so only solutions are
  // required to parse. Placeholder starters get a friendly error instead — see
  // the `...` hint test below.
  it('every solution in prisma/seed.ts parses', () => {
    const seedSrc = readFileSync(resolve(__dirname, '../../../prisma/seed.ts'), 'utf-8');
    const codeBlocks = [...seedSrc.matchAll(/solution:\s*`([^`]*)`/g)];
    expect(codeBlocks.length).toBeGreaterThan(0);

    const failures: string[] = [];
    for (const match of codeBlocks) {
      const code = match[1];
      if (code.trim() === '') continue;
      const errors = parseErrors(code + '\n');
      if (errors.length > 0) {
        failures.push(`solution starting "${code.trimStart().slice(0, 40)}...": ${errors[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('running a starter with a `...` placeholder gives a friendly hint', () => {
    const { errors } = parse('IF ... THEN\n    OUTPUT "Even"\nENDIF\n');
    expect(errors.length).toBeGreaterThan(0);
    const msg = humanizeParseError(errors[0].message);
    expect(msg).toContain('Replace the `...` placeholder');
  });
});
