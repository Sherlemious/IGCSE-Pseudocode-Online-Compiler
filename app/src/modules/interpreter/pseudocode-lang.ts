import {
  StreamLanguage,
  LanguageSupport,
  StreamParser,
  IndentContext,
  getIndentation,
  indentService,
  indentString,
  indentUnit,
} from '@codemirror/language';
import type { Extension, StateCommand, Transaction } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { insertNewlineAndIndent } from '@codemirror/commands';
import { tags } from '@lezer/highlight';
import { KEYWORDS as keywords, TYPES as types, BOOLEANS as booleans } from './tokens';
import { pseudocodeCompletionSource } from './pseudocode-completions';
import { DEFAULT_INDENT, dedentsSelf, indentsNext } from './indentRules';

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

/** How far up auto-indent looks for a line of code before giving up. */
const MAX_INDENT_SCAN_LINES = 200;

/**
 * The indentation for the line starting at `pos`, relative to the nearest line of code
 * above it (blank and comment lines are skipped): one level deeper after a block opener
 * or ELSE, one level out for a closer or ELSE. Building on the student's own indentation
 * rather than recomputing depth keeps 3-space code (the Cambridge guide's style) intact.
 */
export function pseudocodeIndent(cx: IndentContext, pos: number): number {
  let line = cx.lineAt(pos, 1);
  const textAfter = line.text.slice(pos - line.from).trim();
  let base = 0;
  for (let scanned = 0; line.from > 0 && scanned < MAX_INDENT_SCAN_LINES; scanned++) {
    // With a simulated break (Enter) the text before it on the same line comes first.
    let prev = cx.lineAt(line.from, -1);
    if (prev.from === line.from) prev = cx.lineAt(line.from - 1, -1);
    line = prev;
    const trimmed = prev.text.trim();
    if (trimmed === '' || trimmed.startsWith('//')) continue;
    base = cx.countColumn(prev.text, prev.text.search(/\S/));
    if (indentsNext(trimmed)) base += cx.unit;
    break;
  }
  if (textAfter && !textAfter.startsWith('//') && dedentsSelf(textAfter)) base -= cx.unit;
  return Math.max(0, base);
}

/**
 * Enter on a closer/ELSE line that is not where auto-indent would put it (a bare `NEXT`,
 * or a pasted/lowercase `endif` that `indentOnInput` never saw) snaps that line back to
 * its block before breaking it, as one undoable edit. Otherwise falls through to the
 * default Enter.
 */
export const reindentCloserThenNewline: StateCommand = ({ state, dispatch }) => {
  if (state.readOnly || state.selection.ranges.length > 1 || !state.selection.main.empty) return false;
  const line = state.doc.lineAt(state.selection.main.head);
  const trimmed = line.text.trim();
  if (!trimmed || trimmed.startsWith('//') || !dedentsSelf(trimmed)) return false;
  const indent = getIndentation(state, line.from);
  if (indent == null) return false;
  const current = /^\s*/.exec(line.text)![0];
  const wanted = indentString(state, indent);
  if (current === wanted) return false;

  const reindent = state.update({ changes: { from: line.from, to: line.from + current.length, insert: wanted } });
  const newline: Transaction[] = [];
  insertNewlineAndIndent({ state: reindent.state, dispatch: (tr) => newline.push(tr) });
  const tr = newline[0];
  if (!tr) return false;
  dispatch(
    state.update({
      changes: reindent.changes.compose(tr.changes),
      selection: tr.newSelection,
      scrollIntoView: true,
      userEvent: 'input',
    }),
  );
  return true;
};

export function pseudocodeLanguage() {
  return new LanguageSupport(pseudocode, [
    pseudocode.data.of({ autocomplete: pseudocodeCompletionSource }),
    indentUnit.of(DEFAULT_INDENT),
  ]);
}

/**
 * Block-aware auto-indent (the "Auto-indent" editor setting). Without it, Enter just
 * copies the previous line's indentation.
 */
export function pseudocodeAutoIndent(): Extension {
  return [
    // Re-indent a closer as soon as it is typed. NEXT/UNTIL wait for the following
    // space so a name like `NextNum` or `UntilDone` never jumps mid-word.
    pseudocode.data.of({
      indentOnInput: /^\s*(END(IF|WHILE|CASE|FUNCTION|PROCEDURE|TYPE|CLASS)|ELSE(IF)?|(NEXT|UNTIL)\s)$/i,
    }),
    indentService.of(pseudocodeIndent),
    keymap.of([{ key: 'Enter', run: reindentCloserThenNewline }]),
  ];
}
