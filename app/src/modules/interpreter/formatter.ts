/**
 * Line-based autoformatter (re-indenter) for IGCSE / A Level pseudocode.
 *
 * It only ever rewrites the *leading* whitespace of each line and trims trailing
 * whitespace — it never touches the content of a line. That is deliberate: the language
 * has tokens that are fragile under reformatting (DATE_LITERAL `14/03/2025`, pointer
 * deref `p^` vs power `^`, char/string literals, the optional THEN/DO keywords, and
 * single-line multi-assignment `x <- 1, y <- 2`). By restricting ourselves to
 * indentation we cannot corrupt any of them, comments survive verbatim (the lexer would
 * otherwise discard them), and the formatter still works on incomplete/broken code.
 */

import { CLOSERS, DEFAULT_INDENT, INTERMEDIATES, leadingKeyword, opensBlock } from './indentRules';

export interface FormatOptions {
  /** String used for a single indent level. Defaults to four spaces. */
  indent?: string;
}

/**
 * Re-indent pseudocode by block depth. Only leading/trailing whitespace changes; line
 * content (including comments) is preserved exactly.
 *
 * Note on CASE: `CASE OF` indents its body once; labels (including `OTHERWISE :`) and
 * `ENDCASE` sit at that single level. This is exactly right for the common inline style
 * (`1 : OUTPUT "a"`). Multi-line case-label bodies won't gain an extra indent level —
 * an accepted simplification that never corrupts code.
 */
export function formatPseudocode(source: string, opts: FormatOptions = {}): string {
  const indent = opts.indent ?? DEFAULT_INDENT;
  const out: string[] = [];
  let level = 0;

  for (const raw of source.split('\n')) {
    // Strip a trailing \r (CRLF input) before trimming.
    const trimmed = raw.replace(/\r$/, '').trim();

    if (trimmed === '') {
      out.push('');
      continue;
    }

    // Comment lines never affect indentation (and `// ENDIF` must not read as ENDIF).
    if (trimmed.startsWith('//')) {
      out.push(indent.repeat(level) + trimmed);
      continue;
    }

    const keyword = leadingKeyword(trimmed);

    if (CLOSERS.has(keyword)) {
      level = Math.max(0, level - 1);
      out.push(indent.repeat(level) + trimmed);
    } else if (INTERMEDIATES.has(keyword)) {
      out.push(indent.repeat(Math.max(0, level - 1)) + trimmed);
    } else {
      out.push(indent.repeat(level) + trimmed);
      if (opensBlock(trimmed, keyword)) level++;
    }
  }

  // split('\n') / join('\n') round-trips newline count, so trailing newlines and blank
  // lines are preserved as the user had them.
  return out.join('\n');
}
