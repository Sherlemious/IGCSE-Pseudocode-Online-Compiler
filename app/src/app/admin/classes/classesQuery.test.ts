import { describe, expect, it } from 'vitest';
import {
  classesFiltering,
  classesHref,
  classesWhere,
  parseClassQuery,
  rankTeachers,
  teacherSortKey,
} from './classesQuery';

const DAY = 24 * 60 * 60 * 1000;
const t0 = new Date('2026-09-01T12:00:00Z');

describe('parseClassQuery', () => {
  it('defaults to the newest page of every class', () => {
    expect(parseClassQuery({})).toEqual({
      page: 1,
      q: '',
      status: null,
      sort: 'newest',
      classId: null,
    });
  });

  it('keeps a real search, status, sort, and open class', () => {
    expect(parseClassQuery({
      page: '2',
      q: '  ada ',
      status: 'empty',
      sort: 'students',
      class: ' cls_123 ',
    })).toEqual({
      page: 2,
      q: 'ada',
      status: 'empty',
      sort: 'students',
      classId: 'cls_123',
    });
  });

  it('drops values that are not a real filter', () => {
    expect(parseClassQuery({
      page: '0',
      status: 'deleted',
      sort: 'random',
    })).toMatchObject({
      page: 1,
      status: null,
      sort: 'newest',
    });
  });
});

describe('classesHref', () => {
  it('omits defaults', () => {
    expect(classesHref({ page: 1, sort: 'newest' })).toBe('/admin/classes');
  });

  it('keeps the active lenses, the open class, and later pages', () => {
    expect(classesHref({
      q: 'ada',
      status: 'enrolled',
      sort: 'teacher',
      classId: 'cls_1',
      page: 3,
    })).toBe('/admin/classes?q=ada&status=enrolled&sort=teacher&class=cls_1&page=3');
  });
});

describe('classesWhere', () => {
  it('is empty when nothing is filtered', () => {
    expect(classesWhere({ q: '', status: null })).toEqual({});
  });

  it('matches the teacher, the class name, or the join code', () => {
    expect(classesWhere({ q: 'ada', status: null })).toEqual({
      AND: [{
        OR: [
          { name: { contains: 'ada', mode: 'insensitive' } },
          { joinCode: { contains: 'ada', mode: 'insensitive' } },
          { owner: { name: { contains: 'ada', mode: 'insensitive' } } },
          { owner: { email: { contains: 'ada', mode: 'insensitive' } } },
        ],
      }],
    });
  });

  it('treats empty as an active class with nobody in it', () => {
    expect(classesWhere({ q: '', status: 'empty' })).toEqual({
      AND: [{ archived: false, memberships: { none: {} } }],
    });
  });
});

describe('classesFiltering', () => {
  it('ignores an opened class', () => {
    expect(classesFiltering(parseClassQuery({ class: 'cls_1' }))).toBe(false);
  });
});

describe('rankTeachers', () => {
  const rows = [
    { ownerId: 'ada', createdAt: t0, students: 2, teacher: teacherSortKey('Ada', 'ada@school.edu') },
    { ownerId: 'ada', createdAt: new Date(t0.getTime() + 10 * DAY), students: 4, teacher: teacherSortKey('Ada', null) },
    { ownerId: 'bo', createdAt: new Date(t0.getTime() + 2 * DAY), students: 9, teacher: teacherSortKey('Bo', 'bo@school.edu') },
  ];

  it('orders by the newest class the teacher created', () => {
    expect(rankTeachers(rows, 'newest').map((row) => row.ownerId)).toEqual(['ada', 'bo']);
    expect(rankTeachers(rows, 'newest')[0]).toMatchObject({ classes: 2, students: 6 });
  });

  it('orders by how many students joined', () => {
    expect(rankTeachers(rows, 'students').map((row) => row.ownerId)).toEqual(['bo', 'ada']);
  });

  it('orders by teacher name', () => {
    expect(rankTeachers(rows, 'teacher').map((row) => row.ownerId)).toEqual(['ada', 'bo']);
  });
});
