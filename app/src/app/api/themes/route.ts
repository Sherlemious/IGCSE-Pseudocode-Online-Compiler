import { conflict, unprocessable } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { requireUser } from '@/modules/auth/guards';
import { MAX_NAME_LEN, MAX_THEMES, parseCustomColors, parseThemeName } from '@/theme/validation';
import { countThemes, createTheme, listThemes } from '@/theme/repo';

/** Parses a stored theme; null when its colours no longer validate. */
function serialize(row: { id: string; name: string; colors: string }) {
  const colors = parseCustomColors(JSON.parse(row.colors) as unknown);
  return colors ? { id: row.id, name: row.name, colors } : null;
}

/** The current user's saved custom themes. */
export const GET = route(async () => {
  const user = await requireUser();
  const themes = (await listThemes(user.id)).map(serialize).filter((t) => t !== null);
  return { themes };
});

/** Save a new custom theme. */
export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await readJson(req);
  const name = parseThemeName(body.name);
  const colors = parseCustomColors(body.colors);
  if (!name) throw unprocessable(`Name must be 1–${MAX_NAME_LEN} characters`);
  if (!colors) throw unprocessable('Invalid theme colours');
  if ((await countThemes(user.id)) >= MAX_THEMES) throw conflict(`You can store at most ${MAX_THEMES} themes`);
  const created = await createTheme(user.id, name, JSON.stringify(colors));
  return { theme: { id: created.id, name: created.name, colors } };
});
