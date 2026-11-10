import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { questions } from '../prisma/seed';

type SeedQuestion = { title: string; starterCode?: string | null; hints?: string[] };

const titles = new Set(
  (JSON.parse(readFileSync('scripts/blanked-starters.json', 'utf8')) as { title: string }[]).map(
    (row) => row.title,
  ),
);

async function main() {
  const prisma = new PrismaClient();
  try {
    for (const question of questions as SeedQuestion[]) {
      if (!titles.has(question.title) || !question.starterCode) continue;
      const result = await prisma.question.updateMany({
        where: { title: question.title, ownerId: null },
        data: { starterCode: question.starterCode, hints: question.hints ?? [] },
      });
      console.log(`${result.count}  ${question.title}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
