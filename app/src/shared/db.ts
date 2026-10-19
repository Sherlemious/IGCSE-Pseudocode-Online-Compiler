import { SpanStatusCode, trace } from '@opentelemetry/api';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type Prisma } from '@prisma/client';

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

function createPrisma(options?: Prisma.PrismaClientOptions): PrismaClient {
  const client = new PrismaClient(options).$extends({
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

type CloudflareContext = {
  env: { HYPERDRIVE?: { connectionString: string }; DATABASE_URL?: string };
  ctx: object;
};

/** Set per request by the OpenNext worker (an AsyncLocalStorage getter); undefined on Vercel and in `next build`. */
function cloudflareContext(): CloudflareContext | undefined {
  return (globalThis as Record<symbol, CloudflareContext | undefined>)[Symbol.for('__cloudflare-context__')];
}

// Workers can't reuse a socket across requests, so each request gets its own client.
const workerClients = new WeakMap<object, PrismaClient>();

function workerClient(cf: CloudflareContext): PrismaClient {
  let client = workerClients.get(cf.ctx);
  if (!client) {
    const connectionString = cf.env.HYPERDRIVE?.connectionString ?? cf.env.DATABASE_URL ?? process.env.DATABASE_URL;
    client = createPrisma({ adapter: new PrismaPg({ connectionString, maxUses: 1 }) });
    workerClients.set(cf.ctx, client);
  }
  return client;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function nodeClient(): PrismaClient {
  globalForPrisma.prisma ??= createPrisma();
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const cf = cloudflareContext();
    const client = cf ? workerClient(cf) : nodeClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

/**
 * What repositories take as their database handle: the client itself or the
 * `tx` of an open transaction, so a service can run several repo calls atomically.
 */
export type Db = Prisma.TransactionClient;
