import type { TraceRow } from '@/modules/interpreter/core/types';

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

/** Snapshots of arrays/records/etc. are opaque labels — skip them on export cards. */
const OPAQUE_TYPES = new Set(['ARRAY', 'RECORD', 'OBJECT', 'POINTER', 'SET']);

export function isOpaqueTraceType(type: string): boolean {
  return OPAQUE_TYPES.has(type);
}

/** A row of the exam-style table: column name → formatted value; absent = blank. */
export interface ExamTraceRow {
  cells: Record<string, string>;
  output?: string;
}

export interface ExamTraceTable {
  columns: string[];
  rows: ExamTraceRow[];
}

/**
 * The trace laid out the way Cambridge mark schemes write it (0478/02 specimen,
 * Q8a): one column per variable plus OUTPUT, a value written only when it is
 * assigned (blank = unchanged), and a new row started only when the next value
 * belongs in a column that already has one in the current row. Each output line
 * takes its own OUTPUT cell. Arrays, records and the like are left out, as in
 * the export card.
 */
export function examTraceTable(rows: TraceRow[]): ExamTraceTable {
  const columns: string[] = [];
  const seen = new Set<string>();
  const out: ExamTraceRow[] = [];
  let current: ExamTraceRow = { cells: {} };
  const flush = () => {
    if (Object.keys(current.cells).length > 0 || current.output !== undefined) out.push(current);
    current = { cells: {} };
  };
  for (const row of rows) {
    for (const w of row.writes ?? []) {
      if (isOpaqueTraceType(w.type)) continue;
      if (!seen.has(w.name)) {
        seen.add(w.name);
        columns.push(w.name);
      }
      if (w.name in current.cells) flush();
      current.cells[w.name] = formatTraceVar(w.value, w.type);
    }
    for (const line of row.output) {
      if (current.output !== undefined) flush();
      current.output = line;
    }
  }
  flush();
  return { columns, rows: out };
}

export function scalarTraceColumns(rows: TraceRow[]): string[] {
  const opaque = new Set<string>();
  for (const row of rows) {
    for (const v of row.variables) {
      if (isOpaqueTraceType(v.type)) opaque.add(v.name);
    }
  }
  return traceColumns(rows).filter((name) => !opaque.has(name));
}
