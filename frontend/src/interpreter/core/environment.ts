import { RuntimeValue, mkNone } from './values';
import { RuntimeError } from './types';
import { PseudocodeArray } from './arrays';

interface Variable {
  value: RuntimeValue | PseudocodeArray;
  constant: boolean;
}

export class Environment {
  private variables = new Map<string, Variable>();
  private parent: Environment | null;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }

  declare(name: string, value: RuntimeValue | PseudocodeArray = mkNone()): void {
    this.variables.set(name, { value, constant: false });
  }

  declareConstant(name: string, value: RuntimeValue): void {
    this.variables.set(name, { value, constant: true });
  }

  get(name: string): RuntimeValue | PseudocodeArray {
    const entry = this.variables.get(name);
    if (entry) return entry.value;
    if (this.parent) return this.parent.get(name);
    throw new RuntimeError(`Variable '${name}' is not defined`);
  }

  set(name: string, value: RuntimeValue | PseudocodeArray): void {
    const entry = this.variables.get(name);
    if (entry) {
      if (entry.constant) {
        throw new RuntimeError(`Cannot assign to constant '${name}'`);
      }
      entry.value = value;
      return;
    }
    if (this.parent) {
      try {
        this.parent.set(name, value);
        return;
      } catch {
        // Variable not in parent scope, declare locally
      }
    }
    // Auto-declare if not found anywhere
    this.variables.set(name, { value, constant: false });
  }

  has(name: string): boolean {
    if (this.variables.has(name)) return true;
    if (this.parent) return this.parent.has(name);
    return false;
  }

  getArray(name: string): PseudocodeArray {
    const val = this.get(name);
    if (val instanceof PseudocodeArray) return val;
    throw new RuntimeError(`'${name}' is not an array`);
  }
}
