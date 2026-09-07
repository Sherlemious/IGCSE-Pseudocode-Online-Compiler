import {
  type Completion,
  type CompletionContext,
  type CompletionResult,
  snippetCompletion,
} from '@codemirror/autocomplete';
import { type Text } from '@codemirror/state';
import { BUILTIN_NAMES, BUILTIN_SIGNATURES } from './builtinSignatures';
import { BOOLEANS, KEYWORDS, TYPES } from './tokens';

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

/** Block openers offered as snippets — omitted from the bare-keyword list. */
const SNIPPET_OPENERS = new Set([
  'DECLARE',
  'CONSTANT',
  'INPUT',
  'OUTPUT',
  'IF',
  'ELSEIF',
  'CASE',
  'FOR',
  'WHILE',
  'REPEAT',
  'PROCEDURE',
  'FUNCTION',
  'TYPE',
  'CLASS',
]);

const RESERVED = new Set(
  [...KEYWORDS, ...TYPES, ...BOOLEANS, ...BUILTIN_NAMES].map((w) => w.toUpperCase()),
);

function snippet(template: string, spec: Completion): Completion {
  return snippetCompletion(template, spec);
}

const FILE_MODES: Completion[] = [
  { label: 'READ', type: 'keyword', boost: 8 },
  { label: 'WRITE', type: 'keyword', boost: 8 },
  { label: 'APPEND', type: 'keyword', boost: 8 },
  { label: 'RANDOM', type: 'keyword', boost: 8, detail: 'random-access file' },
];

const TYPE_COMPLETIONS: Completion[] = [
  ...TYPES.map((label) => ({ label, type: 'type', boost: 6 }) satisfies Completion),
  snippet('ARRAY[1:${n}] OF ${INTEGER}', {
    label: 'ARRAY',
    type: 'type',
    boost: 5,
    detail: 'ARRAY[1:n] OF …',
  }),
];

const BUILTIN_SNIPPETS: Record<string, string> = {
  LENGTH: 'LENGTH(${str})',
  LCASE: 'LCASE(${str})',
  UCASE: 'UCASE(${str})',
  SUBSTRING: 'SUBSTRING(${str}, ${startPos}, ${length})',
  MID: 'MID(${str}, ${startPos}, ${length})',
  LEFT: 'LEFT(${str}, ${length})',
  RIGHT: 'RIGHT(${str}, ${length})',
  ROUND: 'ROUND(${num})',
  INT: 'INT(${num})',
  RANDOM: 'RANDOM()',
  NUM_TO_STRING: 'NUM_TO_STRING(${num})',
  STRING_TO_NUM: 'STRING_TO_NUM(${str})',
  ASC: 'ASC(${char})',
  CHR: 'CHR(${asciiCode})',
  IS_NUM: 'IS_NUM(${str})',
  EOF: 'EOF(${filename})',
  RAND: 'RAND(${x})',
};

const BLOCK_SNIPPETS: Completion[] = [
  snippet('IF ${condition} THEN\n    ${}\nENDIF', {
    label: 'IF',
    type: 'keyword',
    detail: 'IF … ENDIF',
    boost: 12,
  }),
  snippet('ELSEIF ${condition} THEN\n    ${}', {
    label: 'ELSEIF',
    type: 'keyword',
    detail: 'ELSEIF … THEN',
    boost: 8,
  }),
  snippet('CASE ${expr} OF\n    ${value}: ${}\n    OTHERWISE: ${}\nENDCASE', {
    label: 'CASE',
    type: 'keyword',
    detail: 'CASE … ENDCASE',
    boost: 10,
  }),
  snippet('FOR ${i} <- ${1} TO ${n}\n    ${}\nNEXT ${i}', {
    label: 'FOR',
    type: 'keyword',
    detail: 'FOR … NEXT',
    boost: 12,
  }),
  snippet('WHILE ${condition} DO\n    ${}\nENDWHILE', {
    label: 'WHILE',
    type: 'keyword',
    detail: 'WHILE … ENDWHILE',
    boost: 12,
  }),
  snippet('REPEAT\n    ${}\nUNTIL ${condition}', {
    label: 'REPEAT',
    type: 'keyword',
    detail: 'REPEAT … UNTIL',
    boost: 12,
  }),
  snippet('PROCEDURE ${name}()\n    ${}\nENDPROCEDURE', {
    label: 'PROCEDURE',
    type: 'keyword',
    detail: 'PROCEDURE … ENDPROCEDURE',
    boost: 10,
  }),
  snippet('FUNCTION ${name}() RETURNS ${INTEGER}\n    ${}\nENDFUNCTION', {
    label: 'FUNCTION',
    type: 'keyword',
    detail: 'FUNCTION … ENDFUNCTION',
    boost: 10,
  }),
  snippet('DECLARE ${name} : ${INTEGER}', {
    label: 'DECLARE',
    type: 'keyword',
    detail: 'DECLARE name : TYPE',
    boost: 12,
  }),
  snippet('CONSTANT ${name} <- ${value}', {
    label: 'CONSTANT',
    type: 'keyword',
    detail: 'CONSTANT name <- value',
    boost: 10,
  }),
  snippet('TYPE ${Name}\n    DECLARE ${field} : ${INTEGER}\nENDTYPE', {
    label: 'TYPE',
    type: 'keyword',
    detail: 'TYPE … ENDTYPE',
    boost: 8,
  }),
  snippet('CLASS ${Name}\n    PUBLIC\n        PROCEDURE NEW()\n            ${}\n        ENDPROCEDURE\n    PRIVATE\nENDCLASS', {
    label: 'CLASS',
    type: 'keyword',
    detail: 'CLASS … ENDCLASS',
    boost: 8,
  }),
  snippet('INPUT ${variable}', {
    label: 'INPUT',
    type: 'keyword',
    detail: 'INPUT variable',
    boost: 10,
  }),
  snippet('OUTPUT ${}', {
    label: 'OUTPUT',
    type: 'keyword',
    detail: 'OUTPUT …',
    boost: 10,
  }),
];

