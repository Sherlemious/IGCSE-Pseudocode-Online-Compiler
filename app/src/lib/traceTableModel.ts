import type { TraceRow } from '../interpreter/core/types';

/** Column order = variables in the order they first appear across the trace. */
export function traceColumns(rows: TraceRow[]): string[] {
  const seen: string[] = [];
  const set = new Set<string>();
  for (const row of rows) {
    for (const v of row.variables) {
      if (!set.has(v.name)) {
        set.add(v.name);
        seen.push(v.name);
      }
    }
  }
  return seen;
}

export function formatTraceVar(value: string, type: string): string {
  if (type === 'STRING') return `"${value}"`;
  if (type === 'CHAR') return `'${value}'`;
  return value;
}
