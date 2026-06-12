import { RuntimeError } from './types';
import type { PseudocodeArray } from './arrays';
import type { RecordValue } from './records';
import type { ClassInstance } from './classes';
import type { Reference } from './references';

export type ValueType =
  | 'INTEGER'
  | 'REAL'
  | 'CHAR'
  | 'STRING'
  | 'BOOLEAN'
  | 'NONE'
  | 'ARRAY'
  | 'RECORD'
  | 'ENUM'
  | 'POINTER'
  | 'SET'
  | 'DATE'
  | 'OBJECT';

export interface RuntimeValue {
  type: ValueType;
  value:
    | number
    | string
    | boolean
    | null
    | PseudocodeArray
    | RecordValue
    | ClassInstance
    | Reference
    | Set<string>;
  /** ENUM only: the enum type name, e.g. 'Season' */
  enumName?: string;
  /** ENUM only: zero-based position of the member within the enum */
  ordinal?: number;
  /** SET only: the set type name, e.g. 'LetterSet' */
  setTypeName?: string;
}

export function mkInteger(n: number): RuntimeValue {
  return { type: 'INTEGER', value: Math.trunc(n) };
}

export function mkReal(n: number): RuntimeValue {
  return { type: 'REAL', value: n };
}

export function mkString(s: string): RuntimeValue {
  return { type: 'STRING', value: s };
}

export function mkChar(c: string): RuntimeValue {
  return { type: 'CHAR', value: c.charAt(0) };
}

export function mkBoolean(b: boolean): RuntimeValue {
  return { type: 'BOOLEAN', value: b };
}

export function mkNone(): RuntimeValue {
  return { type: 'NONE', value: null };
}

export function mkArray(arr: PseudocodeArray): RuntimeValue {
  return { type: 'ARRAY', value: arr };
}

export function mkRecord(rec: RecordValue): RuntimeValue {
  return { type: 'RECORD', value: rec };
}

export function mkEnum(enumName: string, memberName: string, ordinal: number): RuntimeValue {
  return { type: 'ENUM', value: memberName, enumName, ordinal };
}

export function mkPointer(ref: Reference | null): RuntimeValue {
  return { type: 'POINTER', value: ref };
}

export function mkSet(setTypeName: string, elements: Set<string>): RuntimeValue {
  return { type: 'SET', value: elements, setTypeName };
}

/** DATE values store UTC milliseconds at midnight of the day. */
export function mkDate(ms: number): RuntimeValue {
  return { type: 'DATE', value: ms };
}

export function mkDateFromParts(day: number, month: number, year: number): RuntimeValue {
  const ms = Date.UTC(year, month - 1, day);
  const check = new Date(ms);
  if (check.getUTCDate() !== day || check.getUTCMonth() !== month - 1 || check.getUTCFullYear() !== year) {
    throw new RuntimeError(`'${pad2(day)}/${pad2(month)}/${year}' is not a valid date (use dd/mm/yyyy)`);
  }
  return mkDate(ms);
}

export function mkObject(instance: ClassInstance): RuntimeValue {
  return { type: 'OBJECT', value: instance };
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatDate(ms: number): string {
  const d = new Date(ms);
  return `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

/** Friendly description of a composite value used in scalar contexts. */
function compositeKind(v: RuntimeValue): string | null {
  switch (v.type) {
    case 'ARRAY': return 'an array — use indexing like arr[1] to access elements';
    case 'RECORD': return 'a record — use dot notation like rec.Field to access fields';
    case 'OBJECT': return 'an object — use dot notation to access its methods';
    case 'POINTER': return 'a pointer — use ^ to access the value it points to';
    case 'SET': return 'a set';
    default: return null;
  }
}

export function toNumber(v: RuntimeValue): number {
  if (v.type === 'INTEGER' || v.type === 'REAL') return v.value as number;
  if (v.type === 'STRING' || v.type === 'CHAR') {
    const n = Number(v.value);
    if (!isNaN(n)) return n;
  }
  if (v.type === 'BOOLEAN') return v.value ? 1 : 0;
  if (v.type === 'DATE') return v.value as number;
  const kind = compositeKind(v);
  if (kind) throw new RuntimeError(`This value is ${kind}; it cannot be used as a number here`);
  return 0;
}

export function toBoolean(v: RuntimeValue): boolean {
  if (v.type === 'BOOLEAN') return v.value as boolean;
  if (v.type === 'INTEGER' || v.type === 'REAL') return (v.value as number) !== 0;
  if (v.type === 'STRING' || v.type === 'CHAR') return (v.value as string).length > 0;
  const kind = compositeKind(v);
  if (kind) throw new RuntimeError(`This value is ${kind}; it cannot be used as a condition here`);
  return false;
}

export function toString(v: RuntimeValue): string {
  if (v.type === 'BOOLEAN') return v.value ? 'TRUE' : 'FALSE';
  if (v.type === 'DATE') return formatDate(v.value as number);
  if (v.type === 'ENUM') return String(v.value);
  const kind = compositeKind(v);
  if (kind) throw new RuntimeError(`This value is ${kind}; it cannot be displayed directly`);
  if (v.value === null) return '';
  return String(v.value);
}

export function isNumeric(v: RuntimeValue): boolean {
  return v.type === 'INTEGER' || v.type === 'REAL';
}

export function smartParse(input: string): RuntimeValue {
  const trimmed = input.trim();
  if (trimmed.toUpperCase() === 'TRUE') return mkBoolean(true);
  if (trimmed.toUpperCase() === 'FALSE') return mkBoolean(false);
  const n = Number(trimmed);
  if (!isNaN(n) && trimmed !== '') {
    return Number.isInteger(n) ? mkInteger(n) : mkReal(n);
  }
  return mkString(input);
}
