import { unprocessable } from '@/shared/http/errors';
import { route } from '@/shared/http/route';
import { readJson } from '@/shared/http/input';
import { enforceRateLimit } from '@/shared/http/rateLimit';
import { requireUser } from '@/modules/auth/guards';
import { MAX_PLAYGROUND_CODE_CHARS, parsePlaygroundCode } from '@/modules/compiler/playgroundSnapshot';
import { findPlaygroundSnapshot, savePlaygroundSnapshot } from '@/modules/compiler/playgroundRepo';

/** The signed-in user's latest playground snapshot. */
export const GET = route(async () => {
  const user = await requireUser();
  const row = await findPlaygroundSnapshot(user.id);
  return { code: row?.code ?? null, updatedAt: row?.updatedAt ?? null };
});

/** Save the signed-in user's playground snapshot. */
export const PUT = route(async (req) => {
  const user = await requireUser();
  enforceRateLimit(`playground:${user.id}`, { limit: 40, windowMs: 60_000 },
    (s) => `Saving too fast. Please wait ${s}s.`);
  const code = parsePlaygroundCode((await readJson(req, 'Invalid JSON')).code);
  if (code === null) throw unprocessable(`Code must be a string of at most ${MAX_PLAYGROUND_CODE_CHARS} characters`);
  const row = await savePlaygroundSnapshot(user.id, code);
  return { ok: true, updatedAt: row.updatedAt };
});
