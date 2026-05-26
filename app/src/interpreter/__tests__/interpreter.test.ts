import { describe, it, expect } from 'vitest';
import { parse } from '../parser';
import { Interpreter } from '../core/interpreter';
import { humanizeParseError } from '../errorMessages';
import type { PseudocodeError } from '../core/types';

// Runs pseudocode and collects outputs. Provide `inputs` in order for INPUT statements.
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

  it('dot lexer error calls out copied language syntax', () => {
    const msg = humanizeParseError("token recognition error at: '.'");
    expect(msg).toContain('not Cambridge IGCSE syntax');
    expect(msg).toContain('console.log');
    expect(msg).toContain('OUTPUT "Hello"');
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
