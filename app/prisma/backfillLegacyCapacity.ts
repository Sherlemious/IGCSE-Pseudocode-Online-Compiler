import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * One-shot: freeze current paid teachers on the limits they already have.
 * Safe to re-run — only flips STARTER/PRO/SCHOOL rows that are still false.
 *
 *   npx tsx prisma/backfillLegacyCapacity.ts
 */
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: {
      plan: { in: ['STARTER', 'PRO', 'SCHOOL'] },
      legacyCapacity: false,
    },
    data: { legacyCapacity: true },
  });
  console.log(`✔ flagged ${result.count} paid teacher(s) as legacyCapacity`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
