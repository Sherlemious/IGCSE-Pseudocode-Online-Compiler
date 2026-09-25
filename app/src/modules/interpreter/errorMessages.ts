/**
 * Converts raw ANTLR parse errors and runtime errors into constructive,
 * student-friendly messages with actionable suggestions.
 *
 * Raw messages are still sent to PostHog for analysis; this layer only
 * affects what the student sees in the terminal.
 */

import { BUILTIN_NAMES, BUILTIN_SIGNATURES } from './builtinSignatures';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Extract the offending token from ANTLR messages like: mismatched input 'X' expecting ... */
function extractToken(msg: string): string | null {
  const m = msg.match(/input '([^']+)'/);
  return m ? m[1] : null;
}

/** Remove escaped/real newlines that ANTLR sometimes includes in offending tokens. */
function cleanToken(token: string): string {
  return token
    .replace(/^(?:\\n|\r|\n|\s)+/g, '')
    .replace(/(?:\\n|\r|\n|\s)+$/g, '');
}

function isExpressionExpected(rawMessage: string): boolean {
  return rawMessage.includes('REAL_LITERAL')
    || rawMessage.includes('INTEGER_LITERAL')
    || rawMessage.includes('STRING_LITERAL')
    || rawMessage.includes('IDENTIFIER')
    || rawMessage.includes('{NOT');
}

function commonParseHint(rawMessage: string): string | null {
  if (rawMessage === "missing ']' at ','") {
    return (
      'Check the array brackets and dimensions around the comma.\n' +
      '  1D declaration: DECLARE Scores : ARRAY[1:10] OF INTEGER\n' +
      '  2D declaration: DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER\n' +
      '  2D access: Grid[row, col]\n' +
      '  Every `[` needs a matching `]`.'
    );
  }

  if (rawMessage.includes("extraneous input '<EOF>'") && rawMessage.includes('ENDIF')) {
    return (
      'Your IF block is not closed. Add ENDIF after the last statement in the block.\n' +
      '  Example:\n' +
      '    IF Score >= 50 THEN\n' +
      '      OUTPUT "Pass"\n' +
      '    ENDIF'
    );
  }

  // Catches a stray ELSE (snippet is just `ELSE`) and an IF / ELSEIF / ELSE IF
  // chain left unclosed (snippet runs past ELSE into more tokens because no ENDIF
  // closed the block). Both want the same fix: a complete IF … THEN … ENDIF.
  if (/no viable alternative at input '(?:\\n|\n)?ELSE/.test(rawMessage)) {
    return (
      'ELSE must belong to an open IF block, and the block must close with ENDIF.\n' +
      '  Example:\n' +
      '    IF Mark >= 50 THEN\n' +
      '      OUTPUT "Pass"\n' +
      '    ELSE IF Mark >= 40 THEN\n' +
      '      OUTPUT "Borderline"\n' +
      '    ELSE\n' +
      '      OUTPUT "Try again"\n' +
      '    ENDIF'
    );
  }

  if (rawMessage === "token recognition error at: '''") {
    return (
      'Use double quotes for STRING text, such as OUTPUT "Hello".\n' +
      "Single quotes are only for one CHAR, such as Letter <- 'A'."
    );
  }

  if (rawMessage.includes("missing ':' at 'OUTPUT'") || rawMessage.includes("missing ':' at 'INPUT'")) {
    return (
      'The previous DECLARE line is probably missing `: <type>`.\n' +
      '  Example:\n' +
      '    DECLARE Count : INTEGER\n' +
      '    OUTPUT Count'
    );
  }

  if (rawMessage.includes("mismatched input 'TO' expecting ':'")) {
    return (
      'TO is used in FOR loops. Declarations need a colon before the type.\n' +
      '  Declaration: DECLARE i : INTEGER\n' +
      '  Loop:        FOR i <- 1 TO 10'
    );
  }

  if (rawMessage.includes('missing STRING_LITERAL at')) {
    return (
      'INPUT prompts must be text in double quotes after the comma.\n' +
      '  Example:\n' +
      '    INPUT NumCustomers, "Enter number of customers"\n' +
      '  Or remove the comma and just write: INPUT NumCustomers'
    );
  }

  const missingAssignmentValue = rawMessage.match(/missing \{LARROW, '='\} at '([^']+)'/);
  if (missingAssignmentValue) {
    return (
      `A value like ${missingAssignmentValue[1]} needs a variable name and assignment operator before it.\n` +
      '  Example:\n' +
      `    Total <- ${missingAssignmentValue[1]}`
    );
  }

  return null;
}

/** Levenshtein distance — used to suggest the nearest keyword. */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

const SEE_DOCS = '\n  See the Docs tab for the full IGCSE syntax reference.';

const KEYWORDS = [
  'DECLARE', 'CONSTANT', 'IF', 'THEN', 'ELSE', 'ENDIF', 'CASE', 'OF',
  'OTHERWISE', 'ENDCASE', 'WHILE', 'DO', 'ENDWHILE', 'FOR', 'TO', 'STEP',
  'NEXT', 'REPEAT', 'UNTIL', 'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION',
  'RETURNS', 'ENDFUNCTION', 'RETURN', 'CALL', 'OUTPUT', 'PRINT', 'INPUT', 'AND',
  'OR', 'NOT', 'MOD', 'DIV', 'TRUE', 'FALSE', 'OPENFILE', 'READFILE',
  'WRITEFILE', 'CLOSEFILE', 'ARRAY', 'INTEGER', 'REAL', 'BOOLEAN', 'STRING', 'CHAR',
  // A Level (9618)
  'TYPE', 'ENDTYPE', 'SET', 'DEFINE', 'DATE', 'BYREF', 'BYVAL', 'RANDOM',
  'SEEK', 'GETRECORD', 'PUTRECORD', 'CLASS', 'ENDCLASS', 'INHERITS',
  'PUBLIC', 'PRIVATE', 'NEW', 'SUPER',
];

/** If `token` looks like a misspelled keyword, return the closest match. */
export function nearestKeyword(token: string): string | null {
  const upper = token.toUpperCase();
  // Wrong case of a real keyword (`endfunction` → ENDFUNCTION). An *exact*
  // match is not a typo — the keyword is just in the wrong place (stray closer).
  if (KEYWORDS.includes(upper)) return token === upper ? null : upper;
  // Near match: distance ≤ 2 for words of 5+ chars, ≤ 1 for 4-char words
  // (at distance 2 a variable like `Cost` would read as a typo of CASE).
  if (token.length > 3) {
    const maxDist = token.length === 4 ? 1 : 2;
    let best: string | null = null;
    let bestDist = Infinity;
    for (const kw of KEYWORDS) {
      const d = levenshtein(upper, kw);
      if (d < bestDist && d <= maxDist) { bestDist = d; best = kw; }
    }
    return best;
  }
  return null;
}

