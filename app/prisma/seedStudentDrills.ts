import { PrismaClient } from '@prisma/client';
import { studentDrillQuestions } from './studentDrillQuestions';

const prisma = new PrismaClient();

async function main() {
  for (const question of studentDrillQuestions) {
    const { testCases, ...questionData } = question;
    const existing = await prisma.question.findFirst({
      where: { title: question.title, ownerId: null },
    });
    if (existing) {
      console.log(`already seeded: ${question.title}`);
      continue;
    }
    await prisma.question.create({
      data: {
        ...questionData,
        ownerId: null,
        testCases: {
          create: testCases.map((testCase) => ({
            inputs: testCase.inputs,
            expectedOutput: testCase.expectedOutput,
            description: testCase.description ?? null,
            isHidden: testCase.isHidden ?? false,
            sortOrder: testCase.sortOrder,
          })),
        },
      },
    });
    console.log(`created: ${question.title}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
