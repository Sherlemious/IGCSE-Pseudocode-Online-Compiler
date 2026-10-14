/**
 * Context-aware diagnosis for the errors students stay stuck on longest:
 * undeclared variables, array indexes out of range, and stray ELSE / ENDIF.
 *
 * The plain messages in errorMessages.ts only see the error text. These also
 * see the program, so they can say *why* ("`Celcius` looks like `Celsius`",
 * "your loop goes to 6 but the array ends at 5", "the FOR on line 4 is still
 * open"). Every diagnosis carries a `detail` slug so analytics can tell which
 * explanation a student got, and whether it helped.
 */

export interface SourceContext {
  /** Every source line (normalized), 0-indexed. */
  lines: string[];
  /** 1-based line the error was reported on. */
  line: number | null | undefined;
}

/** A one-click edit; structurally the same as QuickFix in quickFix.ts. */
export interface DiagnosisFix {
  id: string;
  label: string;
  line: number;
  kind: 'replace';
  text: string;
  original: string;
}

export interface Diagnosis {
  message: string;
  /** Which explanation was given, e.g. `typo`, `off_by_one`, `inner_block_open`. */
  detail: string;
  fix?: DiagnosisFix;
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** Code on a line with string contents and comments removed. */
function codeOf(line: string): string {
  return line.replace(/"[^"]*"/g, '""').replace(/\/\/.*$/, '').trim();
}

/** Edit distance where swapping two neighbouring letters (`Nmae`) is one edit. */
function distance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
}

