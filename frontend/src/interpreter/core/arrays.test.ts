import { describe, it, expect } from 'vitest';
import { PseudocodeArray } from './arrays';
import { mkInteger, mkString } from './values';
import { RuntimeError } from './types';

describe('PseudocodeArray', () => {
  describe('Construction', () => {
    it('should create a 1D array with correct bounds', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
      expect(array).toBeDefined();
    });

    it('should create a 2D array with correct bounds', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 5 }, { lower: 1, upper: 5 }], 'STRING');
      expect(array).toBeDefined();
    });
  });

  describe('Valid Access', () => {
    it('should set and get values within bounds (1D)', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
      const val = mkInteger(42);
      array.set([5], val);
      expect(array.get([5])).toEqual(val);
    });

    it('should set and get values within bounds (2D)', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 5 }, { lower: 1, upper: 5 }], 'STRING');
      const val = mkString("hello");
      array.set([2, 3], val);
      expect(array.get([2, 3])).toEqual(val);
    });

    it('should handle access at exact lower bound', () => {
        const array = new PseudocodeArray([{ lower: 0, upper: 10 }], 'INTEGER');
        const val = mkInteger(1);
        array.set([0], val);
        expect(array.get([0])).toEqual(val);
    });

    it('should handle access at exact upper bound', () => {
        const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
        const val = mkInteger(100);
        array.set([10], val);
        expect(array.get([10])).toEqual(val);
    });
  });

  describe('Out of Bounds Access', () => {
    it('should throw RuntimeError when accessing below lower bound', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
      expect(() => array.get([0])).toThrow(RuntimeError);
      expect(() => array.get([0])).toThrow(/out of bounds/);
    });

    it('should throw RuntimeError when accessing above upper bound', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
      expect(() => array.get([11])).toThrow(RuntimeError);
      expect(() => array.get([11])).toThrow(/out of bounds/);
    });

    it('should throw RuntimeError when setting below lower bound', () => {
        const array = new PseudocodeArray([{ lower: 5, upper: 10 }], 'INTEGER');
        expect(() => array.set([4], mkInteger(1))).toThrow(RuntimeError);
    });

    it('should throw RuntimeError when setting above upper bound', () => {
        const array = new PseudocodeArray([{ lower: 5, upper: 10 }], 'INTEGER');
        expect(() => array.set([11], mkInteger(1))).toThrow(RuntimeError);
    });
  });

  describe('Dimension Mismatch', () => {
    it('should throw RuntimeError when too few indices provided', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 5 }, { lower: 1, upper: 5 }], 'INTEGER');
      expect(() => array.get([1])).toThrow(RuntimeError);
      expect(() => array.get([1])).toThrow(/expects 2 index\(es\), got 1/);
    });

    it('should throw RuntimeError when too many indices provided', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 10 }], 'INTEGER');
      expect(() => array.get([1, 1])).toThrow(RuntimeError);
      expect(() => array.get([1, 1])).toThrow(/expects 1 index\(es\), got 2/);
    });
  });

  describe('Default Values', () => {
    it('should return default integer value (0) for uninitialized slots', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 5 }], 'INTEGER');
      const result = array.get([1]);
      expect(result.type).toBe('INTEGER');
      expect(result.value).toBe(0);
    });

    it('should return default string value ("") for uninitialized slots', () => {
      const array = new PseudocodeArray([{ lower: 1, upper: 5 }], 'STRING');
      const result = array.get([1]);
      expect(result.type).toBe('STRING');
      expect(result.value).toBe('');
    });
  });
});