/** True when a message still contains ANTLR jargon students should never see. */
function isAntlrJargon(msg: string): boolean {
  return /no viable alternative|mismatched input|extraneous input|token recognition error|expecting \{/i.test(msg);
}

function genericParseFallback(sourceLine?: string): string {
  const snippet = sourceLine?.trim();
  const shown = snippet && snippet.length > 60 ? `${snippet.slice(0, 57)}…` : snippet;
  if (shown) {
    return (
      `This line isn't valid IGCSE pseudocode:\n  ${shown}\n` +
      `  Check spelling, put each statement on its own line, and close blocks with ENDIF, NEXT i, ENDWHILE, or ENDFUNCTION.` +
      SEE_DOCS
    );
  }
  return (
    `This line isn't valid IGCSE pseudocode.\n` +
    `  Check spelling, put each statement on its own line, and close blocks with ENDIF, NEXT i, ENDWHILE, or ENDFUNCTION.` +
    SEE_DOCS
  );
}

/**
 * Pick a source line with actual code for hint detectors and telemetry.
 * ANTLR often flags the blank newline *after* the mistake (`offending_line`
 * empty → detectors never run). Prefer that ANTLR line when it has text,
 * otherwise the editor cursor, otherwise walk backward.
 */
export function resolveOffendingLine(
  sourceLines: string[],
  antlrLine?: number | null,
  cursorLine?: number | null,
): { line: number | null; text: string | undefined } {
  const at = (n: number | null | undefined): string | undefined =>
    n != null && n >= 1 && n <= sourceLines.length ? sourceLines[n - 1] : undefined;

  const antlrText = at(antlrLine);
  if (antlrText?.trim()) return { line: antlrLine ?? null, text: antlrText };

  const cursorText = at(cursorLine);
  if (cursorText?.trim()) return { line: cursorLine ?? null, text: cursorText };

  const start = antlrLine ?? cursorLine;
  if (start != null) {
    const from = Math.min(Math.max(start, 1), sourceLines.length);
    for (let i = from; i >= 1; i--) {
      const t = sourceLines[i - 1];
      if (t?.trim()) return { line: i, text: t };
    }
  }
  return { line: antlrLine ?? cursorLine ?? null, text: antlrText ?? cursorText };
}

// ── Parse error humanization ────────────────────────────────────────────────

const SYNTAX_HINTS: Record<string, string> = {
  ENDIF:        'ENDIF — every IF block must close with ENDIF\n  Example:\n    IF condition THEN\n      ...\n    ENDIF',
  ENDWHILE:     'ENDWHILE — every WHILE loop must close with ENDWHILE\n  Example:\n    WHILE condition DO\n      ...\n    ENDWHILE',
  NEXT:         'NEXT — every FOR loop must close with NEXT <variable>\n  Example:\n    FOR i ← 1 TO 10\n      ...\n    NEXT i',
  UNTIL:        'UNTIL <condition> — every REPEAT loop must end with UNTIL\n  Example:\n    REPEAT\n      ...\n    UNTIL condition',
  ENDFUNCTION:  'ENDFUNCTION — close your FUNCTION block\n  Example:\n    FUNCTION name() RETURNS INTEGER\n      ...\n    ENDFUNCTION',
  ENDPROCEDURE: 'ENDPROCEDURE — close your PROCEDURE block\n  Example:\n    PROCEDURE name()\n      ...\n    ENDPROCEDURE',
  ENDCASE:      'ENDCASE — every CASE block must close with ENDCASE',
  ENDTYPE:      'ENDTYPE — every record TYPE must close with ENDTYPE\n  Example:\n    TYPE StudentRecord\n      DECLARE Name : STRING\n    ENDTYPE',
  ENDCLASS:     'ENDCLASS — every CLASS must close with ENDCLASS\n  Example:\n    CLASS Pet\n      PRIVATE Name : STRING\n    ENDCLASS',
  DO:           'DO after the WHILE condition\n  Example: WHILE x < 10 DO',
  ':':          'colon `:` — colons are used in DECLARE and CASE:\n  DECLARE x : INTEGER\n  DECLARE x : REAL\n  CASE clause →  value : action\n  Also check you\'re using ← (or <-) for assignment, not :=',
};

/** Non-standard tokens students often write by accident */
const WRONG_TOKENS: Record<string, string> = {
  console: 'Use OUTPUT or PRINT instead of "console.log"\n  Example: OUTPUT value',
  echo:    'Use OUTPUT or PRINT instead of "echo"\n  Example: OUTPUT "Hello"',
  log:     'Use OUTPUT or PRINT instead of "log"\n  Example: OUTPUT value',
  printf:  'Use OUTPUT or PRINT instead of "printf"\n  Example: OUTPUT "Hello"',
  var:     'Use DECLARE instead of "var"\n  Example: DECLARE x : INTEGER',
  let:     'Use DECLARE instead of "let"\n  Example: DECLARE x : INTEGER',
  const:   'Use CONSTANT instead of "const"\n  Example: CONSTANT PI = 3.14',
  def:     'Use PROCEDURE or FUNCTION instead of "def"',
  begin:   'No BEGIN needed — just write your statements directly',
  end:     'Use the specific closing keyword: ENDIF, ENDWHILE, ENDFUNCTION, etc.',
  loop:    'Use WHILE, FOR, or REPEAT instead of "loop"',
  ':=':    'Use ← (or <-) for assignment, not :=\n  Example: x ← 5',
  '(':     'Unexpected `(`.\n  To call a procedure: CALL name(args)\n  OUTPUT does not need brackets: OUTPUT value\n  If you meant to call a function here, check it is not a reserved word (e.g. ARRAY)',
};

/**
 * Portugol/VisualG keywords mapped to their IGCSE equivalents.
 * Keys are lowercase; values are the replacement hint.
 */
const PORTUGOL_TOKENS: Record<string, string> = {
  escreval:     'OUTPUT',
  escreva:      'OUTPUT',
  imprima:      'OUTPUT',
  leia:         'INPUT',
  se:           'IF ... THEN',
  entao:        'THEN',
  fimse:        'ENDIF',
  senao:        'ELSE',
  enquanto:     'WHILE ... DO',
  faca:         'DO',
  fimenquanto:  'ENDWHILE',
  para:         'FOR ... TO',
  fimpara:      'NEXT',
  repita:       'REPEAT',
  ate:          'UNTIL',
  inicio:       '(no BEGIN/INICIO — write statements directly)',
  algoritmo:    '(no header needed — write statements directly)',
  programa:     '(no header needed — write statements directly)',
  procedimento: 'PROCEDURE',
  funcao:       'FUNCTION',
  retorne:      'RETURN',
};

/** If the token (with or without a trailing `(`) is a Portugol keyword, return a hint. */
function portugolHint(token: string): string | null {
  const key = token.replace(/\($/, '').toLowerCase();
  const igcse = PORTUGOL_TOKENS[key];
  if (!igcse) return null;
  return (
    `"${token}" looks like Portugol/VisualG syntax — this compiler uses Cambridge IGCSE pseudocode.\n` +
    `  Use ${igcse} instead.\n` +
    `  See the Docs tab for the full IGCSE syntax reference.`
  );
}

/** Block-closing keywords. A misspelled one alone on a line silently lexes as an
 *  identifier, leaving the block open and cascading confusing errors onto later lines. */
const BLOCK_CLOSERS = [
  'ENDIF', 'ENDWHILE', 'ENDCASE', 'ENDPROCEDURE', 'ENDFUNCTION', 'ENDTYPE', 'ENDCLASS',
];

/**
 * High-precision detector for a *misspelled or truncated block-closing keyword on
 * its own line* (e.g. `ENDCLA` → ENDCLASS, `ENDPROC` → ENDPROCEDURE, `ENDWHILEE`).
 *
 * Deliberately narrow so it never "corrects" ordinary identifiers:
 *   - the line must be a single bareword (a lone identifier is never a valid
 *     statement, so flagging it costs nothing), and
 *   - it must start with `END` and resolve to exactly one closer — either as a
 *     unique prefix (truncation) or within edit distance 2 (misspelling).
 * Anything ambiguous (bare `END`, a word equally near two closers) returns null
 * and falls through to the normal error path rather than guessing.
 */
function closerSuggestion(sourceLine: string | undefined): string | null {
  if (!sourceLine) return null;
  const word = sourceLine.trim();
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(word)) return null;
  const upper = word.toUpperCase();
  if (!upper.startsWith('END') || upper === 'END') return null;
  if (BLOCK_CLOSERS.includes(upper)) return null; // already spelled correctly

  // 1) Truncation: a prefix of exactly one closer (ENDPROC, ENDCLA, ENDFUN…)
  const prefixMatches = BLOCK_CLOSERS.filter((kw) => kw.startsWith(upper));
  let best: string | null = prefixMatches.length === 1 ? prefixMatches[0] : null;

  // 2) Misspelling: the single nearest closer within edit distance 2
  if (!best) {
    let bestDist = Infinity;
    let tie = false;
    for (const kw of BLOCK_CLOSERS) {
      const d = levenshtein(upper, kw);
      if (d < bestDist) { bestDist = d; best = kw; tie = false; }
      else if (d === bestDist) tie = true;
    }
    if (best === null || bestDist > 2 || tie) return null; // ambiguous → stay quiet
  }

  return (
    `"${word}" is not recognised — did you mean ${best}?\n` +
    `  A misspelled closing keyword leaves its block open, so the lines below are misread as part of it.\n` +
    `  ${SYNTAX_HINTS[best]}`
  );
}

// ── Source-line pattern detectors ────────────────────────────────────────────
// A handful of the most common real-world parse failures (see the PostHog
// offending-line analysis) are recognised most reliably from the *source line
// itself* rather than ANTLR's opaque "no viable alternative" / "mismatched
// input" message — the same approach closerSuggestion() takes. Each detector is
// deliberately high-precision: it keys off syntax that is never valid IGCSE
// pseudocode, and only ever runs on a line ANTLR already flagged, so it cannot
// "correct" working code. A single sourceLineHint() is shared by both
// humanizeParseError (the message) and categorizeParseError (the slug) so the
// two never drift apart.

interface LineDiagnosis {
  category: string;
  message: string;
}

/** Python written where pseudocode was expected (else:/elif/for..in range/input()). */
function pythonHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  const py = (what: string, use: string): LineDiagnosis => ({
    category: 'python_syntax',
    message:
      `"${what}" looks like Python — this compiler uses Cambridge IGCSE pseudocode.\n` +
      `  Use ${use} instead.${SEE_DOCS}`,
  });

  if (/^elif\b/i.test(t)) return py('elif …:', 'ELSE IF <condition> THEN  (no colon)');
  if (/^else\s*:/i.test(t)) return py('else:', 'ELSE on its own line  (no colon)');
  if (/^def\s+[A-Za-z_]\w*\s*\(/i.test(t))
    return py('def name(…):', 'PROCEDURE Name(params) … ENDPROCEDURE, or FUNCTION Name(params) RETURNS <type> … ENDFUNCTION');
  // `print(...)`, `print "..."`, `print '...'` — Python output. (A bare `print`
  // used as a variable, e.g. `print <- 5`, is left alone: it needs a `(`/quote.)
  if (/^print\s*[("']/i.test(t)) return py('print(…)', 'OUTPUT: `OUTPUT "Hello"` or `OUTPUT value`');
  if (/^for\b.*\bin\b.*\brange\s*\(/i.test(t)) return py('for … in range(…):', 'FOR i <- 1 TO n … NEXT i');
  if (/\b(?:int|float|str)\s*\(\s*input\s*\(/i.test(t) || /\binput\s*\(/i.test(t))
    return py('input(…)', 'INPUT on its own line: `INPUT Value`  (INPUT is a statement, no brackets)');
  if (/\brange\s*\(/i.test(t)) return py('range(…)', 'a FOR loop: FOR i <- 1 TO n … NEXT i');
  // Python-style block header ending in a colon (if / while), never valid IGCSE.
  if (/^(?:if|while)\b.*:\s*(?:#.*)?$/i.test(t) && !/\bTHEN\b/i.test(t))
    return py(t.length > 28 ? `${t.slice(0, 28)}…` : t, '`IF <condition> THEN` or `WHILE <condition> DO`  (no trailing colon)');
  return null;
}

/**
 * String/character literal mistakes, checked from the source line because the
 * lexer reports them as opaque "token recognition error" / "no viable
 * alternative" that categorize as generic buckets:
 *   1. Multi-character text in single quotes — `OUTPUT 'POOR'`. Cambridge (and
 *      this grammar) reserve single quotes for a single CHAR ('A'); text is a
 *      STRING in double quotes ("POOR"). So this is a real error, not accepted.
 *   2. A string with no closing quote — an odd number of " on one line (a
 *      STRING literal can never span a line in the grammar).
 */
function stringLiteralHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!t) return null;

  // Ignore quotes that sit *inside* a well-formed "double-quoted string" so an
  // apostrophe in text (OUTPUT "it's fine") can't be mistaken for a CHAR literal.
  const withoutStrings = t.replace(/"(?:[^"\r\n])*"/g, '');

  // 1) Two or more characters between single quotes → they meant a STRING.
  if (/'[^'\r\n]{2,}'/.test(withoutStrings)) {
    return {
      category: 'single_quote_string',
      message:
        'Use double quotes for text (STRING). Single quotes are only for a single character (CHAR).\n' +
        '  Text:  OUTPUT "POOR"\n' +
        "  Char:  Letter <- 'A'",
    };
  }

  // 2) An unmatched double quote → the string is missing its closing ".
  if (((t.match(/"/g) ?? []).length) % 2 === 1) {
    return {
      category: 'unterminated_string',
      message:
        'This line has text that is missing its closing quote.\n' +
        '  Every " needs a matching " on the same line:\n' +
        '    OUTPUT "Hello, world"\n' +
        '  (a STRING cannot run onto the next line.)',
    };
  }

  return null;
}

/** BASIC/Pascal block closers: `END IF`, `ENDFOR`, bare `END`, `BEGIN`. */
const SPACED_CLOSER_TARGET: Record<string, string> = {
  IF: 'ENDIF', WHILE: 'ENDWHILE', CASE: 'ENDCASE',
  FUNCTION: 'ENDFUNCTION', PROCEDURE: 'ENDPROCEDURE',
  PROC: 'ENDPROCEDURE', FUNC: 'ENDFUNCTION',
  TYPE: 'ENDTYPE', CLASS: 'ENDCLASS',
};

function basicBlockHint(line: string): LineDiagnosis | null {
  const upper = line.trim().toUpperCase();

  // A FOR loop closes with NEXT <variable>, not ENDFOR / END FOR.
  if (/^END[\s-]*FOR$/.test(upper))
    return {
      category: 'basic_block_closer',
      message:
        'A FOR loop is closed with NEXT <variable>, not ENDFOR / END FOR.\n' +
        '  Example:\n    FOR i <- 1 TO 10\n      OUTPUT i\n    NEXT i',
    };

  // `END IF`, `END WHILE`, `END-FUNCTION`… → the one-word IGCSE closer.
  const spaced = upper.match(/^END[\s-]+(IF|WHILE|CASE|FUNCTION|PROCEDURE|PROC|FUNC|TYPE|CLASS)$/);
  if (spaced) {
    const target = SPACED_CLOSER_TARGET[spaced[1]];
    return {
      category: 'basic_block_closer',
      message:
        `Write the closing keyword as one word: ${target} (no space).\n` +
        `  You wrote "${line.trim()}".`,
    };
  }

  // Bare BASIC/Pascal wrappers.
  // Students who wrap a program in START … END (flowchart habit) kept re-running
  // after the "not needed" wording — say plainly to delete the line.
  if (upper === 'END' || upper === 'ENDPROGRAM' || upper === 'END PROGRAM')
    return {
      category: 'basic_block_closer',
      message:
        `Delete this ${line.trim()} line — Cambridge IGCSE pseudocode has no general END wrapper.\n` +
        '  Close each block with its own keyword: ENDIF, NEXT i, ENDWHILE, ENDFUNCTION, ENDPROCEDURE.',
    };
  if (upper === 'BEGIN')
    return {
      category: 'basic_block_closer',
      message: 'Delete this BEGIN line. No BEGIN is needed in IGCSE pseudocode — write your statements directly.',
    };
  if (upper === 'START' || upper === 'STOP')
    return {
      category: 'basic_block_closer',
      message:
        `Delete this ${line.trim()} line${upper === 'START' ? ' (and any END or STOP at the bottom)' : ''}.\n` +
        '  Cambridge IGCSE pseudocode does not need START, STOP, BEGIN, or a general END wrapper — ' +
        'the program starts at its first statement.',
    };

  return null;
}

/** Extra ENDFUNCTION / ENDIF / … on a line ANTLR already rejected — not a typo. */
const STRAY_CLOSER_OPENER: Record<string, { category: string; opener: string }> = {
  ENDIF: { category: 'stray_endif', opener: 'IF ... THEN' },
  ENDWHILE: { category: 'stray_endwhile', opener: 'WHILE ... DO' },
  ENDCASE: { category: 'stray_endcase', opener: 'CASE OF' },
  ENDFUNCTION: { category: 'stray_endfunction', opener: 'FUNCTION name() RETURNS <type>' },
  ENDPROCEDURE: { category: 'stray_endprocedure', opener: 'PROCEDURE name()' },
  ENDTYPE: { category: 'stray_endtype', opener: 'TYPE Name' },
  ENDCLASS: { category: 'stray_endclass', opener: 'CLASS Name' },
};

function strayCloserHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  // A lone ELSE that ANTLR rejected — there is no open (or no well-formed) IF
  // above it. (ELSE is not a block *closer*, so it is not in the map below.)
  // NB: ELSE IF / ELSEIF are valid in this grammar, so they are deliberately not
  // matched here — a flagged ELSEIF line has some *other* error on it.
  if (/^ELSE$/i.test(t)) {
    return {
      category: 'stray_else',
      message:
        'ELSE must sit inside an IF … THEN … ELSE … ENDIF block.\n' +
        '  Check the IF above it has THEN, and that this block ends with ENDIF.\n' +
        '  Example:\n    IF Score >= 50 THEN\n      OUTPUT "Pass"\n    ELSE\n      OUTPUT "Fail"\n    ENDIF',
    };
  }
  if (/^NEXT(?:\s+[A-Za-z_]\w*)?$/i.test(t)) {
    return {
      category: 'stray_next',
      message:
        'NEXT must close a FOR loop. There is no open FOR above this line.\n' +
        '  Remove this extra NEXT, or add `FOR i <- 1 TO n` above it.\n' +
        '  Example:\n    FOR i <- 1 TO 10\n      OUTPUT i\n    NEXT i',
    };
  }
  const meta = STRAY_CLOSER_OPENER[t.toUpperCase()];
  if (!meta) return null;
  const kw = t.toUpperCase();
  return {
    category: meta.category,
    message:
      `${kw} doesn't belong here — there is no open ${meta.opener} to close.\n` +
      `  Remove this extra ${kw}, or add the matching ${meta.opener} above it.`,
  };
}

/**
 * `FOR count : 1 TO 3` / `FOR i = 1 TO 10` (wrong operator) or
 * `FOR count 1 TO 5` (no operator at all) — the counter is set with `<-`.
 */
function forLoopHint(line: string): LineDiagnosis | null {
  const t = line.trim();

  // Wrong operator between the counter and its start value.
  const withOp = t.match(/^FOR\s+([A-Za-z_]\w*)\s*(:=|:|=)\s*/i);
  if (withOp) {
    const v = withOp[1];
    return {
      category: 'for_loop_assignment',
      message:
        `Use \`<-\` to set the FOR loop counter, not \`${withOp[2]}\`.\n` +
        `  Example:\n    FOR ${v} <- 1 TO 10\n      OUTPUT ${v}\n    NEXT ${v}`,
    };
  }

  // No operator at all — `FOR count 1 TO 5`. The start value sits straight after
  // the counter name (and it isn't the TO keyword, which would be a different
  // error), so the `<-` is simply missing.
  const noOp = t.match(/^FOR\s+([A-Za-z_]\w*)\s+(?![Tt][Oo]\b)[^<:=\s]\S*\s+TO\b/i);
  if (noOp) {
    const v = noOp[1];
    return {
      category: 'for_loop_assignment',
      message:
        'Set the FOR loop counter with `<-`.\n' +
        `  You wrote "${t}".\n` +
        `  Example:\n    FOR ${v} <- 1 TO 10\n      OUTPUT ${v}\n    NEXT ${v}`,
    };
  }

  return null;
}

/** `OUTPUT "text" value` — OUTPUT items need a comma between them. */
function outputSeparatorHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^(?:OUTPUT|PRINT)\b/i.test(t)) return null;
  // Shapes that used to be read as a missing comma but aren't (Sept 2026):
  // `OUTPUT "You win!" THEN` — the IF's THEN ended up on the OUTPUT line.
  if (/\bTHEN\s*$/i.test(t))
    return {
      category: 'misplaced_then',
      message:
        'THEN belongs at the end of the IF line, not after OUTPUT.\n' +
        '  Example:\n    IF Guess = Secret THEN\n      OUTPUT "You win!"\n    ENDIF',
    };
  // `OUTPUT, "Hi"` / `OUTPUT ,"Hi"` — a comma before the first item.
  if (/^(?:OUTPUT|PRINT)\s*,/i.test(t))
    return {
      category: 'output_leading_comma',
      message:
        'Remove the comma straight after OUTPUT — commas go between items, not before the first one.\n' +
        '  Example:\n    OUTPUT "Total: ", Total',
    };
  // `OUTPUT "Wrong" OR "Try again"` — OR / AND join conditions, not text.
  const words = t.replace(/^(?:OUTPUT|PRINT)\b/i, '').replace(/"[^"]*"/g, '\u0001');
  if (/\u0001\s*(?:OR|AND)\b/i.test(words))
    return {
      category: 'output_logic_word',
      message:
        'OR and AND join conditions in an IF — they cannot join OUTPUT text.\n' +
        '  Print both messages with a comma, or use two OUTPUT lines:\n' +
        '    OUTPUT "Incorrect password. ", "Try again"',
    };
  // A closed string literal next to another value with no comma or operator in
  // between, with or without a space: OUTPUT "Total is " Total, OUTPUT "Hi "Name.
  // Strings are swapped for a marker first (left to right, so quote pairs match
  // up) — otherwise `", "` between two strings would read as a string itself.
  const items = t.replace(/^(?:OUTPUT|PRINT)\b/i, '').replace(/"[^"]*"/g, '\u0001');
  if (/\u0001\s*[A-Za-z0-9_\u0001']|[A-Za-z0-9_)\]]\s*\u0001/.test(items))
    return {
      category: 'output_missing_comma',
      message:
        'Separate OUTPUT items with a comma, or join strings with `&`.\n' +
        '  Example:\n    OUTPUT "Total is ", Total\n' +
        '    OUTPUT "Total is " & NUM_TO_STRING(Total)\n' +
        '  Commas do not insert a space — put any space inside the quotes.\n' +
        '  (a value right after a "quoted string" needs a comma or `&` before it)',
    };
  return null;
}

/** DECLARE written without a colon, with `=`, `AS`, or as a comma-separated list. */
const DECLARE_TYPE = '(?:INTEGER|REAL|STRING|CHAR|BOOLEAN|DATE|ARRAY)';

function looksLikeDeclarationRest(rest: string): boolean {
  return (
    new RegExp(`:\\s*${DECLARE_TYPE}\\b`, 'i').test(rest) ||
    new RegExp(`\\bAS\\s+${DECLARE_TYPE}\\b`, 'i').test(rest) ||
    new RegExp(`(?:^|\\s)${DECLARE_TYPE}\\b`, 'i').test(rest)
  );
}

function declareHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  const first = t.match(/^([A-Za-z_]\w*)\b/);
  if (!first) return null;
  const word = first[1];
  const rest = t.slice(word.length);

  // `declear Count : INTEGER` — common misspelling; edit distance can miss it
  // when ANTLR reports a longer input token than the first word.
  if (!/^DECLARE$/i.test(word) && nearestKeyword(word) === 'DECLARE') {
    const restLooks =
      rest.trim() === '' ||
      looksLikeDeclarationRest(rest) ||
      /^\s+[A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*\s*$/.test(rest);
    if (restLooks)
      return {
        category: 'declare_syntax',
        message:
          `"${word}" is not recognised — did you mean DECLARE?\n` +
          '  Example:\n    DECLARE Count : INTEGER',
      };
  }

  if (!/^(?:DECLARE\b|[A-Za-z_]\w*\s*,)/i.test(t)) return null;

  if (/^DECLARE\s*$/i.test(t))
    return {
      category: 'declare_syntax',
      message:
        'DECLARE needs a name, a colon, and a type.\n' +
        '  Example:\n    DECLARE Count : INTEGER',
    };

  // `DECLARE Answer AS INTEGER` — Visual Basic / SQL style.
  const asType = t.match(new RegExp(`^DECLARE\\s+([A-Za-z_]\\w*)\\s+AS\\s+(${DECLARE_TYPE})\\b`, 'i'));
  if (asType)
    return {
      category: 'declare_syntax',
      message:
        'Use a colon `:` between the name and the type — not AS.\n' +
        `  You wrote "${t}".\n` +
        `  Example:\n    DECLARE ${asType[1]} : ${asType[2].toUpperCase()}`,
    };

  // `DECLARE Count = 0` / `DECLARE Count <- 0` — DECLARE states the type; it never assigns a value.
  const eq = t.match(/^DECLARE\s+([A-Za-z_]\w*)\s*(?:=|<-|←)/i);
  if (eq)
    return {
      category: 'declare_syntax',
      message:
        'DECLARE only states the type — it does not assign a value.\n' +
        `  Give the type with \`:\`, then assign on the next line with \`<-\`:\n` +
        `    DECLARE ${eq[1]} : INTEGER\n    ${eq[1]} <- 0`,
    };

  // `DECLARE a, b, c : INTEGER` / `a, b, c : INTEGER` — one variable per line.
  const commaList = t.match(
    new RegExp(`^(?:DECLARE\\s+)?([A-Za-z_]\\w*)(?:\\s*,\\s*[A-Za-z_]\\w*)+\\s*:\\s*${DECLARE_TYPE}\\b`, 'i'),
  );
  if (commaList)
    return {
      category: 'declare_syntax',
      message:
        'Declare one variable per line — DECLARE does not take a comma-separated list.\n' +
        `  Example:\n    DECLARE ${commaList[1]} : INTEGER\n    DECLARE Count : INTEGER`,
    };

  // `DECLARE N, i, S, P` — comma list with the type left off.
  const commaNoType = t.match(/^DECLARE\s+([A-Za-z_]\w*)(?:\s*,\s*[A-Za-z_]\w*)+\s*$/i);
  if (commaNoType)
    return {
      category: 'declare_syntax',
      message:
        'Declare one variable per line, each with `: <type>`.\n' +
        `  Example:\n    DECLARE ${commaNoType[1]} : INTEGER\n    DECLARE Count : INTEGER`,
    };

  // `DECLARE Count INTEGER` — missing the colon between name and type.
  const noColon = t.match(new RegExp(`^DECLARE\\s+([A-Za-z_]\\w*)\\s+${DECLARE_TYPE}\\b`, 'i'));
  if (noColon)
    return {
      category: 'declare_syntax',
      message:
        'Put a colon between the variable name and its type.\n' +
        `  You wrote "${t}".\n` +
        `  Example:\n    DECLARE ${noColon[1]} : INTEGER`,
    };

  // `DECLARE Student Score : INTEGER` — a name with a space in it.
  const spaced = t.match(/^DECLARE\s+([A-Za-z_]\w*)\s+([A-Za-z_]\w*)\s*:/i);
  if (spaced && !/^AS$/i.test(spaced[2]))
    return {
      category: 'declare_syntax',
      message:
        'A variable name cannot contain spaces — join the words into one name.\n' +
        `  Example:\n    DECLARE ${spaced[1]}${spaced[2][0].toUpperCase()}${spaced[2].slice(1)} : INTEGER`,
    };

  // `DECLARE Counter` / `DECLARE Counter :` — type forgotten.
  const incomplete = t.match(/^DECLARE\s+([A-Za-z_]\w*)\s*:?\s*$/i);
  if (incomplete)
    return {
      category: 'declare_syntax',
      message:
        'DECLARE needs a colon and a type.\n' +
        `  Example:\n    DECLARE ${incomplete[1]} : INTEGER`,
    };

  return null;
}

/** `FUNCTION Add(a, b)` / `function add() {` — header is missing RETURNS <type>. */
function functionHeaderHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^FUNCTION\b/i.test(t)) return null;
  if (/\bRETURNS\b/i.test(t) || /\bRETURN\b/i.test(t)) return null;
  if (/^FUNCTION\s*$/i.test(t)) return null;
  const braces = /[{}]/.test(t);
  return {
    category: 'function_header',
    message:
      (braces
        ? 'That looks like JavaScript — Cambridge FUNCTION headers do not use `{ }` and they need `RETURNS <type>`.\n'
        : 'A FUNCTION header needs `RETURNS <type>` after the parameters. `function` and `FUNCTION` are the same keyword.\n') +
      '  Example:\n    FUNCTION Add(a : INTEGER, b : INTEGER) RETURNS INTEGER\n      RETURN a + b\n    ENDFUNCTION',
  };
}

/** `FOR i <- 1 TO 5 DO` — FOR loops don't take DO (that belongs to WHILE). */
function forDoHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (/^FOR\b.*\bTO\b.*:$/i.test(t))
    return {
      category: 'for_loop_do',
      message:
        "A FOR line doesn't end with a colon — just end the line after the range:\n" +
        '    FOR i <- 1 TO 5\n      OUTPUT i\n    NEXT i',
    };
  if (!/^FOR\b.*\bTO\b.*\bDO$/i.test(t)) return null;
  return {
    category: 'for_loop_do',
    message:
      "A FOR loop doesn't use DO — that keyword belongs to WHILE.\n" +
      '  Just end the line after the range:\n' +
      '    FOR i <- 1 TO 5\n      OUTPUT i\n    NEXT i',
  };
}

/** `FUNCTION F(...) RETURN INTEGER` — the header declares its type with RETURNS. */
function returnTypeHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  // A FUNCTION header line whose type keyword is RETURN, not RETURNS (`\bRETURN\b`
  // already excludes RETURNS — there's no word boundary between the N and the S).
  if (!/^FUNCTION\b[^\n]*\bRETURN\b/i.test(t)) return null;
  return {
    category: 'return_vs_returns',
    message:
      'A FUNCTION header declares its return type with RETURNS (with an S).\n' +
      '  Example:\n    FUNCTION Area(w : INTEGER, h : INTEGER) RETURNS INTEGER\n' +
      '  (RETURN — no S — is only used *inside* the function to send a value back.)',
  };
}

/**
 * A comparison operator with no left-hand value: `x > 12 AND < 65` (they mean
 * `AND x < 65`) or a condition that starts with a comparator (`IF > 5`).
 * High-precision: a logical operator or IF/WHILE/UNTIL is never validly followed
 * straight by a comparison operator, so a correct condition never matches.
 */
function missingOperandHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  const CMP = '(?:<=|>=|<>|<|>|=)';
  if (new RegExp(`\\b(?:AND|OR|NOT)\\s+${CMP}`, 'i').test(t)) {
    return {
      category: 'missing_operand',
      message:
        'A comparison after AND / OR is missing its left-hand value — name the variable again.\n' +
        '  Wrong:  IF Age > 12 AND < 65 THEN\n' +
        '  Right:  IF Age > 12 AND Age < 65 THEN',
    };
  }
  if (new RegExp(`^(?:IF|WHILE|UNTIL)\\s+${CMP}`, 'i').test(t)) {
    return {
      category: 'missing_operand',
      message:
        'A condition needs a value before the comparison operator.\n' +
        '  Wrong:  IF > 5 THEN\n' +
        '  Right:  IF Score > 5 THEN',
    };
  }
  return null;
}

const CONDITION_WORD =
  /^(?:AND|OR|NOT|THEN|DO|MOD|DIV|TO|STEP|TRUE|FALSE|IF|ELSE|ELSEIF|WHILE|UNTIL|INPUT|OUTPUT|PRINT)$/i;

/**
 * IF conditions that were being reported as "missing THEN" because ANTLR's
 * expected-token list happens to include THEN (Sept 2026 telemetry):
 * `IF password "1234"` (no comparison), `… OR "1234"` (variable not repeated),
 * `IF Mark = 70 TO 79` (a CASE-style range). Only runs on a flagged line.
 */
function ifConditionHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^(?:IF|ELSE\s*IF|ELSEIF|WHILE|UNTIL)\b\s*(.*?)\s*(?:\bTHEN\b|\bDO\b)?\s*$/i);
  if (!m) return null;
  const cond = m[1];
  // Arrows and WHILE … TO belong to arrowInConditionHint (while_as_for / compare_with_arrow).
  if (/<-|←/.test(cond)) return null;
  const isIf = /^(?:IF|ELSE\s*IF|ELSEIF)\b/i.test(line.trim());

  // `IF age = 50 , OUTPUT "Young" ENDIF` — a whole IF squeezed onto one line.
  const statementInside = /\b(?:OUTPUT|PRINT|INPUT)\b/i.test(cond.replace(/"[^"]*"/g, '""'));
  const inline = statementInside
    ? cond.match(/^(.*?)[\s,:]*\b(?:THEN\s+)?(OUTPUT|PRINT|INPUT)\b(.*?)(?:\bENDIF\b.*)?$/i)
    : null;
  if (inline && inline[1].trim()) {
    const test = inline[1].replace(/[\s,:]+$/, '').trim();
    return {
      category: 'single_line_if',
      message:
        'Split this IF over separate lines: the condition and THEN, the statement, then ENDIF.\n' +
        `  Example:\n    IF ${clip(test, 30)} THEN\n      ${inline[2].toUpperCase()}${clip(inline[3].replace(/\s+$/, ''), 30)}\n    ENDIF`,
    };
  }

  // `IF Mark -> 50` — an arrow typed for "greater than or equal".
  if (/->/.test(cond))
    return {
      category: 'compare_operator',
      message:
        '-> is not an operator. For "greater than or equal to" use >=, for "greater than" use >.\n' +
        `  Example:\n    IF ${clip(cond.replace(/\s*->\s*/, ' >= '), 30)} THEN`,
    };

  const range = cond.match(/\b([A-Za-z_]\w*)\s*(?:>=|<=|=|>|<)?\s*(-?\d+(?:\.\d+)?)\s+TO\s+(-?\d+(?:\.\d+)?)/i);
  if (isIf && range && !CONDITION_WORD.test(range[1])) {
    const [, v, lo, hi] = range;
    return {
      category: 'if_range',
      message:
        'IF cannot test a range with TO — compare both ends and join them with AND.\n' +
        `  Example:\n    IF ${v} >= ${lo} AND ${v} <= ${hi} THEN\n` +
        `  (Only CASE branches use TO:  ${lo} TO ${hi} : …)`,
    };
  }

  // A variable directly followed by a value, e.g. `password "1234"` or `age 50`.
  const glued = [...cond.matchAll(/\b([A-Za-z_]\w*)\s+("[^"]*"|-?\d+(?:\.\d+)?)(?![\w.])/g)].find(
    (hit) => !CONDITION_WORD.test(hit[1]),
  );
  if (glued) {
    const [, v, value] = glued;
    return {
      category: 'missing_comparison',
      message:
        `Put a comparison between ${v} and ${clip(value, 20)} — for example = (equals) or <> (not equal).\n` +
        `  Example:\n    IF ${v} = ${clip(value, 20)} THEN`,
    };
  }

  // `x = "a" OR "b"`: each side of OR / AND is a full comparison.
  const bare = cond.match(/^(.*?)\b([A-Za-z_]\w*)\s*(?:<>|<=|>=|=|<|>)\s*("[^"]*"|-?\d+(?:\.\d+)?)\s+(OR|AND)\s+("[^"]*"|-?\d+(?:\.\d+)?)\s*$/i);
  if (bare && !CONDITION_WORD.test(bare[2])) {
    const [, , v, first, join, second] = bare;
    return {
      category: 'missing_operand',
      message:
        `Name the variable again after ${join.toUpperCase()} — each side must be a full comparison.\n` +
        `  Example:\n    IF ${v} = ${clip(first, 20)} ${join.toUpperCase()} ${v} = ${clip(second, 20)} THEN`,
    };
  }
  return null;
}

// Detectors below were sized from the ErrorSample table (Sept 2026): these shapes
// were still falling through to the generic "isn't valid IGCSE pseudocode" text.

function clip(s: string, max = 40): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

const DATA_TYPES = /\b(INTEGER|REAL|STRING|CHAR|BOOLEAN)\b/i;
/** Operator words that may follow a value or a closing bracket. */
const OPERATOR_WORDS = '(?:MOD|DIV|AND|OR|NOT|TO|THEN|DO|STEP|OF|RETURNS?)\\b';

/**
 * `Total <- …` / `Total = …` where the value on the right is the problem: missing,
 * a type name, implicit multiplication (`(9/5)C`, `2K`), or two words with no
 * operator between them. (`=` assignment itself parses, so it isn't the issue.)
 */
function assignmentValueHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^([A-Za-z_]\w*(?:\[[^\]]*\])?(?:\.[A-Za-z_]\w*)?)\s*(<-|←|=(?!=))\s*(.*)$/);
  if (!m || KEYWORDS.includes(m[1].match(/^[A-Za-z_]\w*/)![0].toUpperCase())) return null;
  const [, target, , rawValue] = m;
  const value = rawValue.replace(/"[^"]*"/g, '""').trim();

  if (!value)
    return {
      category: 'incomplete_line',
      message: `The line stops before the value. Put what to store after \`<-\`:\n    ${target} <- 0`,
    };
  const type = value.match(new RegExp(`^${DATA_TYPES.source}$`, 'i'));
  if (type)
    return {
      category: 'type_as_value',
      message:
        `${type[1].toUpperCase()} is a data type, not a value.\n` +
        `  Set the type:   DECLARE ${target} : ${type[1].toUpperCase()}\n` +
        `  Store a value:  ${target} <- 0`,
    };
  if (
    /(?:^|[^\w.])\d+(?:\.\d+)?[A-Za-z_(]/.test(value) ||
    new RegExp(`\\)\\s*(?!${OPERATOR_WORDS})[A-Za-z_\\d(]`, 'i').test(value) ||
    /\d\s+[xX×]\s+[\w(]/.test(value)
  )
    return {
      category: 'implicit_multiply',
      message:
        'Write every multiplication with `*` — values next to each other are not multiplied.\n' +
        '  Wrong:  F <- (9 / 5)C + 32     Area <- 2K\n' +
        '  Right:  F <- (9 / 5) * C + 32  Area <- 2 * K',
    };
  const words = value.match(/[A-Za-z_]\w*/g) ?? [];
  if (
    !words.some((w) => KEYWORDS.includes(w.toUpperCase())) &&
    /[\w)\]"]\s+[A-Za-z_"]/.test(value)
  )
    return {
      category: 'value_missing_operator',
      message:
        'Two values sit side by side with nothing joining them.\n' +
        '  Join text with &:     FullName <- FirstName & " " & Surname\n' +
        '  Do maths with + - * /: Total <- Price * Quantity\n' +
        '  Text needs quotes:     Subject <- "Computer Science"',
    };
  return null;
}

/** `IF Number = INTEGER THEN` — checking "is it a whole number" against a type name. */
function typeComparisonHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^(?:IF|WHILE|UNTIL|ELSE\s*IF)\b/i.test(t)) return null;
  if (!new RegExp(`(?:=|<>|\\bNOT|\\bIS)\\s*(?:AN?\\s+)?${DATA_TYPES.source}`, 'i').test(t)) return null;
  return {
    category: 'type_as_value',
    message:
      'INTEGER, REAL and STRING are data types — you cannot compare a value with them.\n' +
      '  To check for a whole number:\n    IF Number = INT(Number) THEN\n      OUTPUT "Whole number"\n    ENDIF',
  };
}

