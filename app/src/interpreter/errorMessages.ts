/**
 * Converts raw ANTLR parse errors and runtime errors into constructive,
 * student-friendly messages with actionable suggestions.
 *
 * Raw messages are still sent to PostHog for analysis; this layer only
 * affects what the student sees in the terminal.
 */

// ── Helpers ────────────────────────────────────────────────────────────────

/** Extract the offending token from ANTLR messages like: mismatched input 'X' expecting ... */
function extractToken(msg: string): string | null {
  const m = msg.match(/input '([^']+)'/);
  return m ? m[1] : null;
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

const KEYWORDS = [
  'DECLARE', 'CONSTANT', 'IF', 'THEN', 'ELSE', 'ENDIF', 'CASE', 'OF',
  'OTHERWISE', 'ENDCASE', 'WHILE', 'DO', 'ENDWHILE', 'FOR', 'TO', 'STEP',
  'NEXT', 'REPEAT', 'UNTIL', 'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION',
  'RETURNS', 'ENDFUNCTION', 'RETURN', 'CALL', 'OUTPUT', 'INPUT', 'AND',
  'OR', 'NOT', 'MOD', 'DIV', 'TRUE', 'FALSE', 'OPENFILE', 'READFILE',
  'WRITEFILE', 'CLOSEFILE', 'ARRAY', 'INTEGER', 'REAL', 'BOOLEAN', 'STRING', 'CHAR',
];

/** If `token` looks like a misspelled keyword, return the closest match. */
function nearestKeyword(token: string): string | null {
  const upper = token.toUpperCase();
  // Exact match (different case) → definitely a casing issue
  if (KEYWORDS.includes(upper)) return upper;
  // Near match (distance ≤ 2 for words > 3 chars)
  if (token.length > 3) {
    let best: string | null = null;
    let bestDist = Infinity;
    for (const kw of KEYWORDS) {
      const d = levenshtein(upper, kw);
      if (d < bestDist && d <= 2) { bestDist = d; best = kw; }
    }
    return best;
  }
  return null;
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
  THEN:         'THEN after the IF condition\n  Example: IF x > 0 THEN',
  DO:           'DO after the WHILE condition\n  Example: WHILE x < 10 DO',
};

/** Non-standard tokens students often write by accident */
const WRONG_TOKENS: Record<string, string> = {
  print:   'Use OUTPUT instead of "print"\n  Example: OUTPUT "Hello"',
  console: 'Use OUTPUT instead of "console.log"\n  Example: OUTPUT value',
  echo:    'Use OUTPUT instead of "echo"\n  Example: OUTPUT "Hello"',
  log:     'Use OUTPUT instead of "log"\n  Example: OUTPUT value',
  printf:  'Use OUTPUT instead of "printf"\n  Example: OUTPUT "Hello"',
  var:     'Use DECLARE instead of "var"\n  Example: DECLARE x : INTEGER',
  let:     'Use DECLARE instead of "let"\n  Example: DECLARE x : INTEGER',
  const:   'Use CONSTANT instead of "const"\n  Example: CONSTANT PI = 3.14',
  def:     'Use PROCEDURE or FUNCTION instead of "def"',
  return:  'Use RETURN (uppercase)\n  Example: RETURN value',
  begin:   'No BEGIN needed — just write your statements directly',
  end:     'Use the specific closing keyword: ENDIF, ENDWHILE, ENDFUNCTION, etc.',
  loop:    'Use WHILE, FOR, or REPEAT instead of "loop"',
  ':=':    'Use ← (or <-) for assignment, not :=\n  Example: x ← 5',
};

