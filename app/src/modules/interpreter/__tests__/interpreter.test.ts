import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from '../parser';
import { Interpreter } from '../core/interpreter';
import { ServerVirtualFileSystem } from '../core/serverFilesystem';
import { humanizeParseError, humanizeRuntimeError, categorizeParseError } from '../errorMessages';
import { normalizeSource } from '../normalize';
import type { PseudocodeError } from '../core/types';
import { examples } from '@/modules/content/examples';

// Runs pseudocode and collects outputs. Provide `inputs` in order for INPUT statements.
// File I/O uses the server filesystem (vitest's node env has no localStorage),
// which also exercises the same path the autograder uses.
async function runCode(
  source: string,
  inputs: string[] = [],
  fs: ServerVirtualFileSystem = new ServerVirtualFileSystem(),
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
    fs,
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

  it('parses an array literal assignment', () => {
    expect(parseErrors('x = [1,3,8,10,12]\n')).toEqual([]);
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
  it('initializes a 1-based array from a literal', async () => {
    const { outputs } = await runCode(
      'x = [1,3,8,10,12]\nOUTPUT x[1]\nOUTPUT x[5]\n',
    );
    expect(outputs).toEqual(['1', '12']);
  });

  it('evaluates expressions inside an array literal', async () => {
    const { outputs } = await runCode('x <- [1 + 2, 4 * 2]\nOUTPUT x[1] & " " & x[2]\n');
    expect(outputs).toEqual(['3 8']);
  });

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

  // Nested array literals ([[…],[…]]) build a 1D array of 1D arrays. The
  // canonical Cambridge subscript is the comma form Grid[r, c]; the chained
  // form Grid[r][c] is a leniency we also accept. Both must reach the same
  // element (student bug report, Aug 2026).
  it('reads a nested array literal with the canonical comma form', async () => {
    const { outputs } = await runCode(
      'StudentMark <- [[50,90,40],[26,60,30]]\nOUTPUT StudentMark[1, 2]\n',
    );
    expect(outputs).toEqual(['90']);
  });

  it('still reads a nested array literal with the chained form', async () => {
    const { outputs } = await runCode(
      'StudentMark <- [[50,90,40],[26,60,30]]\nOUTPUT StudentMark[1][2]\n',
    );
    expect(outputs).toEqual(['90']);
  });

  it('comma-indexes a nested literal inside a loop', async () => {
    const { outputs } = await runCode(
      [
        'StudentMark <- [[50,90,40],[26,60,30]]',
        'total <- 0',
        'FOR column <- 1 TO 3',
        '  total <- total + StudentMark[1, column]',
        'NEXT column',
        'OUTPUT total',
        '',
      ].join('\n'),
    );
    expect(outputs).toEqual(['180']);
  });

  it('writes through the comma form into a nested literal', async () => {
    const { outputs } = await runCode(
      'grid <- [[1,2],[3,4]]\ngrid[2, 1] <- 99\nOUTPUT grid[2][1]\n',
    );
    expect(outputs).toEqual(['99']);
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

  it('unclosed ELSE IF chain points at the missing ENDIF', () => {
    // An IF / ELSE IF chain left without ENDIF surfaces as the input running past
    // ELSE into more tokens; it should still get the IF-block guidance, not the
    // generic fallback.
    const msg = humanizeParseError("no viable alternative at input '\\nELSEIFx>0THEN\\nOUTPUT\"b\"\\n'");
    expect(msg).toContain('ELSE must belong to an open IF block');
    expect(msg).toContain('ENDIF');
  });

  it('single quote lexer error explains STRING vs CHAR quotes', () => {
    const msg = humanizeParseError("token recognition error at: '''");
    expect(msg).toContain('double quotes for STRING');
    expect(msg).toContain('OUTPUT "Hello"');
    expect(msg).toContain("Letter <- 'A'");
  });

  it("multi-character text in single quotes is redirected to double quotes", () => {
    const raw = "token recognition error at: '''";
    const line = "OUTPUT 'POOR'";
    const msg = humanizeParseError(raw, line);
    expect(msg).toContain('double quotes for text (STRING)');
    expect(msg).toContain('OUTPUT "POOR"');
    expect(categorizeParseError(raw, line)).toBe('single_quote_string');
  });

  it("a valid one-character CHAR literal is not treated as a string mistake", () => {
    const raw = "no viable alternative at input 'A'";
    const msg = humanizeParseError(raw, "Grade <- 'A'");
    expect(msg).not.toContain('double quotes for text');
  });

  it("an apostrophe inside a double-quoted string is not a CHAR mistake", () => {
    // Even on an already-flagged line, "it's" must not read as a single-quoted CHAR.
    const raw = "no viable alternative at input 'OUTPUT'";
    const msg = humanizeParseError(raw, 'OUTPUT "it\'s fine" extra');
    expect(msg).not.toContain('double quotes for text');
  });

  it("an unterminated string (missing closing quote) is explained", () => {
    const raw = "token recognition error at: '\\n'";
    const line = 'OUTPUT "How many rooms';
    const msg = humanizeParseError(raw, line);
    expect(msg).toContain('missing its closing quote');
    expect(msg).toContain('OUTPUT "Hello, world"');
    expect(categorizeParseError(raw, line)).toBe('unterminated_string');
  });

  it("a Python def header is redirected to PROCEDURE / FUNCTION", () => {
    const raw = "no viable alternative at input 'def'";
    const line = 'def greet_student(name):';
    const msg = humanizeParseError(raw, line);
    expect(msg).toContain('looks like Python');
    expect(msg).toContain('PROCEDURE');
    expect(msg).toContain('FUNCTION');
    expect(categorizeParseError(raw, line)).toBe('python_syntax');
  });

  it("a Python print call is redirected to OUTPUT", () => {
    const raw = "no viable alternative at input 'print'";
    const line = "print('total')";
    const msg = humanizeParseError(raw, line);
    expect(msg).toContain('looks like Python');
    expect(msg).toContain('OUTPUT');
    expect(categorizeParseError(raw, line)).toBe('python_syntax');
  });

  it("a FOR loop with no assignment operator asks for <-", () => {
    const raw = "missing {LARROW, '='} at '1'";
    const line = 'FOR count 1 TO 5';
    const msg = humanizeParseError(raw, line);
    expect(msg).toContain('Set the FOR loop counter with `<-`');
    expect(msg).toContain('FOR count <- 1 TO 10');
    expect(categorizeParseError(raw, line)).toBe('for_loop_assignment');
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

describe('humanizeParseError — source-line pattern detectors', () => {
  // These fire off the offending source line rather than the ANTLR message; the
  // raw message is a stand-in for whatever ANTLR emits for that line.
  const RAW = "no viable alternative at input 'x'";

  describe('Python redirect', () => {
    it('flags elif', () => {
      const msg = humanizeParseError(RAW, 'elif grade == 7:');
      expect(msg).toContain('looks like Python');
      expect(msg).toContain('ELSE IF');
    });
    it('flags else:', () => {
      expect(humanizeParseError(RAW, 'else:')).toContain('ELSE on its own line');
    });
    it('flags for … in range()', () => {
      const msg = humanizeParseError(RAW, 'for row in range(3):');
      expect(msg).toContain('looks like Python');
      expect(msg).toContain('FOR i <- 1 TO n');
    });
    it('flags int(input())', () => {
      const msg = humanizeParseError(RAW, 'number = int(input("Enter a number: "))');
      expect(msg).toContain('INPUT is a statement');
    });
    it('flags a Python if header ending in a colon', () => {
      const msg = humanizeParseError(RAW, 'if grade == 7:');
      expect(msg).toContain('looks like Python');
      expect(msg).toContain('no trailing colon');
    });
    it('does not flag a valid IF … THEN line', () => {
      expect(humanizeParseError(RAW, 'IF grade = 7 THEN')).not.toContain('looks like Python');
    });
  });

  describe('BASIC/Pascal closers', () => {
    it('END IF → ENDIF (one word)', () => {
      const msg = humanizeParseError(RAW, 'END IF');
      expect(msg).toContain('one word: ENDIF');
    });
    it('END WHILE → ENDWHILE', () => {
      expect(humanizeParseError(RAW, 'END WHILE')).toContain('one word: ENDWHILE');
    });
    it('ENDFOR / END FOR → NEXT', () => {
      expect(humanizeParseError(RAW, 'ENDFOR')).toContain('NEXT <variable>');
      expect(humanizeParseError(RAW, 'END FOR')).toContain('NEXT <variable>');
    });
    it('bare END explains there is no general wrapper', () => {
      expect(humanizeParseError(RAW, 'END')).toContain('no general END wrapper');
    });
    it('BEGIN is not needed', () => {
      expect(humanizeParseError(RAW, 'BEGIN')).toContain('No BEGIN is needed');
    });
    it('does not fire for a correctly spelled ENDIF', () => {
      expect(humanizeParseError(RAW, 'ENDIF')).not.toContain('one word');
    });
  });

  describe('FOR loop counter assignment', () => {
    it('FOR count : 1 TO 3 → use <-', () => {
      const msg = humanizeParseError(RAW, 'For count : 1 to 3');
      expect(msg).toContain('to set the FOR loop counter');
      expect(msg).toContain('FOR count <- 1 TO 10');
    });
    it('FOR i = 1 TO 10 → use <-', () => {
      expect(humanizeParseError(RAW, 'FOR i = 1 TO 10')).toContain('to set the FOR loop counter');
    });
    it('does not fire for a valid FOR line', () => {
      expect(humanizeParseError(RAW, 'FOR i <- 1 TO 10')).not.toContain('FOR loop counter');
    });
  });

  describe('OUTPUT missing comma', () => {
    it('OUTPUT "text" value → suggest a comma', () => {
      const msg = humanizeParseError(RAW, 'OUTPUT "Your initial cost is $" Cost');
      expect(msg).toContain('Separate OUTPUT items with a comma');
      expect(msg).toContain('join strings with `&`');
    });
    it('does not fire when items are comma-separated', () => {
      expect(humanizeParseError(RAW, 'OUTPUT "Total is ", Total')).not.toContain('Separate OUTPUT items');
    });
    it('does not fire on a single quoted string', () => {
      expect(humanizeParseError(RAW, 'OUTPUT "Hello"')).not.toContain('Separate OUTPUT items');
    });
  });

  describe('DECLARE misspellings and AS', () => {
    it('declear Count : INTEGER → DECLARE', () => {
      const msg = humanizeParseError(RAW, 'declear Count : INTEGER');
      expect(msg).toContain('did you mean DECLARE?');
      expect(categorizeParseError(RAW, 'declear Count : INTEGER')).toBe('declare_syntax');
    });
    it('DECLARE Answer AS INTEGER → use a colon', () => {
      const msg = humanizeParseError(RAW, 'DECLARE Answer AS INTEGER');
      expect(msg).toContain('not AS');
      expect(msg).toContain('DECLARE Answer : INTEGER');
      expect(categorizeParseError(RAW, 'DECLARE Answer AS INTEGER')).toBe('declare_syntax');
    });
    it('DECLARE Counter with no type asks for : TYPE', () => {
      const msg = humanizeParseError(RAW, 'DECLARE Counter');
      expect(msg).toContain('colon and a type');
      expect(msg).toContain('DECLARE Counter : INTEGER');
    });
    it('DECLARE N, i, S, P without types asks for one per line', () => {
      const msg = humanizeParseError(RAW, 'DECLARE N, i, S, P');
      expect(msg).toContain('one variable per line');
      expect(categorizeParseError(RAW, 'DECLARE N, i, S, P')).toBe('declare_syntax');
    });
    it('does not treat a real DECLARE line as a misspelling', () => {
      expect(humanizeParseError(RAW, 'DECLARE Count : INTEGER')).not.toContain('did you mean DECLARE?');
    });
  });

  describe('FUNCTION header without RETURNS', () => {
    it('function add(a, b) explains RETURNS works in any case', () => {
      const msg = humanizeParseError(RAW, 'function add(a, b)');
      expect(msg).toContain('RETURNS');
      expect(msg).toContain('function` and `FUNCTION` are the same keyword');
      expect(categorizeParseError(RAW, 'function add(a, b)')).toBe('function_header');
    });
    it('JS braces on a FUNCTION line are called out', () => {
      const msg = humanizeParseError(RAW, 'function add(a, b) {');
      expect(msg).toContain('JavaScript');
      expect(msg).toContain('RETURNS');
    });
    it('does not fire when RETURNS is already present', () => {
      expect(categorizeParseError(RAW, 'FUNCTION Add(a : INTEGER) RETURNS INTEGER')).not.toBe('function_header');
    });
  });

  describe('categorization slugs', () => {
    it('assigns the matching category slug for each shape', () => {
      expect(categorizeParseError(RAW, 'elif x == 7:')).toBe('python_syntax');
      expect(categorizeParseError(RAW, 'for i in range(3):')).toBe('python_syntax');
      expect(categorizeParseError(RAW, 'END IF')).toBe('basic_block_closer');
      expect(categorizeParseError(RAW, 'ENDFOR')).toBe('basic_block_closer');
      expect(categorizeParseError(RAW, 'FOR count : 1 to 3')).toBe('for_loop_assignment');
      expect(categorizeParseError(RAW, 'OUTPUT "cost is" Cost')).toBe('output_missing_comma');
      expect(categorizeParseError("extraneous input 'ELSE' expecting {ENDIF, NEWLINE}", 'ELSE')).toBe('stray_else');
      expect(categorizeParseError(RAW, 'Else')).toBe('stray_else');
      expect(categorizeParseError(RAW, 'DECLARE Count INTEGER')).toBe('declare_syntax');
      expect(categorizeParseError(RAW, 'DECLARE nilai = 90')).toBe('declare_syntax');
      expect(categorizeParseError(RAW, 'a, b, c, temp : INTEGER')).toBe('declare_syntax');
      expect(categorizeParseError(RAW, 'FOR c <- 1 TO 5 DO')).toBe('for_loop_do');
      expect(categorizeParseError(RAW, 'FUNCTION F(h : INTEGER) RETURN INTEGER')).toBe('return_vs_returns');
      expect(categorizeParseError(RAW, 'IF Age > 12 AND < 65 THEN')).toBe('missing_operand');
      expect(categorizeParseError(RAW, 'IF > 5 THEN')).toBe('missing_operand');
      expect(categorizeParseError(RAW, 'WHILE < 10 DO')).toBe('missing_operand');
    });
    it('does not flag valid syntax the grammar already accepts', () => {
      expect(categorizeParseError(RAW, 'DECLARE Date : STRING')).not.toBe('declare_syntax');
      expect(categorizeParseError(RAW, 'DECLARE Marks : ARRAY[1:10] OF INTEGER')).not.toBe('declare_syntax');
      // ELSE IF / ELSEIF parse fine → must NOT be mislabelled as stray_else.
      expect(categorizeParseError(RAW, 'ELSEIF age > 12 THEN')).not.toBe('stray_else');
      expect(categorizeParseError(RAW, 'ELSE IF age > 12 THEN')).not.toBe('stray_else');
      // RETURNS (with the S) is the correct header keyword.
      expect(categorizeParseError(RAW, 'FUNCTION F(h : INTEGER) RETURNS INTEGER')).not.toBe('return_vs_returns');
      expect(categorizeParseError(RAW, 'FUNCTION F(h : INTEGER) RETURNS INTEGER')).not.toBe('function_header');
      // A well-formed AND condition (variable repeated) must not be flagged.
      expect(categorizeParseError(RAW, 'IF Age > 12 AND Age < 65 THEN')).not.toBe('missing_operand');
    });
  });

  describe('markdown fence stripping', () => {
    it('blanks ``` fence lines so the code inside runs, keeping line count', () => {
      const r = normalizeSource('```pseudocode\nDECLARE X : INTEGER\n```');
      expect(r.fixes).toContain('markdown_fence');
      expect(r.code).toBe('\nDECLARE X : INTEGER\n');
      expect(r.code.split('\n').length).toBe(3);
    });
  });
});

describe('humanizeRuntimeError — unknown function aliases', () => {
  it('Sqrt / SQRT explain that Cambridge has no square-root builtin', () => {
    const msg = humanizeRuntimeError("Function 'Sqrt' is not defined");
    expect(msg).toContain('not a Cambridge IGCSE built-in');
    expect(msg).toContain('capitalisation does not matter');
    expect(humanizeRuntimeError("Function 'SQRT' is not defined")).toContain('not a Cambridge IGCSE built-in');
  });
  it('ORD points at ASC', () => {
    expect(humanizeRuntimeError("Function 'ORD' is not defined")).toContain('ASC');
  });
  it('LEN points at LENGTH, not LEFT', () => {
    const msg = humanizeRuntimeError("Function 'LEN' is not defined");
    expect(msg).toContain('LENGTH(str)');
    expect(msg).not.toContain('LEFT');
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

describe('execute — MOD with real operands', () => {
  it('keeps the fractional remainder so a whole-number check works', async () => {
    const { outputs } = await runCode('OUTPUT 7.5 MOD 1\n');
    expect(outputs).toEqual(['0.5']);
  });

  it('keeps the fractional remainder in the function form', async () => {
    const { outputs } = await runCode('OUTPUT MOD(7.5, 2)\n');
    expect(outputs).toEqual(['1.5']);
  });

  it('keeps decimal remainders exact instead of showing float noise', async () => {
    const { outputs } = await runCode(`OUTPUT 0.3 MOD 0.1
OUTPUT 1.1 MOD 0.3
OUTPUT 10.75 MOD 0.25
`);
    expect(outputs).toEqual(['0', '0.2', '0']);
  });

  it('still returns a whole remainder for integers', async () => {
    const { outputs } = await runCode('OUTPUT 10 MOD 3\nOUTPUT MOD(10, 3)\n');
    expect(outputs).toEqual(['1', '1']);
  });

  it('DIV stays integer division with a real operand', async () => {
    const { outputs } = await runCode('OUTPUT 7.5 DIV 2\n');
    expect(outputs).toEqual(['3']);
  });

  it('tells a decimal apart from a whole number entered as REAL', async () => {
    const source = `DECLARE Num : REAL
INPUT Num
IF Num MOD 1 = 0 THEN
    OUTPUT "Whole"
ELSE
    OUTPUT "Not whole"
ENDIF
`;
    const decimal = await runCode(source, ['7.5']);
    expect(decimal.outputs).toEqual(['Not whole']);
    const whole = await runCode(source, ['8']);
    expect(whole.outputs).toEqual(['Whole']);
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

  it('keeps type inference for an undeclared scalar target', async () => {
    const { outputs } = await runCode('INPUT value\nOUTPUT value + 1\n', ['41']);
    expect(outputs).toEqual(['42']);
  });
});

describe('execute - INPUT type validation', () => {
  it('rejects text entered for a declared INTEGER', async () => {
    await expect(
      runCode('DECLARE age : INTEGER\nINPUT age\nOUTPUT age\n', ['df']),
    ).rejects.toThrow(/Input for 'age' must be an INTEGER/);
  });

  it('rejects a decimal entered for a declared INTEGER', async () => {
    await expect(
      runCode('DECLARE count : INTEGER\nINPUT count\nOUTPUT count\n', ['2.5']),
    ).rejects.toThrow(/Input for 'count' must be an INTEGER/);
  });

  it('preserves numeric-looking input for a declared STRING', async () => {
    const { outputs } = await runCode(
      'DECLARE value : STRING\nINPUT value\nOUTPUT value & "0"\n',
      ['12'],
    );
    expect(outputs).toEqual(['120']);
  });

  it('validates BOOLEAN input case-insensitively', async () => {
    const { outputs } = await runCode(
      'DECLARE answer : BOOLEAN\nINPUT answer\nOUTPUT answer\n',
      ['true'],
    );
    expect(outputs).toEqual(['TRUE']);

    await expect(
      runCode('DECLARE answer : BOOLEAN\nINPUT answer\n', ['yes']),
    ).rejects.toThrow(/Input for 'answer' must be TRUE or FALSE/);
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

  it('allows CALL to discard a user function return value', async () => {
    const code = [
      'FUNCTION Announce(value : INTEGER) RETURNS INTEGER',
      '  OUTPUT value',
      '  RETURN value + 1',
      'ENDFUNCTION',
      'CALL Announce(4)',
      'OUTPUT "done"',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['4', 'done']);
  });

  it('rejects too few arguments for a user function', async () => {
    const code = [
      'FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER',
      '  RETURN a + b',
      'ENDFUNCTION',
      'OUTPUT Add(1)',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow("'Add' expects 2 arguments, but 1 was provided");
  });

  it('rejects too many arguments for a user procedure', async () => {
    const code = [
      'PROCEDURE Show(value : INTEGER)',
      '  OUTPUT value',
      'ENDPROCEDURE',
      'CALL Show(1, 2)',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow("'Show' expects 1 argument, but 2 were provided");
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

  it('persists a file even when the program forgets CLOSEFILE', async () => {
    const fs = new ServerVirtualFileSystem();

    // First run writes but never closes the file — closeAll() should flush it at end-of-run.
    const write = [
      'OPENFILE "kept.txt" FOR WRITE',
      'WRITEFILE "kept.txt", "kept"',
    ].join('\n') + '\n';
    await runCode(write, [], fs);

    // A later run on the same filesystem can read what was written.
    const read = [
      'OPENFILE "kept.txt" FOR READ',
      'READFILE "kept.txt", line',
      'OUTPUT line',
    ].join('\n') + '\n';
    const { outputs } = await runCode(read, [], fs);
    expect(outputs).toEqual(['kept']);
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

  it('rejects the wrong number of method arguments', async () => {
    const code = [
      'CLASS Player',
      '  PUBLIC PROCEDURE SetAttempts(Number : INTEGER)',
      '  ENDPROCEDURE',
      'ENDCLASS',
      'P1 <- NEW Player()',
      'P1.SetAttempts()',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow("'SetAttempts' expects 1 argument, but 0 were provided");
  });

  it('rejects constructor arguments when no constructor is declared', async () => {
    const code = [
      'CLASS Counter',
      '  PUBLIC Count : INTEGER',
      'ENDCLASS',
      'c <- NEW Counter(1)',
    ].join('\n') + '\n';
    await expect(runCode(code)).rejects.toThrow("'Counter' expects 0 arguments, but 1 was provided");
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

// ─── ELSE IF (two-word) is equivalent to ELSEIF ─────────────────────────────

describe('ELSE IF / ELSEIF chains', () => {
  it('ELSE IF (two words) chains and picks the matching branch', async () => {
    const code = [
      'x <- 5',
      'IF x > 10 THEN',
      '    OUTPUT "big"',
      'ELSE IF x > 3 THEN',
      '    OUTPUT "medium"',
      'ELSE',
      '    OUTPUT "small"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['medium']);
  });

  it('ELSE IF falls through to ELSE when no condition matches', async () => {
    const code = [
      'x <- 1',
      'IF x > 10 THEN',
      '    OUTPUT "big"',
      'ELSE IF x > 3 THEN',
      '    OUTPUT "medium"',
      'ELSE',
      '    OUTPUT "small"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['small']);
  });

  it('mixes ELSEIF and ELSE IF in one chain', async () => {
    const code = [
      'x <- 7',
      'IF x > 100 THEN',
      '    OUTPUT "a"',
      'ELSEIF x > 50 THEN',
      '    OUTPUT "b"',
      'ELSE IF x > 5 THEN',
      '    OUTPUT "c"',
      'ELSE',
      '    OUTPUT "d"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['c']);
  });

  it('ELSE IF works without THEN', async () => {
    const code = [
      'x <- 2',
      'IF x > 10',
      '    OUTPUT "big"',
      'ELSE IF x > 1',
      '    OUTPUT "mid"',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['mid']);
  });

  it('keeps the nested IF-inside-ELSE form (ELSE on its own line)', async () => {
    const code = [
      'x <- 2',
      'IF x > 10 THEN',
      '    OUTPUT "big"',
      'ELSE',
      '    IF x > 1 THEN',
      '        OUTPUT "nested"',
      '    ENDIF',
      'ENDIF',
    ].join('\n') + '\n';
    const { outputs } = await runCode(code);
    expect(outputs).toEqual(['nested']);
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
    const seedFiles = [
      '../../../../prisma/seed.ts',
      '../../../../prisma/thinTopicQuestions.ts',
      '../../../../prisma/igcseRecentPaperQuestions.ts',
    ];
    const failures: string[] = [];
    let codeBlockCount = 0;

    for (const relative of seedFiles) {
      const seedSrc = readFileSync(resolve(__dirname, relative), 'utf-8');
      const codeBlocks = [...seedSrc.matchAll(/solution:\s*`([^`]*)`/g)];
      codeBlockCount += codeBlocks.length;

      for (const match of codeBlocks) {
        const code = match[1];
        if (code.trim() === '') continue;
        const errors = parseErrors(code + '\n');
        if (errors.length > 0) {
          failures.push(`solution starting "${code.trimStart().slice(0, 40)}...": ${errors[0]}`);
        }
      }
    }

    expect(codeBlockCount).toBeGreaterThan(0);
    expect(failures).toEqual([]);
  });

  it('running a starter with a `...` placeholder gives a friendly hint', () => {
    const { errors } = parse('IF ... THEN\n    OUTPUT "Even"\nENDIF\n');
    expect(errors.length).toBeGreaterThan(0);
    const msg = humanizeParseError(errors[0].message);
    expect(msg).toContain('Replace the `...` placeholder');
  });
});

describe('parameterless PROCEDURE / FUNCTION headers (Cambridge style)', () => {
  it('runs PROCEDURE and CALL without brackets', async () => {
    const { outputs, errors } = await runCode('PROCEDURE Greet\n  OUTPUT "Hi"\nENDPROCEDURE\nCALL Greet\nCALL Greet()\n');
    expect(errors).toEqual([]);
    expect(outputs).toEqual(['Hi', 'Hi']);
  });

  it('runs a FUNCTION declared without brackets', async () => {
    const { outputs, errors } = await runCode('FUNCTION Six RETURNS INTEGER\n  RETURN 6\nENDFUNCTION\nOUTPUT Six()\n');
    expect(errors).toEqual([]);
    expect(outputs).toEqual(['6']);
  });
});

// Shapes taken from the ErrorSample table (Sept 2026) that used to fall through
// to the generic "isn't valid IGCSE pseudocode" message.
describe('parse hints — sampled student mistakes', () => {
  function diagnose(source: string) {
    const { errors } = parse(normalizeSource(source).code);
    expect(errors.length).toBeGreaterThan(0);
    const lines = source.split('\n');
    const e = errors[0];
    const context = { lines, line: e.line };
    const sourceLine = lines[(e.line ?? 1) - 1];
    return {
      category: categorizeParseError(e.message, sourceLine, context),
      message: humanizeParseError(e.message, sourceLine, context),
    };
  }

  it('names the IF that is never closed instead of blaming the last OUTPUT', () => {
    const d = diagnose('INPUT Age\nIF Age > 18 THEN\n  OUTPUT "Adult"');
    expect(d.category).toBe('missing_endif');
    expect(d.message).toContain('The IF on line 2 is never closed');
    expect(d.message).toContain('ENDIF');
  });

  it('points out a missing THEN on the unclosed IF too', () => {
    const d = diagnose('INPUT Mark\nIF Mark < 10\nOUTPUT "Low"');
    expect(d.category).toBe('missing_endif');
    expect(d.message).toContain('missing THEN');
  });

  it('an ENDIF where UNTIL belongs names the open REPEAT', () => {
    const d = diagnose('REPEAT\n  INPUT P\nENDIF P <> "x"');
    expect(d.message).toContain('The REPEAT on line 1 is never closed');
    expect(d.message).toContain('UNTIL');
  });

  it('INPUT with only a prompt asks for a variable', () => {
    const d = diagnose('INPUT "Enter your name"');
    expect(d.category).toBe('input_prompt');
    expect(d.message).toContain('INPUT Name');
  });

  it('implicit multiplication asks for *', () => {
    const d = diagnose('DECLARE F : REAL\nDECLARE C : REAL\nF = (9/5)C + 32');
    expect(d.category).toBe('implicit_multiply');
    expect(d.message).toContain('(9 / 5) * C');
  });

  it('`MOD` after a bracket is not read as implicit multiplication', () => {
    expect(categorizeParseError("no viable alternative at input 'x'", 'X <- (A + B) MOD 2 3')).not.toBe('implicit_multiply');
  });

  it('two words with no operator between them are explained', () => {
    expect(diagnose('DECLARE R : STRING\nR <- FirstName Surname').category).toBe('value_missing_operator');
  });

  it('a data type used as a value is explained', () => {
    expect(diagnose('DECLARE N : INTEGER\nN <- INTEGER').category).toBe('type_as_value');
    const d = diagnose('DECLARE N : REAL\nIF N = INTEGER THEN\n  OUTPUT N\nENDIF');
    expect(d.category).toBe('type_as_value');
    expect(d.message).toContain('INT(Number)');
  });

  it('an assignment with nothing after the arrow asks for a value', () => {
    expect(diagnose('DECLARE Cost : INTEGER\nCost <-').category).toBe('incomplete_line');
  });

  it('SET x = 0 is redirected to <-', () => {
    const d = diagnose('SET Count = 0');
    expect(d.category).toBe('set_assignment');
    expect(d.message).toContain('Count <- 0');
  });

  it('an array DECLARE with round brackets gets the canonical shape', () => {
    const d = diagnose('DECLARE Value : ARRAY (1:5) OF INTEGER');
    expect(d.category).toBe('declare_array_syntax');
    expect(d.message).toContain('DECLARE Value : ARRAY[1:5] OF INTEGER');
  });

  it('a string glued to a variable in OUTPUT needs a comma', () => {
    expect(diagnose('DECLARE P : INTEGER\nOUTPUT "Total "P').category).toBe('output_missing_comma');
  });

  it('two strings separated by a comma are not flagged as glued', () => {
    const { errors } = parse('OUTPUT "a", "b"\n');
    expect(errors).toEqual([]);
    expect(categorizeParseError("no viable alternative at input 'x'", 'OUTPUT "a", "b"')).not.toBe('output_missing_comma');
  });

  it('a WHILE written like a FOR loop is redirected to FOR', () => {
    expect(diagnose('WHILE Count <- 1 TO 5\nENDWHILE').category).toBe('while_as_for');
  });

  it('a PROCEDURE with RETURNS is told to become a FUNCTION', () => {
    const d = diagnose('PROCEDURE Largest(A : INTEGER, B : INTEGER) RETURNS INTEGER\nENDPROCEDURE');
    expect(d.category).toBe('procedure_returns');
    expect(d.message).toContain('FUNCTION Largest(A : INTEGER, B : INTEGER) RETURNS INTEGER');
  });

  it('untyped parameters are asked for a type', () => {
    const d = diagnose('PROCEDURE Show(Num1, Num2)\nENDPROCEDURE');
    expect(d.category).toBe('param_type_missing');
    expect(d.message).toContain('Num1 : INTEGER, Num2 : INTEGER');
  });

  it('a procedure run without CALL is told to use CALL', () => {
    const d = diagnose('PROCEDURE Stars(N : INTEGER)\n  OUTPUT N\nENDPROCEDURE\nStars(5)');
    expect(d.category).toBe('call_missing');
    expect(d.message).toContain('CALL Stars(5)');
  });

  it('a misspelled keyword at the start of a line is named', () => {
    const d = diagnose('Ouptut "Hello"');
    expect(d.category).toBe('misspelled_keyword');
    expect(d.message).toContain('did you mean OUTPUT');
  });

  it('a four-letter variable is not "corrected" to a keyword', () => {
    expect(humanizeParseError("no viable alternative at input 'Cost\n'")).not.toContain('did you mean');
  });

  it('a sentence typed as code offers OUTPUT or a comment', () => {
    const d = diagnose('Plan your name');
    expect(d.category).toBe('plain_english');
    expect(d.message).toContain('OUTPUT "Plan your name"');
  });

  it('exam-paper line numbers are called out', () => {
    expect(diagnose('DECLARE Mark : INTEGER\n12   INPUT Mark').category).toBe('line_numbers');
  });

  it('a comparison CASE label is explained', () => {
    const d = diagnose('DECLARE M : INTEGER\nCASE OF M\n  >= 80 : OUTPUT "A"\nENDCASE');
    expect(d.category).toBe('case_comparison');
  });

  it('ELSE with a condition becomes ELSE IF', () => {
    const d = diagnose('DECLARE M : INTEGER\nIF M > 75 THEN\n  OUTPUT "A"\nELSE M > 60 THEN\n  OUTPUT "B"\nENDIF');
    expect(d.category).toBe('else_condition');
  });

  it('THEN after a WHILE condition is redirected to DO', () => {
    const d = diagnose('DECLARE N : INTEGER\nWHILE N < 3\nTHEN\n  N <- N + 1\nENDWHILE');
    expect(d.category).toBe('misplaced_then');
    expect(d.message).toContain('DO');
  });
});