/** `SET Count = 0` — other pseudocode dialects; Cambridge just assigns. */
function setKeywordHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^SET\b\s*[:\-]?\s*([A-Za-z_]\w*)\s*(?:=|<-|←|\bTO\b)\s*([^,]*)/i);
  if (!m) return null;
  return {
    category: 'set_assignment',
    message:
      'Cambridge pseudocode has no SET statement — assign with `<-`, one variable per line.\n' +
      `  Example:\n    ${m[1]} <- ${clip(m[2].trim() || '0', 30)}`,
  };
}

/** `INPUT "Enter your name"` — a prompt with no variable to store the answer in. */
const NOT_A_NAME = /^(?:today|now|please|here|it|this|that|you|want|is|are|of|the|a|an)$/i;

/** A variable name to suggest for `INPUT "Enter the passcode"` → Passcode. */
/** A prompt glued into one word, e.g. "Enterthepasscode". */
const GLUED_PROMPT = /^(?:enter|input|type|please)(?:the|your|a)?(?=[a-z]{3,}$)/i;

function nameFromPrompt(prompt: string): string {
  const last = prompt.match(/([A-Za-z]+)[^A-Za-z]*$/)?.[1]?.replace(GLUED_PROMPT, '');
  if (!last || NOT_A_NAME.test(last)) return 'Answer';
  return last[0].toUpperCase() + last.slice(1).toLowerCase();
}

function inputPromptHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  const quoted = t.match(/^INPUT\s*[=:]?\s*"([^"]*)"/i);
  if (quoted) {
    const text = quoted[1].trim();
    // `INPUT "score"` — the quotes turned the variable name into text.
    if (/^[A-Za-z_]\w*$/.test(text) && !GLUED_PROMPT.test(text))
      return {
        category: 'input_prompt',
        message:
          `The quotes make "${text}" a piece of text, so there is no variable to store the answer. Drop them:\n` +
          `    INPUT ${text}\n` +
          `  To show a question first:  OUTPUT "Enter ${text.toLowerCase()}"  then  INPUT ${text}`,
      };
    const name = nameFromPrompt(text || 'your name');
    const prompt = clip(text || 'Enter your name', 40);
    return {
      category: 'input_prompt',
      message:
        'INPUT needs a variable to store the answer in. Show the question with OUTPUT first:\n' +
        `    OUTPUT "${prompt}"\n    INPUT ${name}\n` +
        `  Or on one line: INPUT ${name}, "${prompt}"`,
    };
  }
  // `INPUT Score, "Mark for student " & i` — the prompt must be one quoted text.
  if (/^INPUT\b[^"]*,\s*"[^"]*"\s*[&+,]/i.test(t))
    return {
      category: 'input_prompt',
      message:
        'An INPUT prompt must be a single piece of text in quotes. For a longer message, OUTPUT it first:\n' +
        '    OUTPUT "Enter the mark for student ", i\n    INPUT Score',
    };
  return null;
}

/** `INPUT`, `INPUT 10`, `INPUT INTEGER` — INPUT reads into a named variable. */
function inputTargetHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^INPUT(?:\s*$|\s+(?:\d|(?:INTEGER|REAL|STRING|CHAR|BOOLEAN)\b))/i.test(t)) return null;
  // `INPUT 3score = 65` — test data typed into the code.
  const pasted = t.match(/^INPUT\s+\d+\s*([A-Za-z_]\w*)\s*=\s*(\S+)/i);
  if (pasted)
    return {
      category: 'input_target',
      message:
        'This looks like a test value typed into the code. Write the INPUT line with just the variable:\n' +
        `    INPUT ${pasted[1]}\n` +
        `  Then type ${clip(pasted[2], 12)} when the program asks for it.`,
    };
  // `INPUT 20` — a value where the variable belongs.
  const value = t.match(/^INPUT\s+(-?\d+(?:\.\d+)?)\s*$/i);
  if (value)
    return {
      category: 'input_target',
      message:
        'INPUT reads what the user types while the program runs, so it needs a variable name, not a number.\n' +
        '  Example:\n    INPUT Age\n' +
        `  To store ${value[1]} yourself, assign it instead:  Age <- ${value[1]}`,
    };
  return {
    category: 'input_target',
    message:
      'INPUT needs the name of the variable that stores the answer.\n' +
      '  Example:\n    DECLARE Age : INTEGER\n    INPUT Age',
  };
}

