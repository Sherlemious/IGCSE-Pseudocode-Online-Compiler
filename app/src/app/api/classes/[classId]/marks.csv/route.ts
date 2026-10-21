import { route } from '@/shared/http/route';
import { requireUser } from '@/modules/auth/guards';
import { buildClassMarksCsv } from '@/modules/classes/service';

function contentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]+/g, '_').replace(/["\\]/g, '_');
  const encoded = encodeURIComponent(filename).replace(
    /['()*]/g,
    (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

/** Owner-only CSV. `route()` passes this Response through; free tier throws 403 PLAN_REQUIRED. */
export const GET = route(async (_req, { params }: RouteContext<'/api/classes/[classId]/marks.csv'>) => {
  const user = await requireUser();
  const { classId } = await params;
  const { body, filename } = await buildClassMarksCsv(classId, user.id);
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': contentDisposition(filename),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});
