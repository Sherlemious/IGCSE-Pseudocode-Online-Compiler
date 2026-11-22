import { describe, it, expect } from 'vitest';
import { parse } from '@/modules/interpreter/parser';
import { Interpreter } from '@/modules/interpreter/core/interpreter';
import { ServerVirtualFileSystem } from '@/modules/interpreter/core/serverFilesystem';
import type { TraceRow } from '@/modules/interpreter/core/types';
import { examTraceTable } from './traceTableModel';

/** Run a program the way useInterpreter does: output is attached to the next trace row. */
async function trace(source: string, inputs: string[] = []): Promise<TraceRow[]> {
  const { tree, errors } = parse(source);
  if (errors.length > 0 || !tree) throw new Error(errors.map((e) => e.message).join('; '));
  const rows: TraceRow[] = [];
  let pending: string[] = [];
  const queue = [...inputs];
  const interpreter: Interpreter = new Interpreter(
    {
      onOutput: (text) => pending.push(text),
      onInputRequest: () => setTimeout(() => interpreter.provideInput(queue.shift() ?? ''), 0),
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
      onTrace: (line, variables, writes) => {
        rows.push({ step: rows.length + 1, line, variables, writes, output: pending });
        pending = [];
      },
    },
    new AbortController().signal,
    new ServerVirtualFileSystem(),
  );
  interpreter.setTraceMode(true);
  await interpreter.execute(tree);
  return rows;
}

/** Render an exam table as text rows: cells separated by `|`, blank = unchanged. */
function render(rows: TraceRow[]): string[] {
  const { columns, rows: examRows } = examTraceTable(rows);
  return [
    [...columns, 'OUTPUT'].join('|'),
    ...examRows.map((r) => [...columns.map((c) => r.cells[c] ?? ''), r.output ?? ''].join('|')),
  ];
}

describe('examTraceTable', () => {
  it('writes a value only when assigned and packs a loop pass into one row', async () => {
    const rows = await trace(
      'DECLARE Total : INTEGER\nTotal <- 0\nFOR Count <- 1 TO 3\n  INPUT Num\n  Total <- Total + Num\nNEXT Count\nOUTPUT Total\n',
      ['4', '0', '6'],
    );
    expect(render(rows)).toEqual([
      'Total|Count|Num|OUTPUT',
      '0|1|4|',
      '4|2|0|',
      '4|3|6|',
      '10|||10',
    ]);
  });

  it('gives each output line its own row and leaves unchanged values blank', async () => {
    const rows = await trace('x <- 5\nIF x > 1 THEN\n  OUTPUT "big"\nENDIF\nFOR i <- 1 TO 2\n  x <- x + i\nNEXT i\nOUTPUT x\nOUTPUT "done"\n');
    // Rows only break when a column is already taken, so i=1 shares the first
    // row, as in the mark scheme (its first row holds i = 0 beside the set-up).
    expect(render(rows)).toEqual(['x|i|OUTPUT', '5|1|big', '6|2|', '8||8', '||done']);
  });

  it('leaves arrays out and keeps scalar columns', async () => {
    const rows = await trace('DECLARE A : ARRAY[1:2] OF INTEGER\nFOR k <- 1 TO 2\n  A[k] <- k * 10\nNEXT k\n');
    expect(render(rows)).toEqual(['k|OUTPUT', '1|', '2|']);
  });
});
