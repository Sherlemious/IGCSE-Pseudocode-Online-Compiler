import { describe, it, expect } from 'vitest';
import { parse } from '../parser';
import { Interpreter } from '../core/interpreter';
import { ServerVirtualFileSystem } from '../core/serverFilesystem';

async function traceLines(source: string): Promise<string[]> {
  const { tree, errors } = parse(source);
  if (errors.length > 0 || !tree) throw new Error(errors.map((e) => e.message).join('; '));
  const rows: string[] = [];
  const interpreter = new Interpreter(
    {
      onOutput: () => {},
      onInputRequest: () => {},
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
      onTrace: (line, vars) => rows.push(`${line}: ${vars.map((v) => `${v.name}=${v.value}`).join(' ')}`),
    },
    new AbortController().signal,
    new ServerVirtualFileSystem(),
  );
  interpreter.setTraceMode(true);
  await interpreter.execute(tree);
  return rows;
}

describe('trace table rows', () => {
  it('does not repeat the last body row when an IF or loop ends', async () => {
    const rows = await traceLines(
      'x <- 5\nIF x > 1 THEN\n  OUTPUT "big"\nENDIF\nFOR i <- 1 TO 2\n  x <- x + i\nNEXT i\nOUTPUT x\n',
    );
    expect(rows).toEqual([
      '1: x=5',
      '3: x=5',
      '6: i=1 x=6',
      '6: i=2 x=8',
      '8: i=2 x=8',
    ]);
  });

  it('records each assignment with its row, including re-assigning the same value', async () => {
    const { tree } = parse('DECLARE t : INTEGER\nt <- 3\nt <- 3\nFOR i <- 1 TO 2\n  t <- t * i\nNEXT i\n');
    const writes: string[] = [];
    const interpreter = new Interpreter(
      {
        onOutput: () => {},
        onInputRequest: () => {},
        onInputComplete: () => {},
        onComplete: () => {},
        onError: () => {},
        onTrace: (line, _vars, w) => writes.push(`${line}: ${w.map((x) => `${x.name}=${x.value}`).join(' ')}`),
      },
      new AbortController().signal,
      new ServerVirtualFileSystem(),
    );
    interpreter.setTraceMode(true);
    await interpreter.execute(tree!);
    // DECLARE assigns nothing; the FOR's two writes of i=1 count once.
    expect(writes).toEqual(['1: ', '2: t=3', '3: t=3', '5: i=1 t=3', '5: i=2 t=6']);
  });

  it('keeps a block row that changed something', async () => {
    // The loop body never runs, so the FOR row is the only place i appears.
    const rows = await traceLines('x <- 0\nFOR i <- 1 TO 0\n  x <- 1\nNEXT i\n');
    expect(rows).toEqual(['1: x=0', '2: i=1 x=0']);
  });
});
