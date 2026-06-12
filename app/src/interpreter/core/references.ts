import { RuntimeValue } from './values';
import { RuntimeError } from './types';
import { PseudocodeArray } from './arrays';
import { RecordValue } from './records';
import { ClassInstance } from './classes';
import type { Environment } from './environment';

/**
 * An assignable storage location. References unify the targets of
 * assignment, INPUT/READFILE/GETRECORD, BYREF parameters and pointers.
 */
export interface Reference {
  get(): RuntimeValue;
  set(value: RuntimeValue): void;
  /** Short source-like description used in error messages, e.g. `'x'` or `'arr[1]'`. */
  describe(): string;
}

export class VariableRef implements Reference {
  constructor(private env: Environment, private name: string) {}

  get(): RuntimeValue {
    return this.env.get(this.name);
  }

  set(value: RuntimeValue): void {
    this.env.set(this.name, value);
  }

  describe(): string {
    return `'${this.name}'`;
  }
}

export class ArrayElementRef implements Reference {
  constructor(private parent: Reference, private indices: number[], private label: string) {}

  private holder(): { val: RuntimeValue; arr: PseudocodeArray } {
    const val = this.parent.get();
    if (val.type !== 'ARRAY') {
      throw new RuntimeError(`${this.parent.describe()} is not an array`);
    }
    return { val, arr: val.value as PseudocodeArray };
  }

  get(): RuntimeValue {
    return this.holder().arr.get(this.indices);
  }

  set(value: RuntimeValue): void {
    const { val, arr } = this.holder();
    arr.set(this.indices, value);
    // Re-store through the parent so writes into composite defaults persist
    this.parent.set(val);
  }

  describe(): string {
    return `'${this.label}'`;
  }
}

export class RecordFieldRef implements Reference {
  constructor(private parent: Reference, private fieldName: string, private label: string) {}

  private holder(): { val: RuntimeValue; rec: RecordValue } {
    const val = this.parent.get();
    if (val.type !== 'RECORD') {
      throw new RuntimeError(
        `${this.parent.describe()} is not a record — dot notation like x.Field needs a record or object`,
      );
    }
    return { val, rec: val.value as RecordValue };
  }

  private checkField(rec: RecordValue): void {
    if (!rec.hasField(this.fieldName)) {
      throw new RuntimeError(`Record type '${rec.typeName}' has no field '${this.fieldName}'`);
    }
  }

  get(): RuntimeValue {
    const { rec } = this.holder();
    this.checkField(rec);
    return rec.getField(this.fieldName)!;
  }

  set(value: RuntimeValue): void {
    const { val, rec } = this.holder();
    this.checkField(rec);
    rec.setField(this.fieldName, value);
    this.parent.set(val);
  }

  describe(): string {
    return `'${this.label}'`;
  }
}

export class ObjectFieldRef implements Reference {
  constructor(private instance: ClassInstance, private fieldName: string, private label: string) {}

  private checkField(): void {
    if (!this.instance.fields.has(this.fieldName.toUpperCase())) {
      throw new RuntimeError(
        `Class '${this.instance.classDef.name}' has no property '${this.fieldName}'`,
      );
    }
  }

  get(): RuntimeValue {
    this.checkField();
    return this.instance.fields.get(this.fieldName.toUpperCase())!;
  }

  set(value: RuntimeValue): void {
    this.checkField();
    this.instance.fields.set(this.fieldName.toUpperCase(), value);
  }

  describe(): string {
    return `'${this.label}'`;
  }
}

/** A read-only value wrapper, e.g. the result of a method call inside a designator chain. */
export class ValueRef implements Reference {
  constructor(private val: RuntimeValue, private label: string) {}

  get(): RuntimeValue {
    return this.val;
  }

  set(): void {
    throw new RuntimeError(`Cannot assign to ${this.label}`);
  }

  describe(): string {
    return `'${this.label}'`;
  }
}
