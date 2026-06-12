import { RuntimeValue, mkNone, mkArray } from './values';
import { RuntimeError } from './types';
import { PseudocodeArray } from './arrays';
import type { Reference } from './references';

interface Variable {
  value?: RuntimeValue;
  /** When present, the variable is an alias (BYREF parameter or bound object field). */
  ref?: Reference;
  constant: boolean;
}

export class Environment {
  private variables = new Map<string, Variable>();
  private parent: Environment | null;

  constructor(parent: Environment | null = null) {
    this.parent = parent;
  }

  declare(name: string, value: RuntimeValue = mkNone()): void {
    this.variables.set(name, { value, constant: false });
  }

  declareConstant(name: string, value: RuntimeValue): void {
    this.variables.set(name, { value, constant: true });
  }

  /** Declare a name as an alias for an existing storage location (BYREF / object fields). */
  declareRef(name: string, ref: Reference): void {
    this.variables.set(name, { ref, constant: false });
  }

  get(name: string): RuntimeValue {
    const entry = this.variables.get(name);
    if (entry) return entry.ref ? entry.ref.get() : entry.value!;
    if (this.parent) return this.parent.get(name);
    throw new RuntimeError(`Variable '${name}' is not defined`);
  }

  set(name: string, value: RuntimeValue): void {
    const entry = this.variables.get(name);
    if (entry) {
      if (entry.constant) {
        throw new RuntimeError(`Cannot assign to constant '${name}'`);
      }
      if (entry.ref) {
        entry.ref.set(value);
        return;
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
    if (val.type === 'ARRAY') return val.value as PseudocodeArray;
    throw new RuntimeError(`'${name}' is not an array`);
  }

  /**
   * Get an array, or auto-create it with 1-indexed bounds if it doesn't exist.
   * @param name The array variable name
   * @param dimensions The number of dimensions (1 or 2)
   * @param defaultType The default element type (defaults to 'INTEGER')
   */
  getOrCreateArray(name: string, dimensions: 1 | 2, defaultType: string = 'INTEGER'): PseudocodeArray {
    // Check if variable exists
    if (this.has(name)) {
      const val = this.get(name);
      if (val.type === 'ARRAY') return val.value as PseudocodeArray;
      throw new RuntimeError(`'${name}' is not an array`);
    }

    // Auto-create array with 1-indexed bounds [1:10000]
    const bounds = dimensions === 1
      ? [{ lower: 1, upper: 10000 }]
      : [{ lower: 1, upper: 10000 }, { lower: 1, upper: 10000 }];

    const arr = new PseudocodeArray(bounds, defaultType);
    this.declare(name, mkArray(arr));
    return arr;
  }

  /** Collect all variables from current scope chain (child overrides parent). */
  getAllVariables(): Map<string, { value: RuntimeValue; constant: boolean }> {
    const result = new Map<string, { value: RuntimeValue; constant: boolean }>();
    if (this.parent) {
      for (const [k, v] of this.parent.getAllVariables()) {
        result.set(k, v);
      }
    }
    for (const [k, v] of this.variables) {
      result.set(k, { value: v.ref ? v.ref.get() : v.value!, constant: v.constant });
    }
    return result;
  }
}
