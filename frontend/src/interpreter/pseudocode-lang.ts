import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { StreamParser } from '@codemirror/language';

// Create a simple parser for pseudocode
// This is a fallback approach using StreamLanguage API

const types = ['INTEGER', 'REAL', 'CHAR', 'STRING', 'BOOLEAN'];
const booleans = ['TRUE', 'FALSE'];
// Define pseudocode keywords based on ANTLR grammar
const keywords = [
  'DECLARE',
  'CONSTANT',
  'INPUT',
  'OUTPUT',
  'PRINT',
  'IF',
  'THEN',
  'ELSE',
  'ELSEIF',
  'ENDIF',
  'CASE',
  'OF',
  'OTHERWISE',
  'ENDCASE',
  'FOR',
  'TO',
  'STEP',
  'NEXT',
  'WHILE',
  'DO',
  'ENDWHILE',
  'REPEAT',
  'UNTIL',
  'PROCEDURE',
  'ENDPROCEDURE',
  'FUNCTION',
  'ENDFUNCTION',
  'RETURNS',
  'RETURN',
  'CALL',
  'ARRAY',
  'AND',
  'OR',
  'NOT',
  'MOD',
  'DIV',
  'OPENFILE',
  'READFILE',
  'WRITEFILE',
  'CLOSEFILE',
  'READ',
  'WRITE',
  'APPEND',
];

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

    // Handle numbers
    if (stream.match(/^\d+\.\d+/)) return 'number';
    if (stream.match(/^\d+/)) return 'number';

    // Handle operators
    if (stream.match(/^(<-|←|<>|<=|>=|[=<>+\-*/^&(),[\]:])/)) {
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
};

export const pseudocode = StreamLanguage.define(pseudocodeParser);

export function pseudocodeLanguage() {
  return new LanguageSupport(pseudocode);
}
