import { NextResponse } from 'next/server';
import { logger } from '@/shared/lib/logger';
import { HttpError } from './errors';

/**
 * Wraps a route handler so it only has to return data or throw.
 *
 *   export const POST = route(async (req, { params }: RouteContext<'/api/x/[id]'>) => {
 *     const user = await requireUser();
 *     const body = await readJson(req);
 *     return service.doThing(user.id, ...);          // → 200 JSON
 *   });
 *
 * - A returned `Response` is passed through (redirects, custom headers).
 * - Any other return value becomes a 200 JSON body.
 * - `HttpError` becomes `{ error, code?, ...extra }` with its status.
 * - Anything else is logged and becomes a generic 500, so stack traces and
 *   Prisma messages never reach the client.
 */
export function route<Ctx = unknown>(
  handler: (req: Request, ctx: Ctx) => Promise<unknown>,
): (req: Request, ctx?: Ctx) => Promise<Response> {
  return async (req, ctx) => {
    try {
      // Next always passes the context; it is optional only so tests can omit it.
      const result = await handler(req, ctx as Ctx);
      return result instanceof Response ? result : NextResponse.json(result ?? { ok: true });
    } catch (error) {
      return errorResponse(error, req);
    }
  };
}

export function errorResponse(error: unknown, req?: Request): Response {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message, ...(error.code ? { code: error.code } : {}), ...error.extra?.body },
      { status: error.status, headers: error.extra?.headers },
    );
  }
  logger.error('Unhandled route error', {
    path: req ? new URL(req.url).pathname : undefined,
    method: req?.method,
    error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
  });
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}
