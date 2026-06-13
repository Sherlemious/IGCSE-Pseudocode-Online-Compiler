import React from 'react';
import { KEYWORDS, TYPES, BOOLEANS } from '../../interpreter/tokens';

// Static pseudocode syntax highlighter for docs code blocks.
// Mirrors the tokenizer rules in interpreter/pseudocode-lang.ts and uses the
// same --color-syntax-* CSS variables as the CodeMirror editor theme, so docs
// code looks identical to code in the editor.

type TokenKind =
  | 'comment'
  | 'string'
  | 'number'
  | 'operator'
  | 'keyword'
  | 'type'
  | 'boolean'
  | 'variable';

const TOKEN_STYLES: Record<TokenKind, React.CSSProperties> = {
  comment: { color: 'var(--color-syntax-comment)', fontStyle: 'italic' },
  string: { color: 'var(--color-syntax-string)' },
  number: { color: 'var(--color-syntax-number)' },
  operator: { color: 'var(--color-syntax-operator)' },
  keyword: { color: 'var(--color-syntax-keyword)', fontWeight: 600 },
  type: { color: 'var(--color-syntax-type)', fontWeight: 500 },
  boolean: { color: 'var(--color-syntax-boolean)', fontWeight: 600 },
  variable: { color: 'var(--color-syntax-variable)' },
};

const DATE_RE = /^\d{2}\/\d{2}\/\d{4}/;
const REAL_RE = /^\d+\.\d+/;
const INT_RE = /^\d+/;
const OPERATOR_RE = /^(<-|←|<>|<=|>=|[=<>+\-*/^&(),[\]:.])/;
const WORD_RE = /^[a-zA-Z_][a-zA-Z0-9_]*/;

function tokenizeLine(line: string): { text: string; kind: TokenKind | null }[] {
  const tokens: { text: string; kind: TokenKind | null }[] = [];
  let rest = line;

  const push = (text: string, kind: TokenKind | null) => {
    tokens.push({ text, kind });
    rest = rest.slice(text.length);
  };

  while (rest.length > 0) {
    if (rest.startsWith('//')) {
      push(rest, 'comment');
      continue;
    }
    if (rest[0] === '"' || rest[0] === "'") {
      const quote = rest[0];
      const end = rest.indexOf(quote, 1);
      // Unterminated string → rest of line
      push(end === -1 ? rest : rest.slice(0, end + 1), 'string');
      continue;
    }
    const date = rest.match(DATE_RE);
    if (date) {
      push(date[0], 'number');
      continue;
    }
    const real = rest.match(REAL_RE);
    if (real) {
      push(real[0], 'number');
      continue;
    }
    const int = rest.match(INT_RE);
    if (int) {
      push(int[0], 'number');
      continue;
    }
    const op = rest.match(OPERATOR_RE);
    if (op) {
      push(op[0], 'operator');
      continue;
    }
    const word = rest.match(WORD_RE);
    if (word) {
      const upper = word[0].toUpperCase();
      if (KEYWORDS.includes(upper)) push(word[0], 'keyword');
      else if (TYPES.includes(upper)) push(word[0], 'type');
      else if (BOOLEANS.includes(upper)) push(word[0], 'boolean');
      else push(word[0], 'variable');
      continue;
    }
    push(rest[0], null);
  }

  return tokens;
}

export default function highlightPseudocode(code: string): React.ReactNode {
  return code.split('\n').map((line, lineIdx) => (
    <React.Fragment key={lineIdx}>
      {lineIdx > 0 && '\n'}
      {tokenizeLine(line).map((token, i) =>
        token.kind === null ? (
          token.text
        ) : (
          <span key={i} style={TOKEN_STYLES[token.kind]}>
            {token.text}
          </span>
        )
      )}
    </React.Fragment>
  ));
}
