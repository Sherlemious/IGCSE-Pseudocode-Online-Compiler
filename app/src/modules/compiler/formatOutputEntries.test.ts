import { describe, expect, it } from 'vitest';
import { formatOutputEntries } from './formatOutputEntries';

describe('formatOutputEntries', () => {
  it('formats visible terminal context and omits pending input', () => {
    expect(formatOutputEntries([
      { kind: 'output', text: 'Hello' },
      { kind: 'input', variableName: 'name', value: 'Ada', submitted: true },
      { kind: 'input', variableName: 'age', value: '', submitted: false },
      { kind: 'error', text: 'Line 4: Example error' },
    ])).toBe('Hello\n[INPUT] name: Ada\n[ERROR] Line 4: Example error');
  });

  it('returns an empty string when no terminal context is available', () => {
    expect(formatOutputEntries([])).toBe('');
  });
});
