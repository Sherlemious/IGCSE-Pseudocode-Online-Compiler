export type ValueType = 'INTEGER' | 'REAL' | 'CHAR' | 'STRING' | 'BOOLEAN' | 'NONE' | 'ARRAY';

export interface RuntimeValue {
  type: ValueType;
  value: number | string | boolean | null;
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

export function toNumber(v: RuntimeValue): number {
  if (v.type === 'INTEGER' || v.type === 'REAL') return v.value as number;
  if (v.type === 'STRING' || v.type === 'CHAR') {
    const n = Number(v.value);
    if (!isNaN(n)) return n;
  }
  if (v.type === 'BOOLEAN') return v.value ? 1 : 0;
  return 0;
}

export function toBoolean(v: RuntimeValue): boolean {
  if (v.type === 'BOOLEAN') return v.value as boolean;
  if (v.type === 'INTEGER' || v.type === 'REAL') return (v.value as number) !== 0;
  if (v.type === 'STRING' || v.type === 'CHAR') return (v.value as string).length > 0;
  return false;
}

export function toString(v: RuntimeValue): string {
  if (v.value === null) return '';
  if (v.type === 'BOOLEAN') return v.value ? 'TRUE' : 'FALSE';
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
