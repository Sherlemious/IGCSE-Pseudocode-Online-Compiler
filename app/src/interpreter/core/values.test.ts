import { describe, expect, it } from 'vitest';
import {
  mkBoolean,
  mkChar,
  mkDate,
  mkInteger,
  mkReal,
  mkString,
  parseInputForTarget,
} from './values';

describe('parseInputForTarget', () => {
  it('preserves the declared scalar type', () => {
    expect(parseInputForTarget('12', mkString(''), "'text'")).toEqual({ type: 'STRING', value: '12' });
    expect(parseInputForTarget('12', mkReal(0), "'decimal'")).toEqual({ type: 'REAL', value: 12 });
    expect(parseInputForTarget('false', mkBoolean(true), "'flag'")).toEqual({ type: 'BOOLEAN', value: false });
    expect(parseInputForTarget('Z', mkChar(' '), "'letter'")).toEqual({ type: 'CHAR', value: 'Z' });
  });

  it('rejects values that do not match the declared scalar type', () => {
    expect(() => parseInputForTarget('2.5', mkInteger(0), "'count'")).toThrow(/must be an INTEGER/);
    expect(() => parseInputForTarget('many', mkReal(0), "'amount'")).toThrow(/must be a REAL/);
    expect(() => parseInputForTarget('yes', mkBoolean(false), "'flag'")).toThrow(/must be TRUE or FALSE/);
    expect(() => parseInputForTarget('AB', mkChar(' '), "'letter'")).toThrow(/exactly one character/);
  });

  it('accepts only valid dd/mm/yyyy DATE input', () => {
    expect(parseInputForTarget('06/08/2026', mkDate(0), "'day'").type).toBe('DATE');
    expect(() => parseInputForTarget('2026-08-06', mkDate(0), "'day'")).toThrow(/dd\/mm\/yyyy/);
    expect(() => parseInputForTarget('31/02/2026', mkDate(0), "'day'")).toThrow(/valid DATE/);
  });
});