const KEYWORD_COMPLETIONS: Completion[] = KEYWORDS.filter(
  (kw) => !SNIPPET_OPENERS.has(kw) && kw !== 'RANDOM',
).map((label) => ({ label, type: 'keyword' }));

const BOOLEAN_COMPLETIONS: Completion[] = BOOLEANS.map((label) => ({
  label,
  type: 'constant',
  boost: 2,
}));

const BUILTIN_COMPLETIONS: Completion[] = BUILTIN_NAMES.map((name) =>
  snippet(BUILTIN_SNIPPETS[name] ?? `${name}()`, {
    label: name,
    type: 'function',
    detail: 'built-in',
    info: BUILTIN_SIGNATURES[name],
    boost: 4,
  }),
);

const LOCAL_PATTERNS: RegExp[] = [
  /\bDECLARE\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
  /\bCONSTANT\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
  /\bPROCEDURE\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
  /\bFUNCTION\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
  /\bFOR\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:<-|←)/gi,
  /\bTYPE\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
  /\bCLASS\s+([A-Za-z_][A-Za-z0-9_]*)/gi,
];

function localCompletions(doc: Text): Completion[] {
  const text = doc.toString();
  const found = new Map<string, string>();
  for (const re of LOCAL_PATTERNS) {
    re.lastIndex = 0;
    for (const match of text.matchAll(re)) {
      const name = match[1];
      if (!name || RESERVED.has(name.toUpperCase())) continue;
      if (!found.has(name.toUpperCase())) found.set(name.toUpperCase(), name);
    }
  }
  return [...found.values()].map((label) => ({
    label,
    type: 'variable',
    boost: -4,
  }));
}

function inCommentOrString(linePrefix: string): boolean {
  let inString = false;
  let inChar = false;
  for (let i = 0; i < linePrefix.length; i++) {
    const ch = linePrefix[i];
    if (!inString && !inChar && ch === '/' && linePrefix[i + 1] === '/') return true;
    if (!inChar && ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString && ch === "'") {
      inChar = !inChar;
    }
  }
  return inString || inChar;
}

function beforeTypedPrefix(linePrefix: string, typed: string): string {
  if (!typed) return linePrefix;
  return linePrefix.endsWith(typed) ? linePrefix.slice(0, -typed.length) : linePrefix;
}

function isTypeContext(beforePrefix: string): boolean {
  return /:\s*$/.test(beforePrefix) || /\bRETURNS\s+$/i.test(beforePrefix);
}

function isFileModeContext(beforePrefix: string): boolean {
  return /\bOPENFILE\b.*\bFOR\s+$/i.test(beforePrefix);
}

const DEFAULT_OPTIONS: Completion[] = [
  ...BLOCK_SNIPPETS,
  ...KEYWORD_COMPLETIONS,
  ...TYPES.map((label) => ({ label, type: 'type' }) satisfies Completion),
  ...BOOLEAN_COMPLETIONS,
  ...BUILTIN_COMPLETIONS,
];

export function pseudocodeCompletionSource(context: CompletionContext): CompletionResult | null {
  const line = context.state.doc.lineAt(context.pos);
  const linePrefix = line.text.slice(0, context.pos - line.from);
  if (inCommentOrString(linePrefix)) return null;

  const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/);
  if (!word && !context.explicit) return null;

  const from = word ? word.from : context.pos;
  const typed = word?.text ?? '';
  const beforePrefix = beforeTypedPrefix(linePrefix, typed);

  if (isTypeContext(beforePrefix)) {
    return { from, options: TYPE_COMPLETIONS, validFor: IDENT };
  }
  if (isFileModeContext(beforePrefix)) {
    return { from, options: FILE_MODES, validFor: IDENT };
  }

  return {
    from,
    options: [...DEFAULT_OPTIONS, ...localCompletions(context.state.doc)],
    validFor: IDENT,
  };
}
