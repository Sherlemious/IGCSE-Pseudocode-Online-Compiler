/**
 * Pre-parse source normalization (error-helpers "v2" experiment).
 *
 * Students very often paste pseudocode out of Word, Google Docs, PDFs or chat
 * apps, which silently injects characters the lexer cannot recognise:
 * "smart"/curly quotes, non-breaking and other exotic spaces, and zero-width or
 * invisible control characters. Each one produces a `token recognition error`
 * that has nothing to do with the student's actual logic - and PostHog shows
 * these (curly quotes, the braille-blank U+2800, etc.) among the very top parse
 * errors. Normalising them away before ANTLR ever sees the source removes a
 * large share of real-world parse failures.
 *
 * Every replacement is length-preserving *per line* - 1:1 character swaps, or
 * removals that never span a newline - so ANTLR line numbers stay aligned with
 * the editor and the error-line markers keep pointing at the right row.
 *
 * The character sets are declared as numeric code points (not literal glyphs)
 * so this file stays pure-ASCII and diff-reviewable.
 */

/** Build a `/[...]/g` regex whose class is exactly the given code points. */
function classOf(codePoints: number[]): RegExp {
  const cls = codePoints.map((c) => '\\u' + c.toString(16).padStart(4, '0')).join('');
  return new RegExp('[' + cls + ']', 'g');
}

// Curly / typographic DOUBLE quotes -> straight "
const SMART_DOUBLE = classOf([0x201c, 0x201d, 0x201e, 0x201f, 0x2033, 0x275d, 0x275e, 0x301d, 0x301e, 0xff02]);
// Curly / typographic SINGLE quotes -> straight '
const SMART_SINGLE = classOf([0x2018, 0x2019, 0x201a, 0x201b, 0x2032, 0x275b, 0x275c, 0xff07]);
// Exotic spaces: NBSP, Ogham, en/em/thin family, narrow/medium NBSP,
// braille blank (U+2800), ideographic space -> a normal space
const WEIRD_SPACE = classOf([
  0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
  0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x2800, 0x3000,
]);
// Zero-width space/joiners, word-joiner, BOM -> removed entirely
const ZERO_WIDTH = classOf([0x200b, 0x200c, 0x200d, 0x2060, 0xfeff]);

export interface NormalizeResult {
  /** The cleaned source. */
  code: string;
  /** Whether anything was changed. */
  changed: boolean;
  /** Stable slugs describing what was fixed (for analytics). */
  fixes: string[];
}

/**
 * Clean paste artefacts out of `src`. Pure and side-effect free.
 * Uses `.replace` (which resets regex lastIndex) rather than `.test` to avoid
 * the stateful-`/g`-regex pitfall.
 */
export function normalizeSource(src: string): NormalizeResult {
  const fixes: string[] = [];

  const afterQuotes = src.replace(SMART_DOUBLE, '"').replace(SMART_SINGLE, "'");
  if (afterQuotes !== src) fixes.push('smart_quotes');

  const afterInvisible = afterQuotes.replace(ZERO_WIDTH, '').replace(WEIRD_SPACE, ' ');
  if (afterInvisible !== afterQuotes) fixes.push('invisible_chars');

  return { code: afterInvisible, changed: afterInvisible !== src, fixes };
}