/** Exam-paper line numbers pasted in front of the code (`12   INPUT Mark`). */
function lineNumberHint(line: string): LineDiagnosis | null {
  const statement =
    /^\d+\s+(?:[A-Za-z_]\w*(?:\[[^\]]*\])?\s*(?:<-|←)|(?:DECLARE|CONSTANT|INPUT|OUTPUT|PRINT|IF|ELSE|ENDIF|FOR|NEXT|WHILE|ENDWHILE|REPEAT|UNTIL|CASE|ENDCASE|OTHERWISE|PROCEDURE|ENDPROCEDURE|FUNCTION|ENDFUNCTION|RETURN|CALL)\b)/i;
  if (!statement.test(line.trim())) return null;
  return {
    category: 'line_numbers',
    message:
      'Remove the line number at the start — numbers printed beside exam code are not part of the program.\n' +
      '  Write:  INPUT Mark\n  not:    12  INPUT Mark',
  };
}

/** `Stars(5)` alone on a line — a procedure is run with CALL. */
function missingCallHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^([A-Za-z_]\w*)\s*\(.*\)$/);
  if (!m || KEYWORDS.includes(m[1].toUpperCase())) return null;
  if (BUILTIN_SIGNATURES[m[1].toUpperCase()])
    return {
      category: 'unused_function_result',
      message:
        `${m[1].toUpperCase()}(…) gives back a value — store it or output it.\n` +
        `  Example:\n    Result <- ${clip(line.trim(), 40)}\n    OUTPUT ${clip(line.trim(), 40)}`,
    };
  return {
    category: 'call_missing',
    message:
      'Run a procedure with CALL.\n' +
      `  Example:\n    CALL ${clip(line.trim(), 40)}\n` +
      '  (A FUNCTION is used inside an expression instead: Total <- Add(A, B))',
  };
}

/** `Value <- CALL Power(A, B)` — CALL is only for procedures, on its own line. */
function callInExpressionHint(line: string): LineDiagnosis | null {
  if (!/(?:<-|←|=|OUTPUT|PRINT|RETURN)\s*CALL\b/i.test(line)) return null;
  return {
    category: 'call_in_expression',
    message:
      'Use a FUNCTION straight inside the expression, without CALL (CALL is only for procedures):\n' +
      '    Value <- Power(A, B)\n    OUTPUT Power(A, B)',
  };
}

/** `ELSE Mark > 75 THEN` — a condition after ELSE needs ELSE IF. */
function elseConditionHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^ELSE\s+(?!IF\b)\S/i.test(t) || !/<>|<=|>=|<|>|=/.test(t)) return null;
  return {
    category: 'else_condition',
    message:
      'A condition after ELSE needs ELSE IF, and ends with THEN.\n' +
      '  Example:\n    IF Mark > 75 THEN\n      OUTPUT "A"\n    ELSE IF Mark > 60 THEN\n      OUTPUT "B"\n    ELSE\n      OUTPUT "C"\n    ENDIF',
  };
}

/** `>= 80 :` / `Marks >= 80 :` — a CASE label can't be a comparison. */
function caseComparisonHint(line: string): LineDiagnosis | null {
  if (!/^(?:[A-Za-z_]\w*\s*)?(?:<=|>=|<>|<|>)\s*[\w.]+\s*:/.test(line.trim())) return null;
  return {
    category: 'case_comparison',
    message:
      'A CASE label is a value or a range, not a comparison.\n' +
      '  Range:  80 TO 100 : OUTPUT "A"\n' +
      '  Or use IF … ELSE IF … ENDIF for conditions like Mark >= 80.',
  };
}

/** `DISPLAY(...)` / `SHOW` / `println` — other languages' output commands. */
function outputSynonymHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^(DISPLAY|SHOW|PRINTLN|WRITELN|COUT|PUTS)\b/i);
  if (!m) return null;
  return {
    category: 'wrong_language_keyword',
    message:
      `Use OUTPUT instead of "${m[1]}" — no brackets needed.\n` +
      '  Example:\n    OUTPUT "Total: ", Total',
  };
}

/** `x ** 2` — powers are written with `^`. */
function powerOperatorHint(line: string): LineDiagnosis | null {
  if (!/\*\*/.test(line)) return null;
  return {
    category: 'power_operator',
    message: 'Use `^` for powers, not `**`.\n  Example:\n    Area <- Side ^ 2',
  };
}

/** `<-` inside a condition (`WHILE Found <- TRUE DO`), or WHILE written as a FOR. */
function arrowInConditionHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  // `WHILE Count <- 1 TO 5` and `WHILE i = 1 TO 25` are both a FOR loop in disguise.
  const whileRange = /^WHILE\b/i.test(t) && /\bTO\b/i.test(t);
  if (!/^(?:IF|WHILE|UNTIL|ELSE\s*IF|ELSEIF)\b/i.test(t) || (!/<-|←/.test(t) && !whileRange)) return null;
  if (whileRange)
    return {
      category: 'while_as_for',
      message:
        'That looks like a counting loop — use FOR for that:\n' +
        '    FOR Count <- 1 TO 5\n      OUTPUT Count\n    NEXT Count\n' +
        '  WHILE takes a condition instead: WHILE Count <= 5 DO',
    };
  return {
    category: 'compare_with_arrow',
    message:
      '`<-` stores a value; inside a condition compare with `=`.\n' +
      '  Example:\n    WHILE Found = FALSE DO\n    IF Answer = "Y" THEN',
  };
}

/** `PROCEDURE Largest(...) RETURNS INTEGER` — only a FUNCTION returns a value. */
function procedureReturnsHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^PROCEDURE\s+([A-Za-z_]\w*)\s*(\([^)]*\))?.*\bRETURNS?\b\s*([A-Za-z]+)?/i);
  if (!m) return null;
  return {
    category: 'procedure_returns',
    message:
      'A PROCEDURE does not return a value. If this sends a value back, make it a FUNCTION:\n' +
      `    FUNCTION ${m[1]}${m[2] ?? '()'} RETURNS ${(m[3] ?? 'INTEGER').toUpperCase()}\n` +
      '      ...\n      RETURN First\n    ENDFUNCTION',
  };
}

