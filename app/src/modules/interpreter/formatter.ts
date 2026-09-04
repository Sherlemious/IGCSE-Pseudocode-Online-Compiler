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

const DEFAULT_INDENT = '    '; // four spaces

/** Keywords that close a block: dedent this line, and stay dedented. */
const CLOSERS = new Set([
  'ENDIF',
  'ENDWHILE',
  'ENDFUNCTION',
  'ENDPROCEDURE',
  'ENDCASE',
  'ENDTYPE',
  'ENDCLASS',
  'NEXT',
  'UNTIL',
]);

/** Keywords that continue a block: this line sits one level out, the body stays in. */
const INTERMEDIATES = new Set(['ELSE', 'ELSEIF']);

/** Keywords that open a block: the following lines indent one level deeper. */
const OPENERS = new Set(['IF', 'CASE', 'FOR', 'WHILE', 'REPEAT', 'PROCEDURE', 'FUNCTION']);

// `TYPE` and `CLASS` are soft keywords (usable as variable names), and `TYPE x = ...`
// (enum / pointer / set) is a single-line definition with no ENDTYPE. So only treat them
// as block openers when the line looks like a genuine record / class header.
const TYPE_HEADER = /^TYPE\s+\w+\s*$/i;
const CLASS_HEADER = /^CLASS\s+\w+(\s+INHERITS\s+\w+)?\s*$/i;

/**
 * The keyword that determines a line's indentation behaviour: the first word, except a
 * leading PUBLIC/PRIVATE access modifier is skipped when it precedes PROCEDURE/FUNCTION
 * (A Level methods) so `PUBLIC PROCEDURE Foo()` still opens a block.
 */
function leadingKeyword(trimmed: string): string {
  const words = trimmed.split(/\s+/);
  let kw = (words[0] ?? '').toUpperCase();
  if ((kw === 'PUBLIC' || kw === 'PRIVATE') && words[1]) {
    const second = words[1].toUpperCase();
    if (second === 'PROCEDURE' || second === 'FUNCTION') kw = second;
  }
  return kw;
}

/** True if a trimmed line opens an indented block. */
function opensBlock(trimmed: string, keyword: string): boolean {
  if (OPENERS.has(keyword)) return true;
  if (keyword === 'TYPE') return TYPE_HEADER.test(trimmed);
  if (keyword === 'CLASS') return CLASS_HEADER.test(trimmed);
  return false;
}

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
