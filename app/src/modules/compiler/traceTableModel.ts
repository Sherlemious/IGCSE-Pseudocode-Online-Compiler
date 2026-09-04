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

export function scalarTraceColumns(rows: TraceRow[]): string[] {
  const opaque = new Set<string>();
  for (const row of rows) {
    for (const v of row.variables) {
      if (isOpaqueTraceType(v.type)) opaque.add(v.name);
    }
  }
  return traceColumns(rows).filter((name) => !opaque.has(name));
}