/** `PROCEDURE Show(Num1, Num2)` — every parameter needs `: <type>`. */
function paramTypeHint(line: string): LineDiagnosis | null {
  const m = line.trim().match(/^(PROCEDURE|FUNCTION)\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/i);
  if (!m || !m[3].trim()) return null;
  const params = m[3].split(',').map((p) => p.trim().replace(/^(?:BYREF|BYVAL)\s+/i, ''));
  if (params.every((p) => p.includes(':'))) return null;
  const names = params.map((p) => (/^[A-Za-z_]\w*$/.test(p) ? p : 'Value'));
  return {
    category: 'param_type_missing',
    message:
      'Give each parameter a type with a colon.\n' +
      `  Example:\n    ${m[1].toUpperCase()} ${m[2]}(${names.map((n) => `${n} : INTEGER`).join(', ')})`,
  };
}

/** Any DECLARE of an array that didn't parse: show the one canonical shape. */
function arrayDeclareHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  if (!/^DECLARE\b/i.test(t) || !/\bARRAY\b|\[/i.test(t)) return null;
  const name = t.replace(/^DECLARE\s+/i, '').replace(/^ARRAY\s+/i, '').match(/^[A-Za-z_]\w*/)?.[0] ?? 'Scores';
  const type = t.match(/\b(INTEGER|REAL|STRING|CHAR|BOOLEAN)\b/i)?.[1].toUpperCase() ?? 'INTEGER';
  const bounds = t.match(/(\d+)\s*(?::|\bTO\b)\s*(\d+)/i);
  const lo = bounds?.[1] ?? '1';
  const hi = bounds?.[2] ?? '10';
  return {
    category: 'declare_array_syntax',
    message:
      'Declare an array as  DECLARE <name> : ARRAY[<first>:<last>] OF <type>\n' +
      `  Example:\n    DECLARE ${name} : ARRAY[${lo}:${hi}] OF ${type}\n` +
      '  2D:  DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER\n' +
      '  Use square brackets and a colon between the bounds.',
  };
}

/**
 * A sentence typed as code (`Plan your name`, `Inputs Number`). A misspelled
 * keyword up front gets "did you mean"; plain words get OUTPUT / comment options.
 * ANTLR glues the words together in its message, so this reads the line itself.
 */
