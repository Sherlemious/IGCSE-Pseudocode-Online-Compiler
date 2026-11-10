import { questions } from '../prisma/seed';
import { gradeTestCases } from '../src/modules/practice/autograder';

type SeedQuestion = {
  title: string;
  starterCode?: string | null;
  solution?: string | null;
  testCases?: { inputs: string[]; expectedOutput: string; initialFiles?: unknown }[];
};

async function main() {
  const passing: string[] = [];
  for (const question of questions as SeedQuestion[]) {
  if (!question.starterCode || !question.testCases?.length) continue;
  const tests = question.testCases.map((tc) => ({
    inputs: tc.inputs,
    expectedOutput: tc.expectedOutput,
    initialFiles:
      tc.initialFiles == null
        ? null
        : typeof tc.initialFiles === 'string'
          ? tc.initialFiles
          : JSON.stringify(tc.initialFiles),
  }));
  const results = await gradeTestCases(question.starterCode, tests, {
    testTimeoutMs: 2500,
    totalBudgetMs: 8000,
  });
  if (results.every((result) => result.passed)) {
    const same = question.starterCode.trim() === (question.solution ?? '').trim();
    passing.push(`${same ? 'SAME' : 'DIFF'}  ${question.title}`);
  }
  }
  console.log(passing.join('\n'));
  console.log(`\n${passing.length} starters already pass`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
