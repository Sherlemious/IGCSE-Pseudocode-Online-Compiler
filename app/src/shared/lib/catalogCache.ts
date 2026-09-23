import { unstable_cache } from 'next/cache';
import type { Difficulty, Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';

/**
 * Practice questions / examples only change on seed. Three layers keep reads cheap:
 * - per-instance memory (warm Fluid instances skip the Data Cache entirely),
 * - the Vercel Data Cache, keyed per deployment because it outlives deploys
 *   (so a seed + deploy is picked up, including by build-time prerendering),
 * - Postgres.
 * A seed without a redeploy shows up within a day, or within MEMORY_TTL_MS via
 * POST /api/admin/revalidate-catalog (also refreshes the ISR pages tagged below).
 */
export const CATALOG_REVALIDATE_SECONDS = 24 * 60 * 60;
const MEMORY_TTL_MS = 5 * 60 * 1000;
const CATALOG_GENERATION =
  process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'local';

export const CATALOG_TAGS = {
  questions: 'questions',
  examples: 'examples',
} as const;

/** CDN / browser cache for public catalog GET routes. */
export const CATALOG_CACHE_CONTROL =
  'public, s-maxage=86400, stale-while-revalidate=604800';

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

/** Caches a loader in instance memory; a rejected load is dropped so the next call retries. */
function memoize<A extends string, T>(load: (key: A) => Promise<T>): (key: A) => Promise<T> {
  const entries = new Map<A, { at: number; value: Promise<T> }>();
  return (key) => {
    const hit = entries.get(key);
    if (hit && Date.now() - hit.at < MEMORY_TTL_MS) return hit.value;
    const value = load(key);
    entries.set(key, { at: Date.now(), value });
    value.catch(() => {
      if (entries.get(key)?.value === value) entries.delete(key);
    });
    return value;
  };
}

function dataCache<A extends unknown[], T>(
  load: (...args: A) => Promise<T>,
  name: string,
  tag: string,
): (...args: A) => Promise<T> {
  return unstable_cache(load, [name, CATALOG_GENERATION], {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [tag],
  });
}

const BANK_QUESTION_SELECT = {
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
} satisfies Prisma.QuestionSelect;

const QUESTION_ORDER = [{ year: 'desc' }, { title: 'asc' }] satisfies Prisma.QuestionOrderByWithRelationInput[];

type BankQuestionRow = Prisma.QuestionGetPayload<{ select: typeof BANK_QUESTION_SELECT }>;

function toBankQuestion(row: BankQuestionRow): BankQuestion {
  return { ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) };
}

/** List metadata only — no descriptions, starter code, hints or tests. */
async function loadCatalog(): Promise<QuestionCatalogItem[]> {
  const rows = await prisma.question.findMany({
    orderBy: QUESTION_ORDER,
    select: {
      id: true,
      title: true,
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
      updatedAt: true,
    },
  });
  return rows.map((row) => ({ ...row, updatedAt: iso(row.updatedAt) }));
}

async function loadQuestion(id: string): Promise<BankQuestion | null> {
  const row = await prisma.question.findUnique({ where: { id }, select: BANK_QUESTION_SELECT });
  return row ? toBankQuestion(row) : null;
}

async function loadSolution(id: string): Promise<QuestionSolution | null> {
  return prisma.question.findUnique({
    where: { id },
    select: { id: true, solution: true, solutionExplanation: true },
  });
}

/** `/api/questions` (exam builder): descriptions + visible test counts, still no test data. */
async function loadQuestionsApiList() {
  const rows = await prisma.question.findMany({ orderBy: QUESTION_ORDER, select: BANK_QUESTION_SELECT });
  return listQuestionsApiPayload(rows.map(toBankQuestion), {});
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

const cachedCatalog = memoize(dataCache(loadCatalog, 'question-catalog', CATALOG_TAGS.questions));
const cachedQuestion = memoize(dataCache(loadQuestion, 'question', CATALOG_TAGS.questions));
const cachedSolution = memoize(dataCache(loadSolution, 'question-solution', CATALOG_TAGS.questions));
const cachedQuestionsApiList = memoize(
  dataCache(loadQuestionsApiList, 'questions-api-list', CATALOG_TAGS.questions),
);
const cachedExampleCategories = memoize(
  dataCache(loadExampleCategories, 'example-categories', CATALOG_TAGS.examples),
);

export async function getQuestionCatalog(): Promise<QuestionCatalogItem[]> {
  return cachedCatalog('all');
}

export async function getQuestionCount(): Promise<number> {
  return (await getQuestionCatalog()).length;
}

export async function getExampleCategories(): Promise<ExampleCategory[]> {
  return cachedExampleCategories('all');
}

/** Unknown ids are rejected from the catalog so junk URLs never reach the DB or the cache. */
async function getBankQuestion(id: string): Promise<BankQuestion | null> {
  const known = (await getQuestionCatalog()).some((question) => question.id === id);
  return known ? cachedQuestion(id) : null;
}

export async function getPublicQuestion(id: string): Promise<PublicQuestion | null> {
  const question = await getBankQuestion(id);
  return question ? toPublicQuestion(question) : null;
}

export async function getQuestionForGrade(id: string): Promise<GradeQuestion | null> {
  const question = await getBankQuestion(id);
  return question ? toGradeQuestion(question) : null;
}

export async function getQuestionHints(id: string): Promise<string[] | null> {
  const question = await getBankQuestion(id);
  return question ? question.hints : null;
}

export async function getQuestionSolution(id: string): Promise<QuestionSolution | null> {
  const known = (await getQuestionCatalog()).some((question) => question.id === id);
  return known ? cachedSolution(id) : null;
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
  return (await cachedQuestionsApiList('all')).filter((question) => {
    if (filters.topic && question.topic !== filters.topic) return false;
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    return true;
  });
}
