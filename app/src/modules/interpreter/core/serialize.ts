import {
  RuntimeValue,
  mkInteger,
  mkReal,
  mkString,
  mkChar,
  mkBoolean,
  mkNone,
  mkDate,
  mkEnum,
  mkRecord,
  mkArray,
} from './values';
import { RecordValue } from './records';
import { PseudocodeArray } from './arrays';
import { RuntimeError } from './types';

/**
 * Serialization for GETRECORD/PUTRECORD random-access file records.
 * Values round-trip through JSON; pointers and objects cannot be stored.
 */

interface PlainScalar { t: 'INTEGER' | 'REAL' | 'STRING' | 'CHAR' | 'BOOLEAN' | 'DATE'; v: number | string | boolean }
interface PlainNone { t: 'NONE' }
interface PlainEnum { t: 'ENUM'; name: string; member: string; ord: number }
interface PlainRecord { t: 'RECORD'; name: string; fields: Record<string, Plain> }
interface PlainArray { t: 'ARRAY'; bounds: { lower: number; upper: number }[]; elem: string; entries: Record<string, Plain> }
type Plain = PlainScalar | PlainNone | PlainEnum | PlainRecord | PlainArray;

function toPlain(v: RuntimeValue): Plain {
  switch (v.type) {
    case 'INTEGER':
    case 'REAL':
    case 'STRING':
    case 'CHAR':
    case 'BOOLEAN':
    case 'DATE':
      return { t: v.type, v: v.value as number | string | boolean };
    case 'NONE':
      return { t: 'NONE' };
    case 'ENUM':
      return { t: 'ENUM', name: v.enumName!, member: v.value as string, ord: v.ordinal! };
    case 'RECORD': {
      const rec = v.value as RecordValue;
      const fields: Record<string, Plain> = {};
      for (const name of rec.names()) {
        fields[name] = toPlain(rec.getField(name)!);
      }
      return { t: 'RECORD', name: rec.typeName, fields };
    }
    case 'ARRAY': {
      const arr = v.value as PseudocodeArray;
      const entries: Record<string, Plain> = {};
      for (const [key, val] of arr.entries()) {
        entries[key] = toPlain(val);
      }
      return { t: 'ARRAY', bounds: arr.getBounds(), elem: arr.getElementTypeName(), entries };
    }
    default:
      throw new RuntimeError(`A ${v.type.toLowerCase()} value cannot be written to a file`);
  }
}

function fromPlain(p: Plain): RuntimeValue {
  switch (p.t) {
    case 'INTEGER': return mkInteger(p.v as number);
    case 'REAL': return mkReal(p.v as number);
    case 'STRING': return mkString(p.v as string);
    case 'CHAR': return mkChar(p.v as string);
    case 'BOOLEAN': return mkBoolean(p.v as boolean);
    case 'DATE': return mkDate(p.v as number);
    case 'NONE': return mkNone();
    case 'ENUM': return mkEnum(p.name, p.member, p.ord);
    case 'RECORD': {
      const rec = new RecordValue(p.name);
      for (const [name, val] of Object.entries(p.fields)) {
        rec.defineField(name, fromPlain(val));
      }
      return mkRecord(rec);
    }
    case 'ARRAY': {
      const arr = new PseudocodeArray(p.bounds, p.elem);
      for (const [key, val] of Object.entries(p.entries)) {
        arr.setRaw(key, fromPlain(val));
      }
      return mkArray(arr);
    }
  }
}

export function serializeValue(v: RuntimeValue): string {
  return JSON.stringify(toPlain(v));
}

export function deserializeValue(s: string): RuntimeValue {
  try {
    return fromPlain(JSON.parse(s) as Plain);
  } catch {
    throw new RuntimeError('The record read from the file is corrupted or not a stored record');
  }
}
