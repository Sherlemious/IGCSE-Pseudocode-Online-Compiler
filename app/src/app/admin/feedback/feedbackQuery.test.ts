import { describe, expect, it } from 'vitest';
import { pageWindow } from '../_components/pageWindow';
import { feedbackHref, parseFeedbackQuery } from './feedbackQuery';

describe('parseFeedbackQuery', () => {
  it('defaults to the first page with no filters', () => {
    expect(parseFeedbackQuery({})).toEqual({ page: 1, rating: null, tier: null });
  });

  it('keeps a valid page, rating, and tier', () => {
    expect(parseFeedbackQuery({ page: '3', rating: '1', tier: 'low' })).toEqual({
      page: 3,
      rating: 1,
      tier: 'low',
    });
  });

  it('drops values that are not a real page, rating, or tier', () => {
    expect(parseFeedbackQuery({ page: '0', rating: '6', tier: 'gold' })).toEqual({
      page: 1,
      rating: null,
      tier: null,
    });
    expect(parseFeedbackQuery({ page: 'nope', rating: '1.5', tier: 'LOW' })).toEqual({
      page: 1,
      rating: null,
      tier: null,
    });
  });
});

describe('feedbackHref', () => {
  it('omits the default page and empty filters', () => {
    expect(feedbackHref({ page: 1, rating: null, tier: null })).toBe('/admin/feedback');
  });

  it('keeps the active filter and later pages', () => {
    expect(feedbackHref({ page: 2, rating: 5, tier: 'high' })).toBe(
      '/admin/feedback?rating=5&tier=high&page=2',
    );
  });
});

describe('pageWindow', () => {
  it('lists every page when there are only a few', () => {
    expect(pageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('collapses a long list around the current page', () => {
    expect(pageWindow(5, 12)).toEqual([1, 'gap', 4, 5, 6, 'gap', 12]);
    expect(pageWindow(1, 12)).toEqual([1, 2, 'gap', 12]);
    expect(pageWindow(12, 12)).toEqual([1, 'gap', 11, 12]);
  });
});
