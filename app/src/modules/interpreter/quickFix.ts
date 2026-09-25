/**
 * One-click fixes for parse errors.
 *
 * Each candidate is a small, mechanical edit to the flagged line (or a missing
 * closer after an unclosed block). A candidate is only offered after the program
 * is re-parsed with it applied: the fix must clear every error up to the flagged
 * line. A wrong guess is therefore dropped rather than shown to a student.
 */
import { parse } from './parser';
import { nearestKeyword, resolveOffendingLine } from './errorMessages';
import { BUILTIN_SIGNATURES } from './builtinSignatures';

export interface QuickFix {
  /** Stable slug of the transform, for analytics. */
  id: string;
  /** Short button text, e.g. "Change to: ENDIF". */
  label: string;
  /** 1-based line the edit applies to. */
  line: number;
  /**
   * replace: swap the line for `text` (which may span several lines);
   * insert_after: add `text` as new line(s) after `line`; delete: remove the line.
   */
  kind: 'replace' | 'insert_after' | 'delete';
  text: string;
  /** The line as it was when the fix was computed — the fix is stale once it changes. */
  original: string;
}

/** The fix as a single text change (character offsets into `source`). */
export function quickFixChange(
  source: string,
  fix: QuickFix,
): { from: number; to: number; insert: string } | null {
  const lines = source.split('\n');
  const i = fix.line - 1;
  if (i < 0 || i >= lines.length) return null;
  let from = 0;
  for (let k = 0; k < i; k++) from += lines[k].length + 1;
  const to = from + lines[i].length;
  if (fix.kind === 'replace') return { from, to, insert: fix.text };
  if (fix.kind === 'insert_after') return { from: to, to, insert: `\n${fix.text}` };
  // delete: take the line with its newline (the preceding one on the last line)
  if (i < lines.length - 1) return { from, to: to + 1, insert: '' };
  return { from: Math.max(0, from - 1), to, insert: '' };
}

export function applyQuickFix(source: string, fix: QuickFix): string {
  const c = quickFixChange(source, fix);
  return c ? source.slice(0, c.from) + c.insert + source.slice(c.to) : source;
}

// ── helpers ──────────────────────────────────────────────────────────────────

const indentOf = (s: string) => s.match(/^\s*/)![0];

/** Split a line into code and a trailing `// comment` (ignoring // inside strings). */
function splitComment(line: string): [string, string] {
  let inStr = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inStr = !inStr;
    else if (!inStr && ch === '/' && line[i + 1] === '/') return [line.slice(0, i), line.slice(i)];
  }
  return [line, ''];
}

/** Apply `fn` to the code outside "double-quoted strings". */
function outsideStrings(code: string, fn: (s: string) => string): string {
  return code
    .split(/("[^"\n]*")/)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('');
}

function clip(s: string, max = 48): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/** Other languages' output commands (print is PRINT, which is valid). */
const OUTPUT_SYNONYMS = '(?:DISPLAY|SHOW|PRINTLN|WRITELN|WRITE|PUTS|ECHO|PRINTF|COUT)';
const DATA_TYPE ='(?:INTEGER|REAL|STRING|CHAR|BOOLEAN|DATE|ARRAY\\b.*)';
const ID = '[A-Za-z_]\\w*';

/** Nearest `FOR <var>` above a line, for turning ENDFOR into NEXT <var>. */
function forVarAbove(lines: string[], line: number): string | null {
  for (let i = line - 2; i >= 0; i--) {
    const m = lines[i].match(/^\s*FOR\s+([A-Za-z_]\w*)/i);
    if (m) return m[1];
  }
  return null;
}

/** OUTPUT "Total is " Total → OUTPUT "Total is ", Total */
function addOutputCommas(code: string): string {
  const m = code.match(/^(OUTPUT|PRINT)(\s+)(.*)$/i);
  if (!m) return code;
  const strings: string[] = [];
  let items = m[3].replace(/"[^"]*"/g, (s) => {
    strings.push(s);
    return '\u0001';
  });
  items = items
    .replace(/\u0001\s*(?=[A-Za-z0-9_\u0001(])/g, '\u0001, ')
    .replace(/([A-Za-z0-9_)\]])\s*\u0001/g, '$1, \u0001');
  let k = 0;
  return `${m[1]}${m[2]}${items.replace(/\u0001/g, () => strings[k++])}`;
}

