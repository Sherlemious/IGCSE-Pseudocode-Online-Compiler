import { describe, expect, it } from 'vitest';
import {
  buildPracticeUrl,
  computePracticeListing,
  parsePracticeSearch,
  type PracticeListQuestion,
} from './filterUtils';

const q = (partial: Partial<PracticeListQuestion> & Pick<PracticeListQuestion, 'id' | 'title'>): PracticeListQuestion => ({
  difficulty: 'EASY',
  year: 2024,
  session: 'May/June',
  variant: null,
  paper: null,
  questionNumber: null,
  part: null,
  marks: 4,
  topic: 'Arrays',
  tags: ['IGCSE'],
  isPremium: false,
  ...partial,
});

describe('parsePracticeSearch', () => {
  it('reads known filters and ignores junk', () => {
    const active = parsePracticeSearch('?topic=Arrays&diff=hard&status=solved&sort=marks&year=2023&bogus=1');
    expect(active).toEqual({
      topic: 'Arrays',
      year: 2023,
      session: undefined,
      tag: undefined,
      q: undefined,
      diff: 'HARD',
      status: 'solved',
      sort: 'marks',
    });
  });

  it('defaults sort and drops invalid year/diff', () => {
    const active = parsePracticeSearch('diff=python&year=nope&sort=latest');
    expect(active.diff).toBeUndefined();
    expect(active.year).toBeUndefined();
    expect(active.sort).toBe('year');
  });
});

describe('computePracticeListing', () => {
  const questions = [
    q({ id: 'a', title: 'Alpha', difficulty: 'EASY', topic: 'Arrays' }),
    q({ id: 'b', title: 'Beta', difficulty: 'HARD', topic: 'Files', tags: ['A Level'], isPremium: true }),
    q({ id: 'c', title: 'Gamma', difficulty: 'EASY', topic: 'Arrays', year: 2023 }),
  ];

  it('cross-filters facet counts and groups by difficulty', () => {
    const listing = computePracticeListing(
      questions,
      parsePracticeSearch('topic=Arrays'),
      new Map(),
    );
    expect(listing.filtered.map((row) => row.id)).toEqual(['a', 'c']);
    expect(listing.topics.find((t) => t.name === 'Files')?.count).toBe(1);
    expect(listing.grouped.EASY).toHaveLength(2);
    expect(listing.grouped.HARD).toHaveLength(0);
  });

  it('status filter uses progress without shrinking other facets', () => {
    const progress = new Map([
      ['a', { status: 'SOLVED', bestScore: 4, totalTests: 4, updatedAt: '2026-01-01T00:00:00.000Z' }],
    ]);
    const listing = computePracticeListing(questions, parsePracticeSearch('status=solved'), progress);
    expect(listing.filtered.map((row) => row.id)).toEqual(['a']);
    expect(listing.statuses.find((s) => s.value === 'todo')?.count).toBe(2);
    expect(listing.statusAllCount).toBe(3);
  });
});

describe('buildPracticeUrl', () => {
  it('clears empty keys and returns a bare path when nothing remains', () => {
    expect(buildPracticeUrl('topic=Arrays', { topic: undefined })).toBe('/practice');
    expect(buildPracticeUrl('', { diff: 'EASY' })).toBe('/practice?diff=EASY');
  });
});
