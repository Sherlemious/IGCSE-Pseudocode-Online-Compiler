/** Debounce for editor autosave (ms). */
export const AUTOSAVE_DELAY = 500;

/**
 * Read a persisted split-pane percentage, clamped to [min, max].
 * Falls back to `fallback` when unset or invalid.
 */
export function loadSplitPercent(key: string, fallback: number, min: number, max: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) return Math.max(min, Math.min(max, parsed));
    }
  } catch {
    /* ignore */
  }
  return fallback;
}
