/** Debounce for local editor autosave (ms). */
export const AUTOSAVE_DELAY = 500;

/**
 * Debounce for signed-in playground snapshots on Neon.
 * LocalStorage stays on AUTOSAVE_DELAY; the cloud copy is coalesced so
 * typing does not keep compute awake (Neon bills CU-hours while the
 * endpoint is not scaled to zero).
 *
 * Kept just under Neon's 5-minute scale-to-zero window so an idle editor's
 * save lands on a compute that is still awake from the session's earlier
 * reads rather than waking a suspended one. Leaving or hiding the tab
 * flushes immediately, so this timer is only a crash safety net — and
 * localStorage already holds the same code on this device.
 */
export const CLOUD_AUTOSAVE_DELAY = 240_000;

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
