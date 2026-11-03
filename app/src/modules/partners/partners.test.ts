import { describe, expect, it } from 'vitest';
import { isPartner, isPartnerSurface, partnerDestination, partnerOutHref } from './partners';

describe('partners', () => {
  it('keeps the campaign UTMs and adds the placement as utm_content', () => {
    const url = new URL(partnerDestination('learningmate', 'mark_book'));
    expect(url.origin + url.pathname).toBe('https://thelearningmate.com/trial');
    expect(url.searchParams.get('utm_source')).toBe('pseudocode-compiler');
    expect(url.searchParams.get('utm_medium')).toBe('referral');
    expect(url.searchParams.get('utm_campaign')).toBe('hack-community');
    expect(url.searchParams.get('utm_content')).toBe('mark_book');
  });

  it('only accepts listed partners and surfaces (no open redirect)', () => {
    expect(isPartner('learningmate')).toBe(true);
    expect(isPartner('evil.com')).toBe(false);
    expect(isPartner('toString')).toBe(false);
    expect(isPartnerSurface('classes')).toBe(true);
    expect(isPartnerSurface('https://x')).toBe(false);
    expect(isPartnerSurface(null)).toBe(false);
  });

  it('builds the tracked hop', () => {
    expect(partnerOutHref('learningmate', 'classes')).toBe('/api/out/learningmate?s=classes');
  });
});
