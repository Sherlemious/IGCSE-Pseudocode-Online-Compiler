import { prisma } from '@/shared/db';
import { mergeRosterStats, type RosterMemberStats } from './rosterStats';

export async function loadRosterStats(
  memberIds: string[],
  assignmentIds: string[],
): Promise<Map<string, RosterMemberStats>> {
  if (memberIds.length === 0) return new Map();

  const inMembers = { userId: { in: memberIds } };

  const [solved, attempted, examLast, completedAssignments] = await Promise.all([
    prisma.progress.groupBy({
      by: ['userId'],
      where: { ...inMembers, status: 'SOLVED' },
      _count: { _all: true },
    }),
    prisma.progress.groupBy({
      by: ['userId'],
      where: inMembers,
      _count: { _all: true },
      _max: { updatedAt: true },
    }),
    prisma.examAttempt.groupBy({
      by: ['userId'],
      where: inMembers,
      _max: { startedAt: true, completedAt: true },
    }),
    assignmentIds.length
      ? prisma.examAttempt.findMany({
          where: {
            ...inMembers,
            assignmentId: { in: assignmentIds },
            status: { in: ['COMPLETED', 'TIMED_OUT'] },
          },
          distinct: ['assignmentId', 'userId'],
          select: { assignmentId: true, userId: true },
        })
      : Promise.resolve([]),
  ]);

  return mergeRosterStats(memberIds, { solved, attempted, examLast, completedAssignments });
}
