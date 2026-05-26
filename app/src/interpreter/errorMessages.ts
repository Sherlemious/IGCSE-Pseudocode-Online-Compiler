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

  if (/no viable alternative at input '(?:\\n|\n)?ELSE'/.test(rawMessage)) {
    return (
      'ELSE must belong to an open IF block. Check the IF line and close the block with ENDIF.\n' +
      '  Example:\n' +
      '    IF Mark >= 50 THEN\n' +
      '      OUTPUT "Pass"\n' +
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

const KEYWORDS = [
  'DECLARE', 'CONSTANT', 'IF', 'THEN', 'ELSE', 'ENDIF', 'CASE', 'OF',
  'OTHERWISE', 'ENDCASE', 'WHILE', 'DO', 'ENDWHILE', 'FOR', 'TO', 'STEP',
  'NEXT', 'REPEAT', 'UNTIL', 'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION',
  'RETURNS', 'ENDFUNCTION', 'RETURN', 'CALL', 'OUTPUT', 'PRINT', 'INPUT', 'AND',
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

export function humanizeParseError(rawMessage: string): string {
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
    if (ch === '!' || ch === '!=') return 'Use <> for "not equal to", not "!="\n  Example: IF x <> 0 THEN';
    if (ch === '==') return 'Use = for comparison in pseudocode, not ==\n  Example: IF x = 5 THEN';
    if (ch === '&&') return 'Use AND instead of &&\n  Example: IF a > 0 AND b > 0 THEN';
    if (ch === '||') return 'Use OR instead of ||\n  Example: IF a = 0 OR b = 0 THEN';
    if (ch === '.') return 'The `.` character is not Cambridge IGCSE syntax here. Avoid code like `console.log` or `name.length`.\n  Use OUTPUT for printing: OUTPUT "Hello"\n  Decimal numbers are still valid when written as one number, such as 3.14.';
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

      // Comma inside single-dimension brackets (e.g. INPUT arr[i, j])
      if (token === ',' && rawMessage.includes("']'"))
        return 'Unexpected `,` inside `[...]`. For 2D arrays use `array[row, col]`; INPUT only supports 1D: `INPUT arr[i]`';

      // Newline token = incomplete expression (the line ended before a value was given)
      if (token === '\\n' || token === '\n')
        return 'This line seems incomplete — a value or expression is expected here.';

      // Known keyword on the same line as another statement
      if (rawMessage.includes('NEWLINE') && KEYWORDS.includes(token.toUpperCase()))
        return `${token.toUpperCase()} must be on its own line — put each statement on a separate line`;

      // Casing issue or near-misspelling
      const nearest = nearestKeyword(token);
      if (nearest) {
        return `"${token}" is not recognised — did you mean ${nearest}?`;
      }

      // Expecting specific things
      if (rawMessage.includes("'DO'")) return `Missing DO after the WHILE condition\n  Example: WHILE ${token} DO`;
      if (rawMessage.includes("'OF'")) return `Missing OF in CASE statement\n  Example: CASE OF variable`;
    }
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
