import { describe, it, expect } from 'vitest';
import { getBuiltin } from './builtins';
import { mkString, mkInteger, toString } from './values';

describe('Builtins', () => {
  describe('SUBSTRING', () => {
    it('should correctly handle 1-based indexing', () => {
      const substring = getBuiltin('SUBSTRING');
      expect(substring).toBeDefined();
      if (!substring) return;

      // Test case: SUBSTRING("HELLO", 2, 3) -> "ELL"
      const args = [
        mkString("HELLO"),
        mkInteger(2),
        mkInteger(3)
      ];

      const result = substring(args);
      expect(toString(result)).toBe("ELL");
    });
  });
});