/** Replace a whole-word identifier outside string literals and field access. */
function renameIdentifier(line: string, from: string, to: string): string {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const word = new RegExp(`(?<![\\w.])${escaped}(?!\\w)`, 'g');
  return line
    .split(/("[^"]*")/)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(word, to)))
    .join('');
}

const NOT_VARIABLES = new Set([
  'INTEGER', 'REAL', 'STRING', 'CHAR', 'BOOLEAN', 'DATE', 'ARRAY', 'OF', 'TO', 'STEP', 'BYREF', 'BYVAL',
]);

interface Declared {
  name: string;
  /** 1-based line where the name first appears as a declaration or assignment. */
  line: number;
}

/** Every name the program introduces, with the first line that does it. */
function declaredNames(lines: string[]): Declared[] {
  const found = new Map<string, Declared>();
  const add = (name: string | undefined, line: number) => {
    if (!name || NOT_VARIABLES.has(name.toUpperCase())) return;
    if (!found.has(name)) found.set(name, { name, line });
  };
  lines.forEach((raw, i) => {
    const c = codeOf(raw);
    const n = i + 1;
    let m = c.match(/^DECLARE\s+(.+?)\s*:/i);
    if (m) m[1].split(',').forEach((part) => add(part.trim(), n));
    m = c.match(/^CONSTANT\s+([A-Za-z_]\w*)/i);
    if (m) add(m[1], n);
    m = c.match(/^FOR\s+([A-Za-z_]\w*)/i);
    if (m) add(m[1], n);
    m = c.match(/^INPUT\s+([A-Za-z_]\w*)/i);
    if (m) add(m[1], n);
    m = c.match(/^([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?\s*(?:<-|←)/);
    if (m) add(m[1], n);
    m = c.match(/^(?:PROCEDURE|FUNCTION)\s+\w+\s*\(([^)]*)\)/i);
    if (m)
      m[1].split(',').forEach((param) => {
        const name = param.replace(/\b(?:BYREF|BYVAL)\b/gi, '').split(':')[0].trim();
        if (/^[A-Za-z_]\w*$/.test(name)) add(name, n);
      });
  });
  return [...found.values()];
}

// ── undeclared variable ──────────────────────────────────────────────────────

export function diagnoseUndeclared(name: string, ctx: SourceContext | undefined): Diagnosis | null {
  if (!ctx || !ctx.line) return null;
  const errLine = ctx.line;
  const declared = declaredNames(ctx.lines);
  const original = ctx.lines[errLine - 1];
  const declareHelp = `  If it is a new variable, add this above its first use:  DECLARE ${name} : INTEGER`;

  const exact = declared.find((d) => d.name === name);
  if (exact && exact.line > errLine) {
    return {
      detail: 'declared_later',
      message:
        `'${name}' is used on line ${errLine} but only set up on line ${exact.line}.\n` +
        `  A variable must be DECLAREd (or given a value) before the line that reads it. Move line ${exact.line} above line ${errLine}.`,
    };
  }

  // Everything below is about a *different* spelling already in the program.
  const pool = declared.filter((d) => d.name !== name);
  const suggest = (target: Declared, detail: 'case_mismatch' | 'typo', explain: string): Diagnosis => {
    const text = original !== undefined ? renameIdentifier(original, name, target.name) : undefined;
    const fix: DiagnosisFix | undefined =
      text !== undefined && text !== original
        ? { id: `rename_${detail}`, label: `Change to: ${target.name}`, line: errLine, kind: 'replace', text, original }
        : undefined;
    return {
      detail,
      fix,
      message: `'${name}' has not been declared — did you mean '${target.name}'? ${explain}\n${declareHelp}`,
    };
  };

  const sameLetters = pool.filter((d) => d.name.toLowerCase() === name.toLowerCase());
  if (sameLetters.length === 1) {
    return suggest(
      sameLetters[0],
      'case_mismatch',
      `Variable names are case-sensitive, so '${name}' and '${sameLetters[0].name}' are different variables (declared on line ${sameLetters[0].line}).`,
    );
  }

  if (name.length >= 3) {
    const limit = name.length <= 4 ? 1 : 2;
    const scored = pool
      .map((d) => ({ d, dist: distance(name.toLowerCase(), d.name.toLowerCase()) }))
      .filter((s) => s.dist <= limit)
      .sort((a, b) => a.dist - b.dist);
    // Offer a suggestion only when one name is clearly the closest.
    if (scored.length && (scored.length === 1 || scored[1].dist > scored[0].dist)) {
      const best = scored[0].d;
      return suggest(best, 'typo', `It looks like a spelling slip (declared on line ${best.line}).`);
    }
  }
  return null;
}

// ── array index out of range ─────────────────────────────────────────────────

interface OpenFor {
  line: number;
  variable: string;
  bound: string;
}

/** The innermost FOR still open at `errLine`. */
function enclosingFor(lines: string[], errLine: number): OpenFor | null {
  const stack: OpenFor[] = [];
  for (let i = 0; i < errLine - 1 && i < lines.length; i++) {
    const c = codeOf(lines[i]);
    const m = c.match(/^FOR\s+([A-Za-z_]\w*)\s*(?:<-|←)\s*.+?\s+TO\s+(.+?)(?:\s+STEP\s+.+)?$/i);
    if (m) stack.push({ line: i + 1, variable: m[1], bound: m[2].trim() });
    else if (/^NEXT\b/i.test(c)) stack.pop();
  }
  return stack[stack.length - 1] ?? null;
}

export function diagnoseOutOfBounds(
  index: number,
  lo: number,
  hi: number,
  ctx: SourceContext | undefined,
): Diagnosis | null {
  const line = ctx?.line ? ctx.lines[ctx.line - 1] : undefined;
  const arrayName = line ? codeOf(line).match(/\b([A-Za-z_]\w*)\s*\[/)?.[1] : undefined;
  const subject = arrayName ? `\`${arrayName}[${index}]\`` : `Index ${index}`;
  const range = `${arrayName ? `\`${arrayName}\`` : 'This array'} runs from ${lo} to ${hi}`;
  const head = `${subject} is out of range — ${range}.`;

  if (index < lo) {
    const zeroBased = index === 0 && lo === 1;
    return {
      detail: zeroBased ? 'index_zero' : 'below_start',
      message:
        head +
        (zeroBased
          ? '\n  Cambridge arrays start at 1, not 0. Start your loop or index at 1.'
          : `\n  The first valid index is ${lo}.`),
    };
  }

  const loop = ctx?.line ? enclosingFor(ctx.lines, ctx.line) : null;
  const usesLoopVar = !!loop && !!line && new RegExp(`\\b${loop.variable}\\b`).test(codeOf(line));
  const extra = index - hi;
  const detail = extra === 1 ? 'off_by_one' : 'past_end';
  const loopTip =
    loop && usesLoopVar
      ? `\n  The loop on line ${loop.line} counts up to ${loop.bound}, so ${loop.variable} reaches ${index}. ` +
        `Make it stop at ${hi}: FOR ${loop.variable} <- ${lo} TO ${hi}`
      : extra === 1
        ? `\n  That is one past the end. Check the last index you use is ${hi}, not ${index}.`
        : `\n  Check the index you calculate — it must stay between ${lo} and ${hi}.`;
  return { detail: loop && usesLoopVar ? `${detail}_loop` : detail, message: head + loopTip };
}

// ── stray ELSE / ENDIF ───────────────────────────────────────────────────────

interface OpenBlock {
  kind: string;
  line: number;
  text: string;
  hasElse?: boolean;
}

const PAIRS: { kind: string; closer: string }[] = [
  { kind: 'IF', closer: 'ENDIF' },
  { kind: 'FOR', closer: 'NEXT' },
  { kind: 'WHILE', closer: 'ENDWHILE' },
  { kind: 'REPEAT', closer: 'UNTIL' },
  { kind: 'CASE', closer: 'ENDCASE' },
  { kind: 'PROCEDURE', closer: 'ENDPROCEDURE' },
  { kind: 'FUNCTION', closer: 'ENDFUNCTION' },
];

const starts = (code: string, word: string) => new RegExp(`^${word}\\b`, 'i').test(code);

const closerFor = (b: OpenBlock) =>
  b.kind === 'FOR'
    ? `NEXT ${b.text.match(/^FOR\s+([A-Za-z_]\w*)/i)?.[1] ?? 'i'}`
    : b.kind === 'REPEAT'
      ? 'UNTIL <condition>'
      : `END${b.kind}`;

/**
 * Why an ELSE or ENDIF has nothing to attach to, from the blocks open above it
 * and the ENDIF that last closed an IF.
 */
export function diagnoseStrayBlock(kind: 'ELSE' | 'ENDIF', ctx: SourceContext | undefined): Diagnosis | null {
  if (!ctx || !ctx.line) return null;
  const open: OpenBlock[] = [];
  let lastEndif = 0;
  for (let i = 0; i < ctx.line - 1 && i < ctx.lines.length; i++) {
    const c = codeOf(ctx.lines[i]);
    if (!c) continue;
    if (/^ELSE$/i.test(c)) {
      const top = open[open.length - 1];
      if (top?.kind === 'IF') top.hasElse = true;
      continue;
    }
    for (const p of PAIRS) {
      if (starts(c, p.kind)) {
        // `IF x THEN OUTPUT "a" ENDIF` opens and closes on one line.
        if (!new RegExp(`\\b${p.closer}\\b`, 'i').test(c)) open.push({ kind: p.kind, line: i + 1, text: c });
      } else if (starts(c, p.closer)) {
        const idx = open.map((o) => o.kind).lastIndexOf(p.kind);
        if (idx >= 0) open.splice(idx, 1);
        if (p.kind === 'IF') lastEndif = i + 1;
      }
    }
  }

  const word = kind;
  const innermostIf = [...open].reverse().find((b) => b.kind === 'IF');
  if (innermostIf) {
    const next = codeOf(ctx.lines[innermostIf.line] ?? '');
    if (!/\bTHEN\b/i.test(innermostIf.text) && !/^THEN\b/i.test(next)) {
      return {
        detail: 'missing_then',
        message:
          `The IF on line ${innermostIf.line} has no THEN, so ${word} has nothing to attach to.\n` +
          `  Put THEN at the end of that line:  ${innermostIf.text} THEN`,
      };
    }
    const top = open[open.length - 1];
    if (top !== innermostIf) {
      return {
        detail: 'inner_block_open',
        message:
          `${word} sits inside the ${top.kind} from line ${top.line}, which is not closed yet.\n` +
          `  Close that ${top.kind} first with ${closerFor(top)} (before the ${word}), so the ${word} belongs to the IF on line ${innermostIf.line}.`,
      };
    }
    if (kind === 'ELSE' && innermostIf.hasElse) {
      return {
        detail: 'second_else',
        message:
          `The IF on line ${innermostIf.line} already has an ELSE — an IF can only have one.\n` +
          `  For another case use ELSE IF <condition> THEN, or start a new IF.`,
      };
    }
  }

  if (!innermostIf && lastEndif) {
    return {
      detail: 'already_closed',
      message:
        kind === 'ELSE'
          ? `The IF was already closed by ENDIF on line ${lastEndif}, so this ELSE has no IF to belong to.\n` +
            `  ELSE goes before ENDIF, inside the same IF block. Move the ENDIF on line ${lastEndif} to after the ELSE part.`
          : `ENDIF on line ${lastEndif} already closed the IF, so this extra ENDIF has nothing to close.\n` +
            `  Delete this line, or check each IF … THEN has exactly one ENDIF.`,
    };
  }
  return null;
}
