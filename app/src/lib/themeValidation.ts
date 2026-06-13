import {
  DEFAULT_CUSTOM_COLORS,
  type CustomColorKey,
  type CustomColors,
} from '../theme/themes';

/** Maximum number of custom themes a single user may store. */
export const MAX_THEMES = 30;
/** Maximum length of a custom theme name. */
export const MAX_NAME_LEN = 40;

/** The 13 editable colour keys, derived from the canonical defaults. */
export const CUSTOM_COLOR_KEYS = Object.keys(DEFAULT_CUSTOM_COLORS) as CustomColorKey[];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Validates and normalises an arbitrary value into a complete CustomColors
 * object. Every editable key must be present and a valid 6-digit hex colour.
 * Returns `null` if anything is missing or malformed.
 */
export function parseCustomColors(input: unknown): CustomColors | null {
  if (typeof input !== 'object' || input === null) return null;
  const source = input as Record<string, unknown>;
  const result = {} as CustomColors;

  for (const key of CUSTOM_COLOR_KEYS) {
    const value = source[key];
    if (typeof value !== 'string' || !HEX_RE.test(value)) return null;
    result[key] = value;
  }

  return result;
}

/**
 * Validates a theme name. Returns the trimmed name, or `null` if it is empty
 * or exceeds the maximum length.
 */
export function parseThemeName(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LEN) return null;
  return trimmed;
}
