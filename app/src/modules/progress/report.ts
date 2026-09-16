export type ProgressVoice = 'self' | 'teacher';

export type ProgressRow = {
  status: string;
  bestScore: number;
  totalTests: number;
  attempts: number;
  updatedAt: Date;
  question: { difficulty: string; topic: string | null; title: string };
};

export type ExamRow = {
  id: string;
  topic: string | null;
  difficulty: string | null;
  questionCount: number;
  timeLimitMin: number;
  status: string;
  score: number | null;
  totalTests: number | null;
  startedAt: Date;
  completedAt: Date | null;
};

export type RecentActivityItem = {
  questionTitle: string;
  difficulty: string;
  status: string;
  bestScore: number;
  totalTests: number;
  attempts: number;
  updatedAt: string;
};

export type ExamHistoryItem = {
  id: string;
  topic: string | null;
  difficulty: string | null;
  questionCount: number;
  timeLimitMin: number;
  status: string;
  score: number | null;
  totalTests: number | null;
  startedAt: string;
  completedAt: string | null;
};

export type ProgressReportData = {
  totalQuestions: number;
  totalAttempted: number;
  totalSolved: number;
  totalAttempts: number;
  examsCompleted: number;
  overallPct: number;
  remark: string;
  hasActivity: boolean;
  difficultyMap: Record<string, { attempted: number; solved: number }>;
  topicMap: Record<string, { attempted: number; solved: number }>;
  activityByDate: Record<string, number>;
  recentActivity: RecentActivityItem[];
  exams: ExamHistoryItem[];
};

export function remarkFor(solveRate: number, voice: ProgressVoice): string {
  if (voice === 'teacher') {
    if (solveRate >= 0.85) return 'Excellent — consistently strong, accurate work across their attempts.';
    if (solveRate >= 0.65) return 'Good progress. Keep the momentum and push into the harder questions.';
    if (solveRate >= 0.4) return 'Steady work. Revisit the weaker topics below to lift the solve rate.';
    return 'A start has been made — more practice, especially with hints when stuck, will help.';
  }
  if (solveRate >= 0.85) return 'Excellent — consistently strong, accurate work across your attempts.';
  if (solveRate >= 0.65) return 'Good progress. Keep the momentum and push into the harder questions.';
  if (solveRate >= 0.4) return 'Steady work. Revisit the weaker topics below to lift your solve rate.';
  return 'A start has been made — keep practising, and lean on the hints when you get stuck.';
}

export function buildProgressReport(
  progressData: ProgressRow[],
  examData: ExamRow[],
  totalQuestions: number,
  options?: { voice?: ProgressVoice },
): ProgressReportData {
  const voice = options?.voice ?? 'self';
  const totalAttempted = progressData.length;
  const totalSolved = progressData.filter((p) => p.status === 'SOLVED').length;
  const totalAttempts = progressData.reduce((s, p) => s + p.attempts, 0);
  const examsCompleted = examData.filter((e) => e.status !== 'IN_PROGRESS').length;
  const solveRate = totalAttempted > 0 ? totalSolved / totalAttempted : 0;

  const difficultyMap: Record<string, { attempted: number; solved: number }> = {
    EASY: { attempted: 0, solved: 0 },
    MEDIUM: { attempted: 0, solved: 0 },
    HARD: { attempted: 0, solved: 0 },
  };
  const topicMap: Record<string, { attempted: number; solved: number }> = {};
  const activityByDate: Record<string, number> = {};

  for (const p of progressData) {
    const d = p.question.difficulty;
    if (difficultyMap[d]) {
      difficultyMap[d].attempted++;
      if (p.status === 'SOLVED') difficultyMap[d].solved++;
    }
    const t = p.question.topic || 'Uncategorized';
    if (!topicMap[t]) topicMap[t] = { attempted: 0, solved: 0 };
    topicMap[t].attempted++;
    if (p.status === 'SOLVED') topicMap[t].solved++;

    const date = p.updatedAt.toISOString().split('T')[0];
    activityByDate[date] = (activityByDate[date] ?? 0) + 1;
  }

  for (const e of examData) {
    const date = e.startedAt.toISOString().split('T')[0];
    activityByDate[date] = (activityByDate[date] ?? 0) + 1;
  }

  return {
    totalQuestions,
    totalAttempted,
    totalSolved,
    totalAttempts,
    examsCompleted,
    overallPct: Math.round(solveRate * 100),
    remark: remarkFor(solveRate, voice),
    hasActivity: totalAttempted > 0 || examsCompleted > 0,
    difficultyMap,
    topicMap,
    activityByDate,
    recentActivity: progressData.slice(0, 10).map((p) => ({
      questionTitle: p.question.title,
      difficulty: p.question.difficulty,
      status: p.status,
      bestScore: p.bestScore,
      totalTests: p.totalTests,
      attempts: p.attempts,
      updatedAt: p.updatedAt.toISOString(),
    })),
    exams: examData.slice(0, 10).map((e) => ({
      id: e.id,
      topic: e.topic,
      difficulty: e.difficulty,
      questionCount: e.questionCount,
      timeLimitMin: e.timeLimitMin,
      status: e.status,
      score: e.score,
      totalTests: e.totalTests,
      startedAt: e.startedAt.toISOString(),
      completedAt: e.completedAt?.toISOString() ?? null,
    })),
  };
}