function plainWordsHint(line: string): LineDiagnosis | null {
  const t = line.trim();
  const first = t.match(/^[A-Za-z]+/)?.[0];
  if (!first || KEYWORDS.includes(first.toUpperCase())) return null;
  // `Ouptut "Hi"`, `Inputs Number` — a misspelled keyword starting the line
  // (not a variable being assigned or indexed).
  const near = nearestKeyword(first);
  if (near && /^[A-Za-z]+(?:\s|"|\(|$)/.test(t) &&!/^[A-Za-z]+\s*(?:<-|←|=|\[|\.)/.test(t))
    return {
      category: 'misspelled_keyword',
      message: `"${first}" is not recognised — did you mean ${near}?`,
    };
  if (!/^[A-Za-z]+(?:\s+[A-Za-z']+)+[.!?]?$/.test(t)) return null;
  const shown = clip(t.replace(/"/g, ''), 40);
  return {
    category: 'plain_english',
    message:
      'This line reads like a sentence, not a pseudocode statement.\n' +
      `  To show it as text:   OUTPUT "${shown}"\n` +
      `  To keep it as a note: // ${shown}`,
  };
}

/** Shared source-line diagnosis used by both the humanizer and the categorizer. */
function sourceLineHint(sourceLine: string | undefined): LineDiagnosis | null {
  if (!sourceLine || !sourceLine.trim()) return null;
  return (
    pythonHint(sourceLine) ??
    stringLiteralHint(sourceLine) ??
    basicBlockHint(sourceLine) ??
    strayCloserHint(sourceLine) ??
    arrayDeclareHint(sourceLine) ??
    declareHint(sourceLine) ??
    procedureReturnsHint(sourceLine) ??
    functionHeaderHint(sourceLine) ??
    paramTypeHint(sourceLine) ??
    forLoopHint(sourceLine) ??
    forDoHint(sourceLine) ??
    returnTypeHint(sourceLine) ??
    missingOperandHint(sourceLine) ??
    ifConditionHint(sourceLine) ??
    arrowInConditionHint(sourceLine) ??
    lineNumberHint(sourceLine) ??
    caseComparisonHint(sourceLine) ??
    elseConditionHint(sourceLine) ??
    callInExpressionHint(sourceLine) ??
    inputTargetHint(sourceLine) ??
    inputPromptHint(sourceLine) ??
    setKeywordHint(sourceLine) ??
    outputSynonymHint(sourceLine) ??
    powerOperatorHint(sourceLine) ??
    typeComparisonHint(sourceLine) ??
    assignmentValueHint(sourceLine) ??
    outputSeparatorHint(sourceLine) ??
    plainWordsHint(sourceLine) ??
    missingCallHint(sourceLine)
  );
}

/** The rest of the program, for hints that need more than the flagged line. */
export interface ParseErrorContext {
  /** Every source line (normalized), 0-indexed. */
  lines: string[];
  /** 1-based line the error was reported on (after resolveOffendingLine). */
  line: number | null | undefined;
}

const BLOCK_PAIRS: { kind: string; closer: string; category: string }[] = [
  { kind: 'IF', closer: 'ENDIF', category: 'missing_endif' },
  { kind: 'FOR', closer: 'NEXT', category: 'missing_next' },
  { kind: 'WHILE', closer: 'ENDWHILE', category: 'missing_endwhile' },
  { kind: 'REPEAT', closer: 'UNTIL', category: 'unclosed_block' },
  { kind: 'CASE', closer: 'ENDCASE', category: 'missing_endcase' },
  { kind: 'PROCEDURE', closer: 'ENDPROCEDURE', category: 'missing_endprocedure' },
  { kind: 'FUNCTION', closer: 'ENDFUNCTION', category: 'missing_endfunction' },
];

function startsWithWord(code: string, word: string): boolean {
  return new RegExp(`^${word}\\b`, 'i').test(code);
}

/** Code on a line with string contents and comments removed. */
function codeOf(line: string): string {
  return line.replace(/"[^"]*"/g, '""').replace(/\/\/.*$/, '').trim();
}

/**
 * An IF / FOR / WHILE … that never gets its closer, reported at the end of the
 * program. ANTLR usually says "no viable alternative at input '\n'" on the last
 * (perfectly valid) line instead of naming the missing ENDIF, which left
 * students staring at an OUTPUT line that has nothing wrong with it.
 */
function unclosedBlockHint(ctx: ParseErrorContext): LineDiagnosis | null {
  const code = ctx.lines.map(codeOf);
  const lastCode = code.reduce((last, c, i) => (c ? i + 1 : last), 0);
  if (!ctx.line || ctx.line < lastCode) return null;

  const open: { kind: string; category: string; line: number; text: string }[] = [];
  code.forEach((c, i) => {
    for (const p of BLOCK_PAIRS) {
      // `IF x THEN OUTPUT "a" ENDIF` on one line opens and closes itself.
      if (startsWithWord(c, p.kind)) {
        if (!new RegExp(`\\b${p.closer}\\b`, 'i').test(c))
          open.push({ kind: p.kind, category: p.category, line: i + 1, text: c });
      } else if (startsWithWord(c, p.closer)) {
        const idx = open.map((o) => o.kind).lastIndexOf(p.kind);
        if (idx >= 0) open.splice(idx, 1);
      }
    }
  });
  const block = open[open.length - 1];
  if (!block) return null;

  const closer =
    block.kind === 'FOR'
      ? `NEXT ${block.text.match(/^FOR\s+([A-Za-z_]\w*)/i)?.[1] ?? 'i'}`
      : block.kind === 'REPEAT'
        ? 'UNTIL <condition>'
        : `END${block.kind}`;
  const noThen = block.kind === 'IF' && !/\bTHEN\b/i.test(block.text) && !/^THEN\b/i.test(code[block.line] ?? '');
  const noDo = block.kind === 'WHILE' && !/\bDO\b/i.test(block.text);
  return {
    category: block.category,
    message:
      `The ${block.kind} on line ${block.line} is never closed — add ${closer} after the last line inside it.\n` +
      (noThen ? `  That IF line is also missing THEN: IF <condition> THEN\n` : '') +
      (noDo ? `  That WHILE line is also missing DO: WHILE <condition> DO\n` : '') +
      `  ${clip(block.text, 50)}\n    ...\n  ${closer}`,
  };
}

/** THEN on its own line after a WHILE, or after an IF that already has a statement on it. */
function misplacedThenHint(ctx: ParseErrorContext, sourceLine: string | undefined): LineDiagnosis | null {
  if (!sourceLine || !/^THEN\b/i.test(sourceLine.trim()) || !ctx.line) return null;
  let prev = '';
  for (let i = ctx.line - 2; i >= 0 && !prev; i--) prev = codeOf(ctx.lines[i] ?? '');
  if (/^WHILE\b/i.test(prev))
    return {
      category: 'misplaced_then',
      message:
        'A WHILE loop uses DO, not THEN, at the end of its condition line.\n' +
        '  Example:\n    WHILE Count < 10 DO\n      Count <- Count + 1\n    ENDWHILE',
    };
  if (/^IF\b/i.test(prev) && /\b(?:OUTPUT|PRINT|INPUT)\b|<-|←/i.test(prev))
    return {
      category: 'misplaced_then',
      message:
        'THEN goes straight after the IF condition, and the statement goes on the next line.\n' +
        '  Example:\n    IF Mark > 75 THEN\n      OUTPUT "Distinction"\n    ENDIF',
    };
  return null;
}

/** Hints that need the whole program; run after the single-line detectors. */
function programHint(
  rawMessage: string,
  sourceLine: string | undefined,
  ctx: ParseErrorContext | undefined,
): LineDiagnosis | null {
  if (!ctx) return null;
  if (rawMessage.includes('<EOF>') || rawMessage.includes('token recognition error')) return null;
  return misplacedThenHint(ctx, sourceLine) ?? unclosedBlockHint(ctx);
}

export function humanizeParseError(
  rawMessage: string,
  sourceLine?: string,
  context?: ParseErrorContext,
): string {
  const msg = explainParseError(rawMessage, sourceLine, context);
  return isAntlrJargon(msg) ? genericParseFallback(sourceLine) : msg;
}

function explainParseError(
  rawMessage: string,
  sourceLine?: string,
  context?: ParseErrorContext,
): string {
  // Root-cause check: a botched closer (e.g. ENDCLA) is the real error even though
  // ANTLR reports the symptom (a stray newline) — surface it before anything else.
  const closer = closerSuggestion(sourceLine);
  if (closer) return closer;

  // Source-line pattern match (Python syntax, BASIC closers, FOR `:`/`=`, OUTPUT
  // missing comma). Non-IGCSE shapes recognised straight from the line, so they
  // beat ANTLR's generic message for the same mistake.
  const lineHint = sourceLineHint(sourceLine);
  if (lineHint) return lineHint.message;

  // Whole-program checks (unclosed block reported at the end, misplaced THEN).
  const progHint = programHint(rawMessage, sourceLine, context);
  if (progHint) return progHint.message;

  // ── targeted hints for the two biggest real-world error buckets ──────────
  // `=` used for assignment (the single most common parse error) and any curly
  // quote that slips past normalization.
  if (/(?:extraneous|mismatched) input '=' expecting \{NOT/.test(rawMessage)) {
    return (
      'Use `<-` to assign a value; `=` is only for comparing.\n' +
      '  Assign:  Count <- 0\n' +
      '  Compare: IF Count = 0 THEN'
    );
  }
  const curlyQuote = rawMessage.match(/token recognition error at: '([^']+)'/);
  if (curlyQuote && /[“”‘’„‟]/.test(curlyQuote[1])) {
    return (
      'Those look like curly quotes from a word processor — use straight quotes.\n' +
      '  Text: OUTPUT "Hello"\n' +
      "  Char: Letter <- 'A'"
    );
  }

  const lower = rawMessage.toLowerCase();
  const commonHint = commonParseHint(rawMessage);
  if (commonHint) return commonHint;

  // ── token recognition error (lexer — truly unknown chars) ──────────────
  const tokenRecog = rawMessage.match(/token recognition error at: '([^']+)'/);
  if (tokenRecog) {
    const ch = tokenRecog[1];
    if (ch === '{' || ch === '}') return 'Unexpected "{" or "}" — use IF/WHILE/FOR blocks, not curly braces';
    if (ch === ';') return 'Unexpected ";" — pseudocode does not use semicolons';
    if (ch === '#') return 'Use // for comments, not #\n  Example: // this is a comment';
    if (ch === '`')
      return (
        'That looks like a Markdown code block (```) pasted from a chat or webpage.\n' +
        '  Paste only the pseudocode itself — remove the ``` fence lines and any explanation text around it.'
      );
    if (ch === '!' || ch === '!=') return 'Use <> for "not equal to", not "!="\n  Example: IF x <> 0 THEN';
    if (ch === '==') return 'Use = for comparison in pseudocode, not ==\n  Example: IF x = 5 THEN';
    if (ch === '&&') return 'Use AND instead of &&\n  Example: IF a > 0 AND b > 0 THEN';
    if (ch === '||') return 'Use OR instead of ||\n  Example: IF a = 0 OR b = 0 THEN';
    if (ch.charCodeAt(0) === 0xf0ac) return 'Use <- for assignment. Some copied arrow symbols are not recognised.\n  Example: Total <- Total + 1';
    return `Unexpected character "${ch}"`;
  }

  // ── missing expected token ─────────────────────────────────────────────
  const missingMatch = rawMessage.match(/missing '([^']+)' at/i);
  if (missingMatch) {
    const missing = missingMatch[1].toUpperCase();
    const hint = SYNTAX_HINTS[missing];
    if (hint) return `Missing ${hint}`;
    return `Missing "${missingMatch[1]}" — check your syntax around this line`;
  }

  // ── mismatched / extraneous input ─────────────────────────────────────
  if (lower.includes('mismatched input') || lower.includes('extraneous input')) {
    const rawToken = extractToken(rawMessage);
    const token = rawToken ? cleanToken(rawToken) || rawToken : null;

    // EOF mismatches → missing closing keyword
    if (token === '<EOF>') {
      for (const [kw, hint] of Object.entries(SYNTAX_HINTS)) {
        if (rawMessage.includes(kw)) return `Missing ${hint}`;
      }
      return 'Unexpected end of program — you may be missing a closing keyword (ENDIF, ENDWHILE, etc.)';
    }

    if (token) {
      const tokenUpper = token.toUpperCase();

      // Portugol/VisualG keywords
      const phint = portugolHint(token);
      if (phint) return phint;

      // Wrong-token list (non-pseudocode keywords)
      const wrongHint = WRONG_TOKENS[token.toLowerCase()] ?? WRONG_TOKENS[token];
      if (wrongHint) return wrongHint;

      if (token === '<-')
        return 'An assignment needs a variable name before `<-`.\n  Example:\n    Total <- Total + 1\n  Do not start a line with `<-`.';

      if (/^\d+(?:\.\d+)?$/.test(token) && rawMessage.includes('<EOF>'))
        return `A statement cannot start with ${token} by itself.\n  To store it: Total <- ${token}\n  To display it: OUTPUT ${token}`;

      if (tokenUpper === 'DECLARE' && rawMessage.includes('expecting IDENTIFIER'))
        return 'DECLARE was found where a variable name was expected.\n  Declaration: DECLARE Count : INTEGER\n  Input:       INPUT Count\n  FOR loop:    NEXT i';

      if (token === '[')
        return 'Array access needs the array name before `[`.\n  Example:\n    Scores[i] <- 10\n    OUTPUT Scores[i]';

      // `...` placeholders left in starter code parse as stray dots
      if (token === '.' && isExpressionExpected(rawMessage))
        return 'Replace the `...` placeholder with your own code.\n  Example: change `IF ... THEN` to `IF MOD(N, 2) = 0 THEN`';

      if (['>=', '<=', '>', '<', '=', '<>'].includes(token) && isExpressionExpected(rawMessage))
        return `A comparison operator like ${token} needs a value on both sides.\n  Example:\n    IF Score ${token} 50 THEN\n      OUTPUT "OK"\n    ENDIF`;

      if (token === ':' && isExpressionExpected(rawMessage))
        return 'A colon is only used in DECLARE statements and CASE clauses.\n  Declaration: DECLARE Count : INTEGER\n  Assignment:  Count <- 0\n  CASE clause: 1 : OUTPUT "One"';

      // INPUT used as an expression value (e.g. x <- INPUT x)
      if (tokenUpper === 'INPUT')
        return 'INPUT is a statement, not a value — write it on its own line:\n  INPUT variableName\n  (not: variable ← INPUT variable)';

      // UNTIL in a FOR loop (should be NEXT, or loop should be REPEAT)
      if (token.toUpperCase() === 'UNTIL' && rawMessage.includes('NEXT'))
        return 'UNTIL ends a REPEAT loop, not a FOR loop.\n  Use NEXT to close a FOR loop:\n    FOR i ← 1 TO 10\n      ...\n    NEXT i\n  Or change the loop to REPEAT ... UNTIL condition';

      // ENDIF appearing where THEN was expected (IF missing THEN)
      if (token.toUpperCase() === 'ENDIF' && rawMessage.includes('THEN'))
        return 'ENDIF found where THEN was expected — your IF statement is missing THEN:\n  IF condition THEN\n    ...\n  ENDIF';

      // Unexpected closing bracket
      if (token === ']')
        return 'Unexpected `]` — check that every `[` has one matching `]` on the same array access.\n  Example: Scores[i] <- 10\n  For loops close with NEXT i, not a bracket.';

      // Comma where colon expected — most likely ARRAY[1,6] instead of ARRAY[1:6]
      if (token === ',' && rawMessage.includes("':'"))
        return 'Use `:` not `,` for array bounds in a declaration:\n  DECLARE mylist : ARRAY[1:6] OF INTEGER\n  For 2D: DECLARE grid : ARRAY[1:3, 1:3] OF INTEGER';

      // Comma inside brackets where an index list was not expected
      if (token === ',' && rawMessage.includes("']'"))
        return 'Unexpected `,` inside `[...]`. For 2D arrays use `array[row, col]`, and check each `[` has one matching `]`.';

      // Newline token = incomplete expression (the line ended before a value was given)
      if (token === '\\n' || token === '\n')
        return 'This line seems incomplete — a value or expression is expected here.';

      // Known keyword on the same line as another statement
      if (rawMessage.includes('NEWLINE') && KEYWORDS.includes(token.toUpperCase()))
        return `${token.toUpperCase()} must be on its own line — put each statement on a separate line`;

      // Extra closer (ENDFUNCTION with no FUNCTION) — never "did you mean ENDFUNCTION?"
      const stray = strayCloserHint(token);
      if (stray) return stray.message;

      // Casing issue or near-misspelling
      const nearest = nearestKeyword(token);
      if (nearest) {
        return `"${token}" is not recognised — did you mean ${nearest}?`;
      }

      // Expecting specific things
      if (rawMessage.includes("'DO'")) return `Missing DO after the WHILE condition\n  Example: WHILE ${token} DO`;
      if (rawMessage.includes("'OF'")) return `Missing OF in CASE statement\n  Example: CASE OF variable`;
    }
    return genericParseFallback(sourceLine);
  }

  // ── no viable alternative ──────────────────────────────────────────────
  if (lower.includes('no viable alternative')) {
    const rawToken = extractToken(rawMessage);
    const token = rawToken ? cleanToken(rawToken) || rawToken : null;
    if (token) {
      const tokenUpper = token.toUpperCase();

      // NEXT appearing outside a FOR loop (e.g. '\nNEXT' at top level)
      if (tokenUpper === 'NEXT')
        return 'NEXT must close a FOR loop. Make sure you have a matching `FOR ... TO ...` statement above it.\n  Example:\n    FOR i <- 1 TO 10\n      OUTPUT i\n    NEXT i';

      if (tokenUpper === 'ENDIF')
        return 'ENDIF closes an IF block. Check that there is a matching `IF ... THEN` above it.\n  Example:\n    IF Score >= 50 THEN\n      OUTPUT "Pass"\n    ENDIF';

      if (tokenUpper === 'UNTIL')
        return 'UNTIL closes a REPEAT loop. Check that there is a matching REPEAT above it.\n  Example:\n    REPEAT\n      INPUT Answer\n    UNTIL Answer = "Y"';

      if (['START', 'STOP', 'END'].includes(tokenUpper))
        return 'Cambridge IGCSE pseudocode does not need START, STOP, BEGIN, or a general END wrapper.\n  Write statements directly, and use specific closers such as ENDIF, NEXT i, ENDWHILE, and ENDFUNCTION.';

      if (tokenUpper === 'DECLARE:')
        return 'Do not put `:` immediately after DECLARE.\n  Example:\n    DECLARE Count : INTEGER';

      const phint = portugolHint(token);
      if (phint) return phint;

      const stray = strayCloserHint(token);
      if (stray) return stray.message;

      const nearest = nearestKeyword(token);
      if (nearest) return `"${token}" is not recognised — did you mean ${nearest}?`;

      if (/^[A-Za-z][A-Za-z0-9_]*$/.test(token))
        return (
          `The line starts with "${token}", but it is not a complete statement.\n` +
          `  To assign a value: ${token} <- value\n` +
          `  To display it:     OUTPUT ${token}\n` +
          `  To display text:   OUTPUT "${token}"`
        );
    }
    return genericParseFallback(sourceLine);
  }

  return genericParseFallback(sourceLine);
}

// ── Built-in function registry (for typo suggestions) ──────────────────────

function nearestBuiltin(name: string): string | null {
  const upper = name.toUpperCase();
  if (BUILTIN_SIGNATURES[upper]) return upper;
  if (name.length < 3) return null;
  let best: string | null = null;
  let bestDist = Infinity;
  for (const fn of BUILTIN_NAMES) {
    const d = levenshtein(upper, fn);
    if (d < bestDist && d <= 2) { bestDist = d; best = fn; }
  }
  return best;
}

/** Names students call that are not Cambridge builtins — explain, don't guess a nearby IGCSE name. */
const UNKNOWN_FN_HINTS: Record<string, string> = {
  SQRT:
    'SQRT is not a Cambridge IGCSE built-in — `Sqrt` and `SQRT` are the same name (capitalisation does not matter).\n' +
    '  Paper 2 usually gives the square root, or asks you to use the formula in the question.',
  SQR:
    'SQR is not a Cambridge IGCSE built-in.\n' +
    '  Paper 2 usually gives the square root, or asks you to use the formula in the question.',
  POW:
    'There is no POW() — use `^` for powers.\n' +
    '  Example: OUTPUT 2 ^ 3',
  POWER:
    'There is no POWER() — use `^` for powers.\n' +
    '  Example: OUTPUT 2 ^ 3',
  ORD:
    'Cambridge uses ASC(char), not ORD.\n' +
    "  Example: OUTPUT ASC('A')",
  LEN:
    'Use LENGTH(str), not LEN.\n' +
    '  Example: OUTPUT LENGTH(Name)',
};

function unknownFunctionHint(name: string): string | null {
  return UNKNOWN_FN_HINTS[name.toUpperCase()] ?? null;
}

// ── Runtime error humanization ──────────────────────────────────────────────

export function humanizeRuntimeError(rawMessage: string): string {
  // Variable not defined
  const notDefined = rawMessage.match(/Variable '([^']+)' is not defined/);
  if (notDefined) {
    const name = notDefined[1];
    // console.log(...) now parses as a method call and fails here instead of at parse time
    if (name.toLowerCase() === 'console') {
      return 'Use OUTPUT instead of console.log\n  Example: OUTPUT "Hello"';
    }
    return (
      `'${name}' has not been declared. Add a DECLARE statement before using it:\n` +
      `  DECLARE ${name} : INTEGER   // whole numbers\n` +
      `  DECLARE ${name} : REAL      // decimals\n` +
      `  DECLARE ${name} : STRING    // text\n` +
      `  DECLARE ${name} : BOOLEAN   // TRUE / FALSE`
    );
  }

  // Constant reassignment
  const constAssign = rawMessage.match(/Cannot assign to constant '([^']+)'/);
  if (constAssign) {
    return `'${constAssign[1]}' is a CONSTANT and cannot be changed after declaration.`;
  }

  // Not an array
  const notArray = rawMessage.match(/'([^']+)' is not an array/);
  if (notArray) {
    return `'${notArray[1]}' is not an array. To declare one:\n  DECLARE ${notArray[1]} : ARRAY[1:10] OF INTEGER`;
  }

  // Array used without index
  const arrayNoIndex = rawMessage.match(/'([^']+)' is an array; use indexing/);
  if (arrayNoIndex) {
    return `'${arrayNoIndex[1]}' is an array — use an index to access elements.\n  Example: ${arrayNoIndex[1]}[1]`;
  }

  // Array index out of bounds
  const oob = rawMessage.match(/Array index (-?\d+) out of bounds \[(-?\d+):(-?\d+)\]/);
  if (oob) {
    return `Index ${oob[1]} is out of range. This array goes from ${oob[2]} to ${oob[3]}.`;
  }

  // Wrong number of array dimensions
  const dimMismatch = rawMessage.match(/Array expects (\d+) index\(es\), got (\d+)/);
  if (dimMismatch) {
    const expected = dimMismatch[1], got = dimMismatch[2];
    if (expected === '2' && got === '1') return 'This is a 2D array — use two indices.\n  Example: grid[row, col]';
    if (expected === '1' && got === '2') return 'This is a 1D array — use one index.\n  Example: arr[i]';
    return `This array needs ${expected} index(es), but ${got} was given.`;
  }

  // Division by zero
  if (rawMessage.includes('Division by zero')) {
    return 'Division by zero — make sure your divisor is not 0 before dividing.';
  }

  // Procedure not defined
  const procUndef = rawMessage.match(/Procedure '([^']+)' is not defined/);
  if (procUndef) {
    const name = procUndef[1];
    const near = nearestBuiltin(name);
    if (near) {
      return (
        `Procedure '${name}' is not defined — did you mean the built-in function \`${near}\`?\n` +
        `  ${BUILTIN_SIGNATURES[near]}\n` +
        `  Built-in functions are called directly, not with CALL.\n` +
        `  Example: OUTPUT ${near.split('(')[0]}(...)`
      );
    }
    return `Procedure '${name}' is not defined. Check the spelling, or define it:\n  PROCEDURE ${name}()\n    ...\n  ENDPROCEDURE`;
  }

  // Function not defined
  const funcUndef = rawMessage.match(/Function '([^']+)' is not defined/);
  if (funcUndef) {
    const name = funcUndef[1];
    const alias = unknownFunctionHint(name);
    if (alias) return `Function '${name}' is not defined.\n  ${alias}`;
    const near = nearestBuiltin(name);
    if (near) {
      return (
        `Function '${name}' is not defined — did you mean the built-in \`${near}\`?\n` +
        `  ${BUILTIN_SIGNATURES[near]}`
      );
    }
    return `Function '${name}' is not defined. Check the spelling, or define it:\n  FUNCTION ${name}() RETURNS INTEGER\n    ...\n  ENDFUNCTION`;
  }

  // CASE on array
  if (rawMessage.includes('CASE cannot operate on array')) {
    return 'CASE cannot be used directly on an array. Access an element first.\n  Example: CASE OF arr[i]';
  }

  // Private class member access (A Level OOP)
  const privateAccess = rawMessage.match(/Cannot access private (method|property) '([^']+)' of class '([^']+)'/);
  if (privateAccess) {
    return (
      `${rawMessage}\n` +
      `  PRIVATE members can only be used inside the class.\n` +
      `  Make '${privateAccess[2]}' PUBLIC, or add a PUBLIC method that uses it.`
    );
  }

  // Record field missing (A Level records)
  const noField = rawMessage.match(/Record type '([^']+)' has no field '([^']+)'/);
  if (noField) {
    return `${rawMessage}\n  Check the field names declared between TYPE ${noField[1]} and ENDTYPE.`;
  }

  return rawMessage;
}

