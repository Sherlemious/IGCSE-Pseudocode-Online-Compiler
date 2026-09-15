import { describe, expect, it } from 'vitest';
import { MAX_PLAYGROUND_CODE_CHARS, parsePlaygroundCode } from './playgroundSnapshot';

describe('parsePlaygroundCode', () => {
  it('accepts an empty program', () => {
    expect(parsePlaygroundCode('')).toBe('');
  });

  it('rejects non-strings', () => {
    expect(parsePlaygroundCode(null)).toBeNull();
    expect(parsePlaygroundCode(12)).toBeNull();
  });

  it('rejects programs over the size cap', () => {
    expect(parsePlaygroundCode('a'.repeat(MAX_PLAYGROUND_CODE_CHARS + 1))).toBeNull();
  });
});
