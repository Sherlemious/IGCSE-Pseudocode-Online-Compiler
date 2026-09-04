import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { StreamParser } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { KEYWORDS as keywords, TYPES as types, BOOLEANS as booleans } from './tokens';

// Create a simple parser for pseudocode
// This is a fallback approach using StreamLanguage API

interface PseudocodeState {
  inString: boolean;
  inChar: boolean;
  inComment: boolean;
}

const pseudocodeParser: StreamParser<PseudocodeState> = {
  startState: () => ({
    inString: false,
    inChar: false,
    inComment: false,
  }),

  token: (stream, state) => {
    // Handle comments
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'lineComment';
    }

    // Handle strings
    if (!state.inString && !state.inChar) {
      if (stream.match('"')) {
        state.inString = true;
        return 'string';
      }
      if (stream.match("'")) {
        state.inChar = true;
        return 'string';
      }
    }

    if (state.inString) {
      if (stream.match('"')) {
        state.inString = false;
        return 'string';
      }
      stream.next();
      return 'string';
    }

    if (state.inChar) {
      if (stream.match("'")) {
        state.inChar = false;
        return 'string';
      }
      stream.next();
      return 'string';
    }

    // Handle numbers (date literals like 02/01/2005 first, then reals, then integers)
    if (stream.match(/^\d{2}\/\d{2}\/\d{4}/)) return 'number';
    if (stream.match(/^\d+\.\d+/)) return 'number';
    if (stream.match(/^\d+/)) return 'number';

    // Handle operators
    if (stream.match(/^(<-|←|<>|<=|>=|[=<>+\-*/^&(),[\]:.])/)) {
      return 'operator';
    }

    // Handle keywords and identifiers
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      const word = stream.current().toUpperCase();

      if (keywords.includes(word)) {
        return 'keyword';
      }

      if (types.includes(word)) {
        return 'typeName';
      }

      if (booleans.includes(word)) {
        return 'bool';
      }

      return 'variableName';
    }

    // Skip whitespace
    if (stream.match(/^\s+/)) {
      return null;
    }

    stream.next();
    return null;
  },

  blankLine: () => {},

  copyState: (state) => ({
    inString: state.inString,
    inChar: state.inChar,
    inComment: state.inComment,
  }),
  tokenTable: {
    keyword: tags.keyword,
    typeName: tags.typeName,
    variableName: tags.variableName,
    string: tags.string,
    number: tags.number,
    bool: tags.bool,
    operator: tags.operator,
    lineComment: tags.lineComment,
    comment: tags.comment,
  },
};

export const pseudocode = StreamLanguage.define(pseudocodeParser);

export function pseudocodeLanguage() {
  return new LanguageSupport(pseudocode);
}
