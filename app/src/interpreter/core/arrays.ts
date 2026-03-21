import { RuntimeValue, mkInteger, mkReal, mkString, mkChar, mkBoolean, mkNone } from './values';
import { RuntimeError } from './types';

export class PseudocodeArray {
  private storage = new Map<string, RuntimeValue>();
  private lowerBounds: number[];
  private upperBounds: number[];
  private defaultType: string;

  constructor(bounds: { lower: number; upper: number }[], elementType: string) {
    this.lowerBounds = bounds.map((b) => b.lower);
    this.upperBounds = bounds.map((b) => b.upper);
    this.defaultType = elementType;
  }

  private makeDefault(): RuntimeValue {
    switch (this.defaultType.toUpperCase()) {
      case 'INTEGER':
        return mkInteger(0);
      case 'REAL':
        return mkReal(0);
      case 'STRING':
        return mkString('');
      case 'CHAR':
        return mkChar(' ');
      case 'BOOLEAN':
        return mkBoolean(false);
      default:
        return mkNone();
    }
  }

  private makeKey(indices: number[]): string {
    return indices.join(',');
  }

  private checkBounds(indices: number[]): void {
    if (indices.length !== this.lowerBounds.length) {
      throw new RuntimeError(
        `Array expects ${this.lowerBounds.length} index(es), got ${indices.length}`,
      );
    }
    for (let i = 0; i < indices.length; i++) {
      if (indices[i] < this.lowerBounds[i] || indices[i] > this.upperBounds[i]) {
        throw new RuntimeError(
          `Array index ${indices[i]} out of bounds [${this.lowerBounds[i]}:${this.upperBounds[i]}]`,
        );
      }
    }
  }

  get(indices: number[]): RuntimeValue {
    this.checkBounds(indices);
    const key = this.makeKey(indices);
    return this.storage.get(key) ?? this.makeDefault();
  }

  set(indices: number[], value: RuntimeValue): void {
    this.checkBounds(indices);
    const key = this.makeKey(indices);
    this.storage.set(key, value);
  }
}
