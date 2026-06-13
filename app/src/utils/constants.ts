/**
 * Storage keys and configuration constants
 */

/** Key for autosave functionality */
export const AUTOSAVE_KEY = 'pseudocode_autosave';

/** Prefix for stored file names */
export const FILE_PREFIX = 'pseudocode_file_';

/** Autosave delay in milliseconds */
export const AUTOSAVE_DELAY = 500;

/** Key for onboarding completion */
export const ONBOARDING_KEY = 'pseudocode_has_onboarded';

/** Split-pane size persistence (percentages) */
export const SPLIT_COMPILER_KEY = 'pseudocode-split-compiler';
export const SPLIT_PRACTICE_KEY = 'pseudocode-split-practice';
export const SPLIT_VARS_KEY = 'pseudocode-split-vars';

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
