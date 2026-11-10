import { readFileSync, writeFileSync } from 'node:fs';
import { questions } from '../prisma/seed';
import { gradeTestCases } from '../src/modules/practice/autograder';

type SeedQuestion = {
  title: string;
  starterCode?: string | null;
  testCases?: { inputs: string[]; expectedOutput: string; initialFiles?: unknown }[];
};

const FILES = [
  'prisma/seed.ts',
  'prisma/thinTopicQuestions.ts',
  'prisma/studentDrillQuestions.ts',
  'prisma/igcseRecentPaperQuestions.ts',
  'prisma/flowchartQuestions.ts',
];

/** Drop the lines that make a starter pass, and leave one comment in their place. */
export function blankAnswerLines(starter: string): string {
  const out: string[] = [];
  let answered = false;
  const isNote = (trimmed: string) => !trimmed || trimmed.startsWith('//') || /^DECLARE\b/i.test(trimmed);
  const isLeading = (trimmed: string) =>
    isNote(trimmed) || /^CONSTANT\b/i.test(trimmed) || /^INPUT\b/i.test(trimmed);

  for (const line of starter.split('\n')) {
    const trimmed = line.trim();
    if (!answered && isLeading(trimmed)) {
      out.push(line);
      continue;
    }
    if (!answered) {
      const indent = line.match(/^\s*/)?.[0] ?? '';
      out.push(`${indent}// Write your answer here`);
      answered = true;
    }
    if (isNote(trimmed)) out.push(line);
  }
  return out.join('\n');
}

function testsOf(question: SeedQuestion) {
  return (question.testCases ?? []).map((tc) => ({
    inputs: tc.inputs,
    expectedOutput: tc.expectedOutput,
    initialFiles:
      tc.initialFiles == null
        ? null
        : typeof tc.initialFiles === 'string'
          ? tc.initialFiles
          : JSON.stringify(tc.initialFiles),
  }));
}

async function main() {
  const sources = new Map(FILES.map((file) => [file, readFileSync(file, 'utf8')]));
  const updated: { title: string; starterCode: string }[] = [];

  for (const question of questions as SeedQuestion[]) {
    if (!question.starterCode || !question.testCases?.length) continue;
    const results = await gradeTestCases(question.starterCode, testsOf(question), {
      testTimeoutMs: 2500,
      totalBudgetMs: 8000,
    });
    if (!results.every((result) => result.passed)) continue;

    const blanked = blankAnswerLines(question.starterCode);
    const again = await gradeTestCases(blanked, testsOf(question), {
      testTimeoutMs: 2500,
      totalBudgetMs: 8000,
    });
    if (again.every((result) => result.passed)) {
      throw new Error(`Blanked starter still passes: ${question.title}`);
    }

    let replaced = false;
    for (const [file, source] of sources) {
      const titleAt = source.indexOf(`title: '${question.title.replace(/'/g, "\\'")}'`);
      if (titleAt < 0) continue;
      const marker = 'starterCode: `';
      const start = source.indexOf(marker, titleAt);
      if (start < 0) throw new Error(`No starterCode after ${question.title} in ${file}`);
      const bodyStart = start + marker.length;
      const bodyEnd = source.indexOf('`', bodyStart);
      const body = source.slice(bodyStart, bodyEnd).replace(/\r\n/g, '\n');
      if (body !== question.starterCode.replace(/\r\n/g, '\n')) {
        throw new Error(`Starter text does not match the file for ${question.title} in ${file}`);
      }
      const newline = source.includes('\r\n') ? '\r\n' : '\n';
      const blankedForFile = blanked.replace(/\n/g, newline);
      sources.set(file, source.slice(0, bodyStart) + blankedForFile + source.slice(bodyEnd));
      replaced = true;
      break;
    }
    if (!replaced) throw new Error(`Title not found in a seed file: ${question.title}`);
    updated.push({ title: question.title, starterCode: blanked });
  }

  for (const [file, source] of sources) writeFileSync(file, source);
  writeFileSync('scripts/blanked-starters.json', JSON.stringify(updated, null, 2));
  console.log(`Blanked ${updated.length} starters`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
