import { Prisma } from '@prisma/client';
import { prisma } from '@/shared/db';

/** Anonymous product-health data: sanitized parse-error samples and sightings of copied deployments. */

export function createErrorSample(data: {
  category: string;
  errorType: string;
  code: string;
  rawMessage: string | null;
  line: number | null;
  codeLines: number | null;
  feature: string | null;
}) {
  return prisma.errorSample.create({ data });
}

export function pruneErrorSamples(olderThan: Date) {
  return prisma.errorSample.deleteMany({ where: { createdAt: { lt: olderThan } } });
}

/**
 * Records a host. Returns true the first time a host is seen (worth an email),
 * false when it was already known (its hit count goes up instead).
 */
export async function recordHostSighting(host: string): Promise<boolean> {
  try {
    await prisma.hostSighting.create({ data: { host } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      await prisma.hostSighting.update({ where: { host }, data: { hits: { increment: 1 } } });
      return false;
    }
    throw error;
  }
}
