import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { qrModules, qrSvg } from './qrCode';

const JOIN = 'https://pseudocode-compiler.sherlemious.com/c/ABCDEF';

function finderDark(modules: boolean[][], row: number, col: number): boolean {
  // A finder is a 7×7 with a dark border, a light ring, and a 3×3 dark core.
  for (let dy = 0; dy < 7; dy++) {
    for (let dx = 0; dx < 7; dx++) {
      const edge = dx === 0 || dx === 6 || dy === 0 || dy === 6;
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      if (modules[row + dy][col + dx] !== (edge || core)) return false;
    }
  }
  return true;
}

describe('qrModules', () => {
  it('builds a square symbol whose three finders survive masking', () => {
    const modules = qrModules(JOIN);
    const size = modules.length;
    expect(size).toBe(modules[0].length);
    expect(size % 4).toBe(1);
    expect(finderDark(modules, 0, 0)).toBe(true);
    expect(finderDark(modules, 0, size - 7)).toBe(true);
    expect(finderDark(modules, size - 7, 0)).toBe(true);
  });

  it('is deterministic', () => {
    expect(qrModules(JOIN)).toEqual(qrModules(JOIN));
  });

  // Byte mode, error correction M, for this exact join URL. A change here means phones may not scan the slip.
  it('keeps the join-URL symbol stable', () => {
    const bits = qrModules(JOIN).flat().map((dark) => (dark ? '1' : '0')).join('');
    expect(createHash('sha256').update(bits).digest('hex')).toBe(
      'a7f0c72002a99eae1f2aac19c23367a6e8adeabb9337b7602d97a1770ecf8109',
    );
  });

  it('refuses text that does not fit in version 10', () => {
    expect(() => qrModules('a'.repeat(300))).toThrow(/too long/);
  });
});

describe('qrSvg', () => {
  it('includes a four-module quiet zone and does not embed the URL as text', () => {
    const modules = qrModules(JOIN);
    const svg = qrSvg(JOIN);
    const quiet = modules.length + 8;
    expect(svg).toContain(`viewBox="0 0 ${quiet} ${quiet}"`);
    expect(svg).not.toContain(JOIN);
    expect(svg.startsWith('<svg')).toBe(true);
  });
});