// ── Error categorization (for analytics) ────────────────────────────────────
// Maps a raw ANTLR/runtime message to a small, stable slug. Kept separate from
// the display humanizers so PostHog can bucket errors by cause without the
// raw-message noise.

/** A foreign-language punctuation char the lexer rejects. */
const FOREIGN_PUNCT = new Set([';', '{', '}', '#', '`']);
const SMART_QUOTE_CODEPOINTS = new Set([0x201c, 0x201d, 0x2018, 0x2019, 0x201e, 0x201f]);

export function categorizeParseError(
  rawMessage: string,
  sourceLine?: string,
  context?: ParseErrorContext,
): string {
  // Root cause: a misspelled block closer masquerading as a stray-newline error.
  if (closerSuggestion(sourceLine)) return 'misspelled_closer';

  // Non-IGCSE shapes recognised from the source line (python_syntax,
  // basic_block_closer, for_loop_assignment, output_missing_comma).
  const lineHint = sourceLineHint(sourceLine);
  if (lineHint) return lineHint.category;

  const progHint = programHint(rawMessage, sourceLine, context);
  if (progHint) return progHint.category;

  const tokenRecog = rawMessage.match(/token recognition error at: '([^']+)'/);
  if (tokenRecog) {
    const ch = tokenRecog[1];
    if (ch.length >= 1 && SMART_QUOTE_CODEPOINTS.has(ch.codePointAt(0)!)) return 'smart_quotes';
    if (FOREIGN_PUNCT.has(ch)) return 'foreign_punctuation';
    if (ch === '==') return 'equality_operator_double';
    if (ch === '!=' || ch === '!') return 'not_equal_bang';
    if (ch === '&&' || ch === '||') return 'boolean_operator_symbol';
    if (ch === "'") return 'single_quote_string';
    // A lone space / non-printing char that survived normalization.
    if (ch.trim() === '') return 'invisible_char';
    return 'unknown_character';
  }

  // `=` used for assignment — the single most common parse error.
  if (/(?:extraneous|mismatched) input '=' expecting \{NOT/.test(rawMessage)) return 'assign_with_equals';

  // Unclosed blocks (EOF reached before a closer).
  if (rawMessage.includes('<EOF>')) {
    if (rawMessage.includes('ENDIF')) return 'missing_endif';
    if (rawMessage.includes('NEXT')) return 'missing_next';
    if (rawMessage.includes('ENDWHILE')) return 'missing_endwhile';
    if (rawMessage.includes('ENDCASE')) return 'missing_endcase';
    if (rawMessage.includes('ENDPROCEDURE')) return 'missing_endprocedure';
    if (rawMessage.includes('ENDFUNCTION')) return 'missing_endfunction';
    return 'unclosed_block';
  }

  // Stray closers with no matching opener.
  if (/no viable alternative at input '(?:\\n|\n)?NEXT/.test(rawMessage)) return 'stray_next';
  if (/no viable alternative at input '(?:\\n|\n)?ENDIF/.test(rawMessage)) return 'stray_endif';
  if (/no viable alternative at input '(?:\\n|\n)?UNTIL/.test(rawMessage)) return 'stray_until';
  if (/no viable alternative at input '(?:\\n|\n)?ELSE/.test(rawMessage)) return 'stray_else';
  const strayFromToken = rawMessage.match(/input '([^']+)'/)?.[1];
  if (strayFromToken) {
    const stray = strayCloserHint(cleanToken(strayFromToken) || strayFromToken);
    if (stray) return stray.category;
  }

  // IF missing THEN.
  if (rawMessage.includes('ENDIF') && rawMessage.includes('THEN')) return 'missing_then';

  // Wrong-language keyword (Portugol / JS-ish) via the offending token.
  const rawToken = rawMessage.match(/input '([^']+)'/)?.[1];
  if (rawToken) {
    const token = rawToken.replace(/^(?:\\n|\r|\n|\s)+|(?:\\n|\r|\n|\s)+$/g, '');
    const key = token.replace(/\($/, '').toLowerCase();
    if (PORTUGOL_TOKENS[key]) return 'portugol_syntax';
    if (WRONG_TOKENS[key] || WRONG_TOKENS[token]) return 'wrong_language_keyword';
    // Incomplete line: newline where a value/expression was expected.
    if ((token === '\\n' || token === '\n' || token === '') && /\{NOT|expecting TO\b/.test(rawMessage))
      return 'incomplete_line';
  }

  if (rawMessage.includes('no viable alternative')) return 'no_viable_alternative';
  if (rawMessage.includes('mismatched input') || rawMessage.includes('extraneous input')) return 'mismatched_input';
  if (rawMessage.includes('missing')) return 'missing_token';
  return 'other_parse';
}

export function categorizeRuntimeError(rawMessage: string): string {
  if (/Variable 'console' is not defined/.test(rawMessage)) return 'console_log';
  if (/Variable '[^']+' is not defined/.test(rawMessage)) return 'undeclared_variable';
  if (/Cannot assign to constant/.test(rawMessage)) return 'const_reassignment';
  if (/is not an array/.test(rawMessage)) return 'not_an_array';
  if (/is an array; use indexing/.test(rawMessage)) return 'array_needs_index';
  if (/Array index -?\d+ out of bounds/.test(rawMessage)) return 'array_out_of_bounds';
  if (/Array expects \d+ index/.test(rawMessage)) return 'array_dim_mismatch';
  if (/Division by zero/.test(rawMessage)) return 'division_by_zero';
  if (/Procedure '[^']+' is not defined/.test(rawMessage)) return 'procedure_undefined';
  if (/Function '[^']+' is not defined/.test(rawMessage)) return 'function_undefined';
  if (/Cannot access private (?:method|property)/.test(rawMessage)) return 'private_access';
  if (/has no field/.test(rawMessage)) return 'record_no_field';
  if (/CASE cannot operate on array/.test(rawMessage)) return 'case_on_array';
  return 'other_runtime';
}
