import { prisma } from '@/shared/db';
import {
  CLASS_MEMBER_CAP,
  CLASSES_PAGE_SIZE,
  classesWhere,
  rankTeachers,
  teacherSortKey,
  type ClassQuery,
} from './classesQuery';

export type ClassFacets = {
  teachers: number;
  classes: number;
  active: number;
  archived: number;
  empty: number;
  enrolled: number;
  students: number;
};

export type ClassMember = {
  id: string;
  joinedAt: Date;
  name: string | null;
  email: string | null;
};

export type AdminClassRow = {
  id: string;
  name: string;
  joinCode: string;
  archived: boolean;
  createdAt: Date;
  students: number;
  assignments: number;
  members: ClassMember[] | null;
  membersTruncated: boolean;
};

export type AdminTeacherRow = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  plan: string;
  planTier: string | null;
  classes: AdminClassRow[];
  students: number;
};

const classSelect = {
  id: true,
  name: true,
  joinCode: true,
  archived: true,
  createdAt: true,
  _count: { select: { memberships: true, assignments: true } },
} as const;

async function loadMembers(classId: string): Promise<ClassMember[]> {
  const rows = await prisma.classMembership.findMany({
    where: { classId },
    orderBy: { joinedAt: 'desc' },
    take: CLASS_MEMBER_CAP,
    select: {
      id: true,
      joinedAt: true,
      user: { select: { name: true, email: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    joinedAt: row.joinedAt,
    name: row.user.name,
    email: row.user.email,
  }));
}

export async function loadClassFacets(): Promise<ClassFacets> {
  const [teachers, classes, active, archived, empty, enrolled, students] = await Promise.all([
    prisma.user.count({ where: { taughtClasses: { some: {} } } }),
    prisma.class.count(),
    prisma.class.count({ where: { archived: false } }),
    prisma.class.count({ where: { archived: true } }),
    prisma.class.count({ where: { archived: false, memberships: { none: {} } } }),
    prisma.class.count({ where: { memberships: { some: {} } } }),
    prisma.classMembership.count(),
  ]);
  return { teachers, classes, active, archived, empty, enrolled, students };
}

export async function loadClassAdmin(query: ClassQuery): Promise<{
  facets: ClassFacets;
  teachers: AdminTeacherRow[];
  teacherTotal: number;
  classTotal: number;
  page: number;
  pageCount: number;
}> {
  const where = classesWhere(query);
  const [facets, summaries] = await Promise.all([
    loadClassFacets(),
    prisma.class.findMany({
      where,
      select: {
        id: true,
        ownerId: true,
        createdAt: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { memberships: true } },
      },
    }),
  ]);

  const ranked = rankTeachers(
    summaries.map((row) => ({
      ownerId: row.ownerId,
      createdAt: row.createdAt,
      students: row._count.memberships,
      teacher: teacherSortKey(row.owner.name, row.owner.email),
    })),
    query.sort,
  );
  const pageCount = Math.max(1, Math.ceil(ranked.length / CLASSES_PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const slice = ranked.slice((page - 1) * CLASSES_PAGE_SIZE, page * CLASSES_PAGE_SIZE);
  const ids = slice.map((row) => row.ownerId);

  const users = ids.length === 0
    ? []
    : await prisma.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        planTier: true,
        taughtClasses: {
          where,
          orderBy: { createdAt: 'desc' },
          select: classSelect,
        },
      },
    });

  const byId = new Map(users.map((user) => [user.id, user]));
  const teachers: AdminTeacherRow[] = slice.flatMap((rank) => {
    const user = byId.get(rank.ownerId);
    if (!user) return [];
    return [{
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      plan: user.plan,
      planTier: user.planTier,
      students: rank.students,
      classes: user.taughtClasses.map((cls) => ({
        id: cls.id,
        name: cls.name,
        joinCode: cls.joinCode,
        archived: cls.archived,
        createdAt: cls.createdAt,
        students: cls._count.memberships,
        assignments: cls._count.assignments,
        members: null,
        membersTruncated: false,
      })),
    }];
  });

  const open = query.classId
    ? teachers.flatMap((teacher) => teacher.classes).find((cls) => cls.id === query.classId)
    : undefined;
  if (open) {
    open.members = await loadMembers(open.id);
    open.membersTruncated = open.students > open.members.length;
  }

  return {
    facets,
    teachers,
    teacherTotal: ranked.length,
    classTotal: summaries.length,
    page,
    pageCount,
  };
}
