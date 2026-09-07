import { CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { describe, expect, it } from 'vitest';
import { pseudocodeCompletionSource } from '../pseudocode-completions';

function complete(doc: string, pos?: number, explicit = true): CompletionResult | null {
  const p = pos ?? doc.length;
  const state = EditorState.create({ doc });
  return pseudocodeCompletionSource(new CompletionContext(state, p, explicit));
}

function labels(result: CompletionResult | null): string[] {
  return result?.options.map((o) => o.label) ?? [];
}

describe('pseudocodeCompletionSource', () => {
  it('offers an IF snippet that includes ENDIF', () => {
    const result = complete('if');
    const ifOption = result?.options.find((o) => o.label === 'IF');
    expect(ifOption).toBeDefined();
    expect(ifOption?.detail).toContain('ENDIF');
  });

  it('offers LENGTH as a builtin', () => {
    const result = complete('len');
    const length = result?.options.find((o) => o.label === 'LENGTH');
    expect(length).toBeDefined();
    expect(length?.type).toBe('function');
    expect(String(length?.info)).toContain('LENGTH(');
  });

  it('uppercases bare keywords via the label', () => {
    const result = complete('end');
    expect(labels(result)).toContain('ENDIF');
    expect(labels(result)).toContain('ENDWHILE');
  });

  it('offers types after a colon', () => {
    const result = complete('DECLARE Count : ');
    const found = labels(result);
    expect(found).toContain('INTEGER');
    expect(found).toContain('ARRAY');
    expect(found).not.toContain('IF');
    expect(found).not.toContain('LENGTH');
  });

  it('offers types after RETURNS', () => {
    const result = complete('FUNCTION Total() RETURNS ');
    expect(labels(result)).toContain('REAL');
    expect(labels(result)).not.toContain('WHILE');
  });

  it('offers file modes after OPENFILE … FOR', () => {
    const result = complete('OPENFILE "data.txt" FOR ');
    expect(labels(result)).toEqual(expect.arrayContaining(['READ', 'WRITE', 'APPEND', 'RANDOM']));
    expect(labels(result)).not.toContain('IF');
  });

  it('returns nothing inside a comment', () => {
    expect(complete('// if')).toBeNull();
  });

  it('returns nothing inside a string', () => {
    expect(complete('OUTPUT "if')).toBeNull();
  });

  it('offers a DECLARED identifier', () => {
    const doc = 'DECLARE Count : INTEGER\nCou';
    const result = complete(doc);
    expect(labels(result)).toContain('Count');
  });

  it('does not pop up on an empty prefix unless explicit', () => {
    expect(complete('DECLARE Count : INTEGER\n', undefined, false)).toBeNull();
    expect(complete('DECLARE Count : INTEGER\n', undefined, true)).not.toBeNull();
  });
});
