/** Max stored playground program size (characters). */
export const MAX_PLAYGROUND_CODE_CHARS = 200_000;

export function parsePlaygroundCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length > MAX_PLAYGROUND_CODE_CHARS) return null;
  return value;
}

export async function fetchPlaygroundSnapshot(): Promise<string | null> {
  try {
    const res = await fetch('/api/playground');
    if (!res.ok) return null;
    const data = (await res.json()) as { code?: unknown };
    return typeof data.code === 'string' ? data.code : null;
  } catch {
    return null;
  }
}

export async function putPlaygroundSnapshot(code: string): Promise<void> {
  if (code.length > MAX_PLAYGROUND_CODE_CHARS) return;
  try {
    await fetch('/api/playground', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  } catch {
    /* ignore — localStorage is the source of truth on this device */
  }
}
