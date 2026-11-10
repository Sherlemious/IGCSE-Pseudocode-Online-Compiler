/**
 * The last playground error, remembered so a later success can offer the
 * practice question for that mistake. The interpreter must not import practice;
 * this only stores the hint id. Cleared nowhere: a success is when it is read.
 */

const KEY = 'playground_last_mistake';

export interface PlaygroundMistake {
  hintId: string;
  detail: string | null;
}

export function rememberPlaygroundMistake(hintId: string, detail: string | null): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ hintId, detail }));
  } catch {
    /* private mode */
  }
}

export function readPlaygroundMistake(): PlaygroundMistake | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { hintId?: unknown; detail?: unknown };
    if (typeof parsed.hintId !== 'string' || parsed.hintId.length === 0) return null;
    return {
      hintId: parsed.hintId,
      detail: typeof parsed.detail === 'string' ? parsed.detail : null,
    };
  } catch {
    return null;
  }
}