export function humanizeParseError(rawMessage: string): string {
  const lower = rawMessage.toLowerCase();

  // ── token recognition error (lexer — truly unknown chars) ──────────────
  const tokenRecog = rawMessage.match(/token recognition error at: '([^']+)'/);
  if (tokenRecog) {
    const ch = tokenRecog[1];
    if (ch === '{' || ch === '}') return 'Unexpected "{" or "}" — use IF/WHILE/FOR blocks, not curly braces';
    if (ch === ';') return 'Unexpected ";" — pseudocode does not use semicolons';
    if (ch === '#') return 'Use // for comments, not #\n  Example: // this is a comment';
    if (ch === '!' || ch === '!=') return 'Use <> for "not equal to", not "!="\n  Example: IF x <> 0 THEN';
    if (ch === '==') return 'Use = for comparison in pseudocode, not ==\n  Example: IF x = 5 THEN';
    if (ch === '&&') return 'Use AND instead of &&\n  Example: IF a > 0 AND b > 0 THEN';
    if (ch === '||') return 'Use OR instead of ||\n  Example: IF a = 0 OR b = 0 THEN';
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
    const token = extractToken(rawMessage);

    // EOF mismatches → missing closing keyword
    if (token === '<EOF>') {
      for (const [kw, hint] of Object.entries(SYNTAX_HINTS)) {
        if (rawMessage.includes(kw)) return `Missing ${hint}`;
      }
      return 'Unexpected end of program — you may be missing a closing keyword (ENDIF, ENDWHILE, etc.)';
    }

    if (token) {
      const tokenUpper = token.toUpperCase();

      // Wrong-token list (non-pseudocode keywords)
      const wrongHint = WRONG_TOKENS[token.toLowerCase()] ?? WRONG_TOKENS[token];
      if (wrongHint) return wrongHint;

      // Casing issue or near-misspelling
      const nearest = nearestKeyword(token);
      if (nearest && nearest !== tokenUpper) {
        return `"${token}" is not recognised — did you mean ${nearest}? Keywords must be uppercase.`;
      }
      if (nearest === tokenUpper && token !== nearest) {
        return `"${token}" should be uppercase: ${nearest}`;
      }

      // Expecting specific things
      if (rawMessage.includes("'THEN'")) return `Missing THEN after the IF condition\n  Example: IF ${token} THEN`;
      if (rawMessage.includes("'DO'")) return `Missing DO after the WHILE condition\n  Example: WHILE ${token} DO`;
      if (rawMessage.includes("'OF'")) return `Missing OF in CASE statement\n  Example: CASE OF variable`;
    }
  }

  // ── no viable alternative ──────────────────────────────────────────────
  if (lower.includes('no viable alternative')) {
    const token = extractToken(rawMessage);
    if (token) {
      const nearest = nearestKeyword(token);
      if (nearest) return `"${token}" is not recognised — did you mean ${nearest}?`;
    }
    return 'Unexpected input — check the syntax on this line';
  }

  // ── fallback: strip ANTLR token-set noise ─────────────────────────────
  // ANTLR dumps full expected-set like "expecting {T__0, T__1, 'THEN', ...}"
  // Trim it to just the human-readable part
  const cleaned = rawMessage
    .replace(/expecting \{[^}]+\}/g, '')
    .replace(/expecting '[^']+'/g, '')
    .trim();
  return cleaned || rawMessage;
}

// ── Runtime error humanization ──────────────────────────────────────────────

export function humanizeRuntimeError(rawMessage: string): string {
  // Variable not defined
  const notDefined = rawMessage.match(/Variable '([^']+)' is not defined/);
  if (notDefined) {
    const name = notDefined[1];
    return `'${name}' has not been declared.\n  Declare it before use: DECLARE ${name} : INTEGER`;
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
    return `Procedure '${procUndef[1]}' is not defined. Check the spelling, or define it:\n  PROCEDURE ${procUndef[1]}()\n    ...\n  ENDPROCEDURE`;
  }

  // Function not defined
  const funcUndef = rawMessage.match(/Function '([^']+)' is not defined/);
  if (funcUndef) {
    return `Function '${funcUndef[1]}' is not defined. Check the spelling, or define it:\n  FUNCTION ${funcUndef[1]}() RETURNS INTEGER\n    ...\n  ENDFUNCTION`;
  }

  // CASE on array
  if (rawMessage.includes('CASE cannot operate on array')) {
    return 'CASE cannot be used directly on an array. Access an element first.\n  Example: CASE OF arr[i]';
  }

  return rawMessage;
}
