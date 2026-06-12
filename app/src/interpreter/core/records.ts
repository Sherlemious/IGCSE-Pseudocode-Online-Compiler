import { RuntimeValue } from './values';

/**
 * A record (composite TYPE) value. Field names are case-insensitive,
 * matching the Cambridge guidance that identifiers should not be
 * distinguished by case (the 9618 guide itself mixes FirstName/Firstname).
 */
export class RecordValue {
  /** UPPERCASE field name → value */
  private fields = new Map<string, RuntimeValue>();
  /** Declared field names in declaration order (display casing) */
  private fieldNames: string[] = [];

  constructor(public typeName: string) {}

  defineField(name: string, value: RuntimeValue): void {
    const key = name.toUpperCase();
    if (!this.fields.has(key)) this.fieldNames.push(name);
    this.fields.set(key, value);
  }

  hasField(name: string): boolean {
    return this.fields.has(name.toUpperCase());
  }

  getField(name: string): RuntimeValue | undefined {
    return this.fields.get(name.toUpperCase());
  }

  setField(name: string, value: RuntimeValue): void {
    this.fields.set(name.toUpperCase(), value);
  }

  names(): string[] {
    return [...this.fieldNames];
  }

  clone(copyFn: (v: RuntimeValue) => RuntimeValue): RecordValue {
    const copy = new RecordValue(this.typeName);
    for (const name of this.fieldNames) {
      copy.defineField(name, copyFn(this.fields.get(name.toUpperCase())!));
    }
    return copy;
  }
}
