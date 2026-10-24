import { describe, expect, it } from 'vitest';
import { relatedQuestions } from './relatedQuestions';

const q = (id: string, topic: string | null = null) => ({ id, topic });

describe('relatedQuestions', () => {
  const catalog = [q('a', 'loops'), q('b', 'arrays'), q('c', 'loops'), q('d'), q('e', 'loops'), q('f'), q('g'), q('h')];

  it('puts same-topic questions first, then the next ones, never the current one', () => {
    const ids = relatedQuestions(catalog, 'c', 6).map((x) => x.id);
    expect(ids.slice(0, 2)).toEqual(['e', 'a']);
    expect(ids).toHaveLength(6);
    expect(ids).not.toContain('c');
    expect(new Set(ids).size).toBe(6);
  });

  it('wraps around the end of the catalog', () => {
    expect(relatedQuestions(catalog, 'h', 3).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('links every question from at least one other page', () => {
    const linked = new Set(catalog.flatMap((item) => relatedQuestions(catalog, item.id, 6).map((x) => x.id)));
    expect(linked.size).toBe(catalog.length);
  });

  it('falls back to the first questions for an unknown id', () => {
    expect(relatedQuestions(catalog, 'zz', 2).map((x) => x.id)).toEqual(['a', 'b']);
  });
});
