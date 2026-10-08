import { badRequest, notFound, unprocessable } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { MAX_NAME_LEN, parseCustomColors, parseThemeName } from '@/theme/validation';
import { deleteTheme, findOwnedTheme, updateTheme } from '@/theme/repo';

type Ctx = RouteContext<'/api/themes/[id]'>;

async function requireOwnedTheme(id: string, userId: string) {
  if (!(await findOwnedTheme(id, userId))) throw notFound('Theme not found');
}

/** Rename and/or recolour a theme you own. */
export const PATCH = route(async (req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  await requireOwnedTheme(id, user.id);
  const body = await readJson(req);

  const data: { name?: string; colors?: string } = {};
  if (body.name !== undefined) {
    const name = parseThemeName(body.name);
    if (!name) throw unprocessable(`Name must be 1–${MAX_NAME_LEN} characters`);
    data.name = name;
  }
  if (body.colors !== undefined) {
    const colors = parseCustomColors(body.colors);
    if (!colors) throw unprocessable('Invalid theme colours');
    data.colors = JSON.stringify(colors);
  }
  if (data.name === undefined && data.colors === undefined) throw badRequest('Nothing to update');

  const updated = await updateTheme(id, data);
  return {
    theme: { id: updated.id, name: updated.name, colors: parseCustomColors(JSON.parse(updated.colors) as unknown) },
  };
});

export const DELETE = route(async (_req, { params }: Ctx) => {
  const user = await requireUser();
  const { id } = await params;
  await requireOwnedTheme(id, user.id);
  await deleteTheme(id);
  return { ok: true };
});
