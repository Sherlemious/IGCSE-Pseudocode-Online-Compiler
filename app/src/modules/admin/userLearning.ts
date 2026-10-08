import { COURSE_CHOICES } from '@/modules/learn/courseChoice';
import { courseById } from '@/modules/learn/curriculum';
import { buildLearnProgressView } from '@/modules/learn/progressView';
import type { LearnProgressRecord } from '@/modules/learn/progress';
import { getQuestionCatalog } from '@/shared/lib/catalogCache';
import { loadUserLearningRows } from './repo';

/** One student's Learn paths, recent practice and exams, as the admin user drawer shows them. */
export async function getUserLearning(userId: string) {
  const [{ learnRows, recentPractice, solvedCount, attemptedCount, exams }, catalog] = await Promise.all([
    loadUserLearningRows(userId),
    getQuestionCatalog(),
  ]);

  const byCourse = new Map<string, LearnProgressRecord[]>();
  for (const row of learnRows) {
    const list = byCourse.get(row.courseId) ?? [];
    list.push({
      lessonId: row.lessonId,
      status: row.status,
      attempts: row.attempts,
      lastOk: row.lastOk,
      lastReason: row.lastReason,
      lastCode: null,
      completedAt: row.completedAt,
      updatedAt: row.updatedAt,
    });
    byCourse.set(row.courseId, list);
  }

  const titles = new Map(catalog.map((q) => [q.id, q.title]));
  const paths = COURSE_CHOICES.flatMap((choice) => {
    const course = courseById(choice.id);
    if (!course) return [];
    const view = buildLearnProgressView(byCourse.get(choice.id) ?? [], course);
    return [{
      courseId: view.courseId,
      exam: choice.exam,
      paper: choice.paper,
      playableCount: view.playableCount,
      completedCount: view.completedCount,
      attemptedCount: view.attemptedCount,
      notStartedCount: view.notStartedCount,
      lastActivityAt: view.lastActivityAt,
      lessons: view.lessons.map((lesson) => ({
        lessonId: lesson.lessonId,
        title: lesson.title,
        levelNumber: lesson.levelNumber,
        levelName: lesson.levelName,
        levelSlug: lesson.levelSlug,
        state: lesson.state,
        attempts: lesson.attempts,
      })),
    }];
  });

  return {
    paths,
    practice: {
      solved: solvedCount,
      attempted: attemptedCount,
      recent: recentPractice.map((row) => ({ ...row, title: titles.get(row.questionId) ?? row.questionId })),
    },
    exams,
  };
}