// ── candidates ───────────────────────────────────────────────────────────────

const BLOCKS: { kind: string; closer: string }[] = [
  { kind: 'IF', closer: 'ENDIF' },
  { kind: 'FOR', closer: 'NEXT' },
  { kind: 'WHILE', closer: 'ENDWHILE' },
  { kind: 'CASE', closer: 'ENDCASE' },
  { kind: 'PROCEDURE', closer: 'ENDPROCEDURE' },
  { kind: 'FUNCTION', closer: 'ENDFUNCTION' },
];

const codeOf = (line: string) => splitComment(line.replace(/"[^"]*"/g, '""'))[0].trim();

/**
 * A block left open at the end of the program: add its closer after the block's
 * indented body (or after the last line when nothing is indented).
 */
function unclosedBlockFix(lines: string[], flagged: number): QuickFix | null {
  const code = lines.map(codeOf);
  const lastCode = code.reduce((last, c, i) => (c ? i + 1 : last), 0);
  if (flagged < lastCode) return null;

  const open: { kind: string; closer: string; line: number }[] = [];
  const closed: { opened: number; closed: number }[] = [];
  code.forEach((c, i) => {
    for (const b of BLOCKS) {
      if (new RegExp(`^${b.kind}\\b`, 'i').test(c)) {
        if (!new RegExp(`\\b${b.closer}\\b`, 'i').test(c)) open.push({ ...b, line: i + 1 });
      } else if (new RegExp(`^${b.closer}\\b`, 'i').test(c)) {
        const idx = open.map((o) => o.kind).lastIndexOf(b.kind);
        if (idx >= 0) closed.push({ opened: open.splice(idx, 1)[0].line, closed: i + 1 });
      }
    }
  });
  const block = open[open.length - 1];
  if (!block) return null;

  // The body runs at least to the last closer of a block opened inside it (so an
  // unindented statement between them stays inside), then on through any lines
  // indented deeper than the opener.
  const lastInner = Math.max(0, ...closed.filter((p) => p.opened > block.line).map((p) => p.closed));
  const openerIndent = indentOf(lines[block.line - 1]).length;
  let after = lastInner;
  for (let i = Math.max(block.line, lastInner); i < lines.length; i++) {
    if (!code[i]) continue;
    if (indentOf(lines[i]).length > openerIndent) after = i + 1;
    else break;
  }
  if (!after) {
    // Nothing indented: the block runs to the end, which is only a safe guess for
    // IF / loops (a PROCEDURE would swallow the main program).
    if (block.kind === 'PROCEDURE' || block.kind === 'FUNCTION') return null;
    after = lastCode;
  }
  if (after <= block.line) return null;

  const closer =
    block.kind === 'FOR'
      ? `NEXT ${lines[block.line - 1].match(/^\s*FOR\s+([A-Za-z_]\w*)/i)?.[1] ?? ''}`.trim()
      : block.closer;
  return {
    id: `add_${block.closer.toLowerCase()}`,
    label: `Add ${closer} to close the ${block.kind} on line ${block.line}`,
    line: after,
    kind: 'insert_after',
    text: `${' '.repeat(openerIndent)}${closer}`,
    original: lines[after - 1],
  };
}

function* candidates(lines: string[], flagged: number): Generator<QuickFix> {
  const raw = lines[flagged - 1] ?? '';
  const indent = indentOf(raw);
  const [codePart, comment] = splitComment(raw.slice(indent.length));
  const code = codePart.trimEnd();
  const trailing = comment ? codePart.slice(code.length) + comment : '';

  const replace = (id: string, next: string): QuickFix | null =>
    next === code
      ? null
      : {
          id,
          label: `Change to: ${clip(next.split('\n')[0])}`,
          line: flagged,
          kind: 'replace',
          text: next
            .split('\n')
            .map((l, i, all) => indent + l + (i === all.length - 1 ? trailing : ''))
            .join('\n'),
          original: raw,
        };
  const remove = (id: string): QuickFix => ({
    id,
    label: 'Remove this line',
    line: flagged,
    kind: 'delete',
    text: '',
    original: raw,
  });

  function* yieldIf(fix: QuickFix | null) {
    if (fix) yield fix;
  }

  if (code) {
    // `END IF` → ENDIF; `ENDFOR` → NEXT i
    const spaced = code.match(/^END[\s-]+(IF|WHILE|CASE|FUNCTION|PROCEDURE|TYPE|CLASS)$/i);
    if (spaced) yield* yieldIf(replace('join_closer', `END${spaced[1].toUpperCase()}`));
    if (/^END[\s-]*FOR$/i.test(code)) {
      const v = forVarAbove(lines, flagged);
      if (v) yield* yieldIf(replace('endfor_to_next', `NEXT ${v}`));
    }

    // BASIC/Pascal wrappers and lone braces
    if (/^(?:BEGIN|START|STOP|END|ENDPROGRAM|END\s+PROGRAM|\{|\})$/i.test(code)) yield remove('remove_wrapper');

    // Pasted exam line numbers: `12  INPUT Mark`
    const numbered = code.match(/^\d+\s+([A-Za-z_].*)$/);
    if (numbered) yield* yieldIf(replace('strip_line_number', numbered[1]));

    // Python
    if (/^else\s*:$/i.test(code)) yield* yieldIf(replace('python_else', 'ELSE'));
    const elif = code.match(/^elif\s+(.+?)\s*:$/i);
    if (elif) yield* yieldIf(replace('python_elif', `ELSE IF ${elif[1]} THEN`));
    const pyIf = code.match(/^if\s+(.+?)\s*:$/i);
    if (pyIf && !/\bTHEN\b/i.test(code)) yield* yieldIf(replace('python_if', `IF ${pyIf[1]} THEN`));
    const pyWhile = code.match(/^while\s+(.+?)\s*:$/i);
    if (pyWhile && !/\bDO\b/i.test(code)) yield* yieldIf(replace('python_while', `WHILE ${pyWhile[1]} DO`));
    const pyPrint = code.match(/^print\s*\((.*)\)$/i);
    if (pyPrint && pyPrint[1].trim()) yield* yieldIf(replace('python_print', `OUTPUT ${pyPrint[1].trim()}`));
    // Output commands from other languages: DISPLAY("x") / println x → OUTPUT x
    const synonym = code.match(new RegExp(`^${OUTPUT_SYNONYMS}\\s*(?:\\((.*)\\)|\\s(.*))$`, 'i'));
    if (synonym && (synonym[1] ?? synonym[2])?.trim())
      yield* yieldIf(replace('output_synonym', `OUTPUT ${(synonym[1] ?? synonym[2]).trim()}`));

    // Operators from other languages (outside strings)
    const ops = outsideStrings(code, (s) =>
      s
        .replace(/!=/g, '<>')
        .replace(/==/g, '=')
        .replace(/\s*&&\s*/g, ' AND ')
        .replace(/\s*\|\|\s*/g, ' OR ')
        .replace(/\*\*/g, '^')
        .replace(/:=/g, '<-'),
    );
    yield* yieldIf(replace('operator_symbols', ops));

    // 'text' in single quotes → "text"
    const quoted = outsideStrings(code, (s) => s.replace(/'([^'\n]{2,})'/g, '"$1"'));
    yield* yieldIf(replace('single_to_double_quotes', quoted));

    // FOR i = 1 TO 10 / FOR i : 1 TO 10 / FOR i 1 TO 10 → FOR i <- 1 TO 10
    const forOp = code.match(new RegExp(`^FOR\\s+(${ID})\\s*(?::=|:|=)\\s*(.*)$`, 'i'));
    if (forOp) yield* yieldIf(replace('for_assignment', `FOR ${forOp[1]} <- ${forOp[2]}`));
    // Only a single start value before TO — `FOR robot ID = 1 TO 7` must not become
    // `FOR robot <- ID = 1 TO 7`, which parses but compares.
    const forNoOp = code.match(new RegExp(`^FOR\\s+(${ID})\\s+((?![Tt][Oo]\\b)[^<:=\\s]+\\s+TO\\b.*)$`, 'i'));
    if (forNoOp) yield* yieldIf(replace('for_assignment', `FOR ${forNoOp[1]} <- ${forNoOp[2]}`));
    // FOR … TO … DO / trailing colon
    if (/^FOR\b.*\bTO\b/i.test(code)) {
      const stripped = code.replace(/\s*(?:\bDO|:)\s*$/i, '');
      yield* yieldIf(replace('for_drop_do', stripped));
    }

    // FUNCTION F(…) RETURN INTEGER → RETURNS
    if (/^FUNCTION\b/i.test(code))
      yield* yieldIf(replace('returns_keyword', code.replace(/\bRETURN\b/i, 'RETURNS')));

    // IF without THEN / WHILE without DO
    if (/^(?:ELSE\s*)?IF\b/i.test(code) && !/\bTHEN\b/i.test(code))
      yield* yieldIf(replace('add_then', `${code.replace(/\s*:$/, '')} THEN`));
    if (/^WHILE\b/i.test(code) && !/\bDO\b/i.test(code))
      yield* yieldIf(replace('add_do', `${code.replace(/\s*(?:\bTHEN|:)$/i, '')} DO`));

    // ELSE Mark > 60 THEN → ELSE IF Mark > 60 THEN
    const elseCond = code.match(/^ELSE\s+(?!IF\b)(.+)$/i);
    if (elseCond && /<>|<=|>=|<|>|=/.test(elseCond[1]))
      yield* yieldIf(replace('else_if', `ELSE IF ${elseCond[1].replace(/\s*THEN$/i, '')} THEN`));

    // CASE x OF → CASE OF x
    const caseOf = code.match(/^CASE\s+(?!OF\b)(.+?)\s+OF$/i);
    if (caseOf) yield* yieldIf(replace('case_of_order', `CASE OF ${caseOf[1]}`));

    // DECLARE x INTEGER / DECLARE x AS INTEGER / DECLARE x = INTEGER → DECLARE x : INTEGER
    const decl = code.match(new RegExp(`^DECLARE\\s+(${ID})\\s*(?:\\bAS\\b|=)?\\s*(${DATA_TYPE})$`, 'i'));
    if (decl) yield* yieldIf(replace('declare_colon', `DECLARE ${decl[1]} : ${decl[2]}`));
    // DECLARE a, b, c : INTEGER → one DECLARE per variable
    const declList = code.match(new RegExp(`^DECLARE\\s+(${ID}(?:\\s*,\\s*${ID})+)\\s*:\\s*(.+)$`, 'i'));
    if (declList)
      yield* yieldIf(
        replace(
          'declare_split',
          declList[1]
            .split(',')
            .map((v) => `DECLARE ${v.trim()} : ${declList[2]}`)
            .join('\n'),
        ),
      );
    // ARRAY(1:5) / ARRAY[1,5] → ARRAY[1:5]
    if (/^DECLARE\b/i.test(code)) {
      const arr = code
        .replace(/ARRAY\s*\(([^)]*)\)/i, 'ARRAY[$1]')
        .replace(/ARRAY\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/i, 'ARRAY[$1:$2]');
      yield* yieldIf(replace('array_bounds', arr));
    }

    // SET x = 0 / SET x TO 0 → x <- 0
    const set = code.match(new RegExp(`^SET\\s+(${ID})\\s*(?:=|<-|←|\\bTO\\b)\\s*(.+)$`, 'i'));
    if (set) yield* yieldIf(replace('set_assignment', `${set[1]} <- ${set[2]}`));

    // x <- CALL F(a) → x <- F(a)
    yield* yieldIf(replace('call_in_expression', code.replace(/((?:<-|←|=|OUTPUT|PRINT|RETURN)\s*)CALL\s+/i, '$1')));
    // Stars(5) → CALL Stars(5)
    const bareCall = code.match(new RegExp(`^(${ID})\\s*\\(.*\\)$`));
    if (
      bareCall &&
      !BUILTIN_SIGNATURES[bareCall[1].toUpperCase()] &&
      !nearestKeyword(bareCall[1]) &&
      !new RegExp(`^${OUTPUT_SYNONYMS}$`, 'i').test(bareCall[1])
    )
      yield* yieldIf(replace('add_call', `CALL ${code}`));

    // INPUT "Enter age" Age → INPUT Age, "Enter age"
    const inputPrompt = code.match(new RegExp(`^INPUT\\s*("[^"]*")\\s*,?\\s*(${ID})$`, 'i'));
    if (inputPrompt) yield* yieldIf(replace('input_prompt_order', `INPUT ${inputPrompt[2]}, ${inputPrompt[1]}`));

    // OUTPUT "Total is " Total → OUTPUT "Total is ", Total
    yield* yieldIf(replace('output_comma', addOutputCommas(code)));

    // C/Java leftovers: trailing semicolon, # comments
    if (/;$/.test(code)) yield* yieldIf(replace('drop_semicolon', code.replace(/\s*;+$/, '')));
    const hash = outsideStrings(code, (s) => s.replace(/#/, '//'));
    yield* yieldIf(replace('hash_comment', hash));

    // Misspelled keyword at the start: OUPUT x → OUTPUT x
    const first = code.match(/^([A-Za-z]+)\b(.*)$/);
    if (first) {
      const kw = nearestKeyword(first[1]);
      if (kw && kw !== first[1].toUpperCase()) yield* yieldIf(replace('keyword_spelling', `${kw}${first[2]}`));
    }
  }

  // The error can be reported on the line *after* a bad IF / WHILE header.
  for (let i = flagged - 1, seen = 0; i >= 1 && seen < 2; i--) {
    const prev = lines[i - 1];
    const c = splitComment(prev.trim())[0].trimEnd();
    if (!c) continue;
    seen++;
    const prevIndent = indentOf(prev);
    const fixPrev = (id: string, next: string): QuickFix => ({
      id,
      label: `Line ${i}: change to ${clip(next)}`,
      line: i,
      kind: 'replace',
      text: prevIndent + next,
      original: prev,
    });
    if (/^(?:ELSE\s*)?IF\b/i.test(c) && !/\bTHEN\b/i.test(c)) yield fixPrev('add_then', `${c.replace(/\s*:$/, '')} THEN`);
    if (/^WHILE\b/i.test(c) && !/\bDO\b/i.test(c)) yield fixPrev('add_do', `${c.replace(/\s*(?:\bTHEN|:)$/i, '')} DO`);
  }

  // Block left open at the end of the program.
  const unclosed = unclosedBlockFix(lines, flagged);
  if (unclosed) yield unclosed;
}

// ── verification ─────────────────────────────────────────────────────────────

/** Map a line number in the fixed program back to the original program. */
function mapBack(r: number, fix: QuickFix, added: number): number {
  if (fix.kind === 'delete') return r < fix.line ? r : r + 1;
  // replace: lines line..line+added are the new text; insert_after: line+1..line+added.
  const lastTouched = fix.line + added;
  if (r <= fix.line) return r;
  if (r <= lastTouched) return fix.line;
  return r - added;
}

function verifies(lines: string[], fix: QuickFix, flagged: number): boolean {
  const source = lines.join('\n');
  const fixed = applyQuickFix(source, fix);
  if (fixed === source) return false;
  const { errors } = parse(fixed);
  if (errors.length === 0) return true;
  const fixedLines = fixed.split('\n');
  const added = fixedLines.length - lines.length;
  return errors.every((e) => {
    const r = resolveOffendingLine(fixedLines, e.line).line;
    return r != null && mapBack(r, fix, added) > flagged;
  });
}

/**
 * The first candidate fix that clears the error on `flaggedLine`, or null.
 * `source` must be the exact text that was parsed (after normalization).
 */
export function findQuickFix(source: string, flaggedLine: number | null | undefined): QuickFix | null {
  if (flaggedLine == null || flaggedLine < 1) return null;
  const lines = source.split('\n');
  if (flaggedLine > lines.length) return null;
  try {
    for (const fix of candidates(lines, flaggedLine)) {
      if (verifies(lines, fix, flaggedLine)) return fix;
    }
  } catch {
    // A fix is a nicety — never let it break error reporting.
  }
  return null;
}
