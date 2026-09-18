import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import type { Difficulty } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Practice questions / examples only change on seed. */
export const CATALOG_REVALIDATE_SECONDS = 6 * 60 * 60;

export const CATALOG_TAGS = {
  questions: 'questions',
  examples: 'examples',
} as const;

/** CDN / browser cache for public catalog GET routes. */
export const CATALOG_CACHE_CONTROL =
  'public, s-maxage=3600, stale-while-revalidate=86400';

export type BankTestCase = {
  id: string;
  inputs: string[];
  expectedOutput: string;
  isHidden: boolean;
  description: string | null;
  sortOrder: number;
  initialFiles: string | null;
};

export type BankQuestion = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  year: number | null;
  session: string | null;
  variant: number | null;
  paper: string | null;
  questionNumber: number | null;
  part: string | null;
  marks: number | null;
  topic: string | null;
  tags: string[];
  isPremium: boolean;
  starterCode: string | null;
  hints: string[];
  createdAt: string;
  updatedAt: string;
  testCases: BankTestCase[];
};

export type QuestionCatalogItem = Omit<
  BankQuestion,
  'description' | 'starterCode' | 'hints' | 'createdAt' | 'testCases'
>;

export type VisibleTestCase = Omit<BankTestCase, 'isHidden'>;

export type PublicQuestion = Omit<BankQuestion, 'testCases'> & {
  testCases: VisibleTestCase[];
};

export type GradeQuestion = {
  id: string;
  difficulty: Difficulty;
  isPremium: boolean;
  testCases: BankTestCase[];
};

export type QuestionSolution = {
  id: string;
  solution: string | null;
  solutionExplanation: string | null;
};

export type ExampleCategory = {
  name: string;
  examples: { id: string; title: string; code: string }[];
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
};

function iso(value: Date): string {
  return value.toISOString();
}

export function toCatalogItem(question: BankQuestion): QuestionCatalogItem {
  return {
    id: question.id,
    title: question.title,
    difficulty: question.difficulty,
    year: question.year,
    session: question.session,
    variant: question.variant,
    paper: question.paper,
    questionNumber: question.questionNumber,
    part: question.part,
    marks: question.marks,
    topic: question.topic,
    tags: question.tags,
    isPremium: question.isPremium,
    updatedAt: question.updatedAt,
  };
}

export function toPublicQuestion(question: BankQuestion): PublicQuestion {
  return {
    ...question,
    testCases: question.testCases
      .filter((test) => !test.isHidden)
      .map((test) => ({
        id: test.id,
        inputs: test.inputs,
        expectedOutput: test.expectedOutput,
        description: test.description,
        sortOrder: test.sortOrder,
        initialFiles: test.initialFiles,
      })),
  };
}

export function toGradeQuestion(question: BankQuestion): GradeQuestion {
  return {
    id: question.id,
    difficulty: question.difficulty,
    isPremium: question.isPremium,
    testCases: question.testCases,
  };
}

export function filterExamPool(
  catalog: QuestionCatalogItem[],
  opts: { topic?: string | null; difficulty?: string | null; includePremium: boolean },
): { id: string }[] {
  return catalog
    .filter((question) => {
      if (!opts.includePremium && question.isPremium) return false;
      if (opts.topic && question.topic !== opts.topic) return false;
      if (opts.difficulty && question.difficulty !== opts.difficulty) return false;
      return true;
    })
    .map((question) => ({ id: question.id }));
}

export function listQuestionTopics(
  catalog: QuestionCatalogItem[],
  includePremium: boolean,
): string[] {
  const topics = new Set<string>();
  for (const question of catalog) {
    if (!includePremium && question.isPremium) continue;
    if (question.topic) topics.add(question.topic);
  }
  return Array.from(topics).sort((a, b) => a.localeCompare(b));
}

export function existingQuestionIds(catalog: QuestionCatalogItem[], ids: string[]): string[] {
  const known = new Set(catalog.map((question) => question.id));
  return ids.filter((id) => known.has(id));
}

