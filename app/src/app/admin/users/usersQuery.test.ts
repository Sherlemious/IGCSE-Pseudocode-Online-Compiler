import { describe, expect, it } from 'vitest';
import { parseUserQuery, usersFiltering, usersHref, usersOrderBy, usersWhere } from './usersQuery';

const NOW = new Date('2026-10-05T12:00:00Z');

describe('parseUserQuery', () => {
  it('defaults to the newest page of everyone', () => {
    expect(parseUserQuery({})).toEqual({
      page: 1,
      q: '',
      role: null,
      plan: null,
      access: null,
      activity: null,
      sort: 'newest',
    });
  });

  it('keeps a real search, role, plan, access, activity, and sort', () => {
    expect(parseUserQuery({
      page: '2',
      q: '  ada ',
      role: 'TEACHER',
      plan: 'PRO',
      access: 'expiring',
      activity: 'quiet',
      sort: 'name',
    })).toEqual({
      page: 2,
      q: 'ada',
      role: 'TEACHER',
      plan: 'PRO',
      access: 'expiring',
      activity: 'quiet',
      sort: 'name',
    });
  });

  it('drops values that are not a real filter', () => {
    expect(parseUserQuery({
      page: '0',
      role: 'teacher',
      plan: 'CAMPUS',
      access: 'vip',
      activity: 'sleeping',
      sort: 'random',
    })).toMatchObject({
      page: 1,
      role: null,
      plan: null,
      access: null,
      activity: null,
      sort: 'newest',
    });
  });
});

describe('usersHref', () => {
  it('omits defaults', () => {
    expect(usersHref({ page: 1, sort: 'newest' })).toBe('/admin/users');
  });

  it('keeps the active lenses and later pages', () => {
    expect(usersHref({
      q: 'ada',
      role: 'TEACHER',
      access: 'trial',
      activity: 'path',
      sort: 'oldest',
      page: 3,
    })).toBe('/admin/users?q=ada&role=TEACHER&access=trial&activity=path&sort=oldest&page=3');
  });
});

describe('usersWhere', () => {
  it('is empty when nothing is filtered', () => {
    expect(usersWhere(parseUserQuery({}), NOW)).toEqual({});
  });

  it('treats an expired paid plan as free and a live one as paid', () => {
    const paid = usersWhere(parseUserQuery({ access: 'paid' }), NOW);
    expect(paid).toEqual({
      AND: [{
        plan: { not: 'FREE' },
        OR: [{ planExpiresAt: null }, { planExpiresAt: { gt: NOW } }],
      }],
    });

    const expiring = usersWhere(parseUserQuery({ access: 'expiring', role: 'TEACHER' }), NOW);
    expect(expiring).toEqual({
      AND: [
        { role: 'TEACHER' },
        {
          plan: { not: 'FREE' },
          planExpiresAt: { gt: NOW, lte: new Date('2026-10-19T12:00:00Z') },
        },
      ],
    });
  });

  it('can require a quiet teacher by name', () => {
    expect(usersFiltering(parseUserQuery({ q: 'ada', activity: 'quiet' }))).toBe(true);
    expect(usersWhere(parseUserQuery({ q: 'Ada', activity: 'quiet' }), NOW)).toEqual({
      AND: [
        {
          OR: [
            { name: { contains: 'Ada', mode: 'insensitive' } },
            { email: { contains: 'Ada', mode: 'insensitive' } },
          ],
        },
        {
          learnProgress: { none: {} },
          progress: { none: {} },
          examAttempts: { none: {} },
        },
      ],
    });
    expect(usersOrderBy('name')).toEqual([{ name: 'asc' }, { createdAt: 'desc' }]);
  });
});
