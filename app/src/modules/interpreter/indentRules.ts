/**
 * Block-structure rules shared by the formatter (`formatter.ts`) and the editor's
 * auto-indent (`pseudocode-lang.ts`), so Enter, typing a closer and Shift+Alt+F agree.
 * Every check looks at a single trimmed line's leading keyword only.
 */

export const DEFAULT_INDENT = '    '; // four spaces

/** Keywords that close a block: dedent this line, and stay dedented. */
export const CLOSERS = new Set([
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
export const INTERMEDIATES = new Set(['ELSE', 'ELSEIF']);

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
export function leadingKeyword(trimmed: string): string {
  const words = trimmed.split(/\s+/);
  let kw = (words[0] ?? '').toUpperCase();
  if ((kw === 'PUBLIC' || kw === 'PRIVATE') && words[1]) {
    const second = words[1].toUpperCase();
    if (second === 'PROCEDURE' || second === 'FUNCTION') kw = second;
  }
  return kw;
}

/** True if a trimmed line opens an indented block. */
export function opensBlock(trimmed: string, keyword: string = leadingKeyword(trimmed)): boolean {
  if (OPENERS.has(keyword)) return true;
  if (keyword === 'TYPE') return TYPE_HEADER.test(trimmed);
  if (keyword === 'CLASS') return CLASS_HEADER.test(trimmed);
  return false;
}

/** True if a trimmed line sits one level out from the body above it (closer or ELSE). */
export function dedentsSelf(trimmed: string): boolean {
  const kw = leadingKeyword(trimmed);
  return CLOSERS.has(kw) || INTERMEDIATES.has(kw);
}

/** True if the lines after this trimmed line belong one level deeper (opener or ELSE). */
export function indentsNext(trimmed: string): boolean {
  const kw = leadingKeyword(trimmed);
  return INTERMEDIATES.has(kw) || opensBlock(trimmed, kw);
}
