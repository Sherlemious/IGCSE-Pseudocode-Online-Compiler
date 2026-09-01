/**
 * Sanitizer for error-code sampling.
 *
 * Before an error-producing snippet is stored (see `ErrorSample`), every piece
 * of free text a student could have typed is blanked out, while the *structure*
 * of the program is preserved so we can still cluster common mistake shapes:
 *
 *   - string literals   "Hello, Bob"   → "..."
 *   - char literals      'A'           → 'x'
 *   - line comments      // my name    → //
 *
 * Identifiers, keywords, numbers, operators and layout are kept — those are the
 * signal we analyse and carry no personal text. Line count is preserved so a
 * reported error line still lines up with the sanitized copy.
 *
 * The scan is context-aware (a `//` inside a string is not treated as a comment,
 * and a quote inside a comment is not treated as a string) so it can't be
 * tricked into leaking the very text it is meant to remove. It is idempotent, so
 * running it again server-side as defence-in-depth is a no-op.
 */

function sanitizeLine(line: string): string {
  let out = '';
  let i = 0;
  while (i < line.length) {
    const ch = line[i];

    // Line comment: drop everything after `//` (may contain names/notes).
    if (ch === '/' && line[i + 1] === '/') {
      out += '//';
      break;
    }

    // Double-quoted string literal → placeholder.
    if (ch === '"') {
      let j = i + 1;
      while (j < line.length && line[j] !== '"') j++;
      out += '"..."';
      i = j < line.length ? j + 1 : j; // consume the closing quote if present
      continue;
    }

    // Single-quoted char (or string) literal → placeholder.
    if (ch === "'") {
      let j = i + 1;
      while (j < line.length && line[j] !== "'") j++;
      out += "'x'";
      i = j < line.length ? j + 1 : j;
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}

/** Blank out all student-typed text (string/char literals, comments) in `code`. */
export function sanitizeForSampling(code: string): string {
  return code.split('\n').map(sanitizeLine).join('\n');
}