export function listQuestionsApiPayload(
  bank: BankQuestion[],
  filters: { topic?: string | null; difficulty?: Difficulty | null },
) {
  return bank
    .filter((question) => {
      if (filters.topic && question.topic !== filters.topic) return false;
      if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
      return true;
    })
    .sort(
      (a, b) =>
        DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] ||
        a.title.localeCompare(b.title),
    )
    .map((question) => ({
      id: question.id,
      title: question.title,
      description: question.description,
      difficulty: question.difficulty,
      year: question.year,
      paper: question.paper,
      topic: question.topic,
      _count: { testCases: question.testCases.filter((test) => !test.isHidden).length },
    }));
}

async function loadQuestionBank(): Promise<BankQuestion[]> {
  const rows = await prisma.question.findMany({
    orderBy: [{ year: 'desc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      year: true,
      session: true,
      variant: true,
      paper: true,
      questionNumber: true,
      part: true,
      marks: true,
      topic: true,
      tags: true,
      isPremium: true,
      starterCode: true,
      hints: true,
      createdAt: true,
      updatedAt: true,
      testCases: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          inputs: true,
          expectedOutput: true,
          isHidden: true,
          description: true,
          sortOrder: true,
          initialFiles: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    ...row,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  }));
}

async function loadSolutionBank(): Promise<QuestionSolution[]> {
  return prisma.question.findMany({
    select: { id: true, solution: true, solutionExplanation: true },
  });
}

async function loadExampleCategories(): Promise<ExampleCategory[]> {
  const examples = await prisma.example.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    select: { id: true, title: true, category: true, code: true },
  });

  const grouped = new Map<string, { id: string; title: string; code: string }[]>();
  for (const example of examples) {
    const list = grouped.get(example.category) ?? [];
    list.push({ id: example.id, title: example.title, code: example.code });
    grouped.set(example.category, list);
  }

  return Array.from(grouped.entries()).map(([name, list]) => ({ name, examples: list }));
}

const getQuestionBank = cache(
  unstable_cache(loadQuestionBank, ['question-bank'], {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.questions],
  }),
);

const getSolutionBank = cache(
  unstable_cache(loadSolutionBank, ['question-solutions'], {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.questions],
  }),
);

export const getExampleCategories = cache(
  unstable_cache(loadExampleCategories, ['example-categories'], {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.examples],
  }),
);

export async function getQuestionCatalog(): Promise<QuestionCatalogItem[]> {
  const bank = await getQuestionBank();
  return bank.map(toCatalogItem);
}

export async function getQuestionCount(): Promise<number> {
  return (await getQuestionBank()).length;
}

export async function getPublicQuestion(id: string): Promise<PublicQuestion | null> {
  const question = (await getQuestionBank()).find((row) => row.id === id);
  return question ? toPublicQuestion(question) : null;
}

export async function getQuestionForGrade(id: string): Promise<GradeQuestion | null> {
  const question = (await getQuestionBank()).find((row) => row.id === id);
  return question ? toGradeQuestion(question) : null;
}

export async function getQuestionHints(id: string): Promise<string[] | null> {
  const question = (await getQuestionBank()).find((row) => row.id === id);
  return question ? question.hints : null;
}

export async function getQuestionSolution(id: string): Promise<QuestionSolution | null> {
  return (await getSolutionBank()).find((row) => row.id === id) ?? null;
}

export async function getExamQuestionPool(opts: {
  topic?: string | null;
  difficulty?: string | null;
  includePremium: boolean;
}): Promise<{ id: string }[]> {
  return filterExamPool(await getQuestionCatalog(), opts);
}

export async function getQuestionTopics(includePremium: boolean): Promise<string[]> {
  return listQuestionTopics(await getQuestionCatalog(), includePremium);
}

export async function existingCatalogQuestionIds(ids: string[]): Promise<string[]> {
  return existingQuestionIds(await getQuestionCatalog(), ids);
}

export async function getQuestionsApiPayload(filters: {
  topic?: string | null;
  difficulty?: Difficulty | null;
}) {
  return listQuestionsApiPayload(await getQuestionBank(), filters);
}
