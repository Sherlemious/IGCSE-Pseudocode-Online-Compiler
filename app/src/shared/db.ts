import { SpanStatusCode, trace } from '@opentelemetry/api';
import { PrismaClient } from '@prisma/client';

const tracer = trace.getTracer('prisma');

function withDbSpan<T>(name: string, operation: string, model: string | undefined, run: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    span.setAttribute('db.system.name', 'postgresql');
    span.setAttribute('db.operation.name', operation);
    if (model) span.setAttribute('db.collection.name', model);
    try {
      return await run();
    } catch (err) {
      // Status only — Prisma errors quote the query, which can contain student code or emails.
      span.setAttribute('error.type', err instanceof Error ? err.name : 'Error');
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw err;
    } finally {
      span.end();
    }
  });
}

function createPrisma(): PrismaClient {
  const client = new PrismaClient().$extends({
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          return withDbSpan(`prisma ${model}.${operation}`, operation, model, () => query(args));
        },
      },
      $queryRaw({ args, query }) {
        return withDbSpan('prisma $queryRaw', '$queryRaw', undefined, () => query(args));
      },
      $queryRawUnsafe({ args, query }) {
        return withDbSpan('prisma $queryRawUnsafe', '$queryRawUnsafe', undefined, () => query(args));
      },
      $executeRaw({ args, query }) {
        return withDbSpan('prisma $executeRaw', '$executeRaw', undefined, () => query(args));
      },
      $executeRawUnsafe({ args, query }) {
        return withDbSpan('prisma $executeRawUnsafe', '$executeRawUnsafe', undefined, () => query(args));
      },
    },
  });
  return client as unknown as PrismaClient;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
