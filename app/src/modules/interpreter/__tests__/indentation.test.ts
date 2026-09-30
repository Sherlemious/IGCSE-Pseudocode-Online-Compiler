import { describe, expect, it } from 'vitest';
import { EditorSelection, EditorState, type Transaction } from '@codemirror/state';
import { indentOnInput } from '@codemirror/language';
import { insertNewlineAndIndent, undo, history } from '@codemirror/commands';
import { pseudocodeLanguage, reindentCloserThenNewline } from '../pseudocode-lang';
import { formatPseudocode } from '../formatter';

/** `|` marks the cursor. */
function stateAt(docWithCursor: string) {
  const cursor = docWithCursor.indexOf('|');
  const doc = docWithCursor.replace('|', '');
  return EditorState.create({
    doc,
    selection: EditorSelection.cursor(cursor),
    extensions: [pseudocodeLanguage(), indentOnInput(), history()],
  });
}

/** Presses Enter the way the editor does: our command first, then the default. */
function enter(state: EditorState): EditorState {
  let next: Transaction | null = null;
  const dispatch = (tr: Transaction) => { next = tr; };
  if (!reindentCloserThenNewline({ state, dispatch })) insertNewlineAndIndent({ state, dispatch });
  return (next as Transaction | null)!.state;
}

/** Types `text` one character at a time as `input.type` events. */
function type(state: EditorState, text: string): EditorState {
  for (const ch of text) state = state.update(state.replaceSelection(ch), { userEvent: 'input.type' }).state;
  return state;
}

function cursorLine(state: EditorState): string {
  return state.doc.lineAt(state.selection.main.head).text;
}

describe('Enter indents after a block opener', () => {
  const openers = [
    'IF x > 1 THEN',
    'FOR i <- 1 TO 3',
    'WHILE x < 10 DO',
    'REPEAT',
    'CASE OF x',
    'PROCEDURE P()',
    'PUBLIC FUNCTION F() RETURNS INTEGER',
    'TYPE TRec',
    'CLASS A INHERITS B',
    'ELSE',
    'if lower then',
  ];
  for (const line of openers) {
    it(line, () => {
      expect(cursorLine(enter(stateAt(`${line}|`)))).toBe('    ');
    });
  }

  it('keeps the indent after a plain statement', () => {
    expect(cursorLine(enter(stateAt('IF x THEN\n    OUTPUT x|')))).toBe('    ');
  });

  it('does not indent after a one-line TYPE definition', () => {
    expect(cursorLine(enter(stateAt('TYPE Colour = (Red, Green)|')))).toBe('');
  });

  it('nests', () => {
    expect(cursorLine(enter(stateAt('FOR i <- 1 TO 3\n    IF i > 1 THEN|')))).toBe('        ');
  });

  it("builds on the student's own 3-space indentation", () => {
    expect(cursorLine(enter(stateAt('IF a THEN\n   WHILE b|')))).toBe('       ');
  });

  it('skips blank and comment lines when finding the line above', () => {
    const state = enter(stateAt('IF x THEN\n\n// ENDIF here later\n|'));
    expect(cursorLine(state)).toBe('    ');
  });

  it('splitting before a closer puts the closer at the block level', () => {
    const state = enter(stateAt('IF x THEN\n    OUTPUT x|ENDIF'));
    expect(cursorLine(state)).toBe('ENDIF');
  });
});

describe('typing a closer snaps it to its block', () => {
  const cases: Array<[string, string, string]> = [
    ['IF x THEN\n    OUTPUT x\n    |', 'ENDIF', 'ENDIF'],
    ['IF x THEN\n    OUTPUT x\n    |', 'ELSE', 'ELSE'],
    ['WHILE x DO\n    x <- x - 1\n    |', 'ENDWHILE', 'ENDWHILE'],
    ['FOR i <- 1 TO 3\n    OUTPUT i\n    |', 'NEXT ', 'NEXT '],
    ['REPEAT\n    x <- x + 1\n    |', 'UNTIL ', 'UNTIL '],
    ['    IF x THEN\n        OUTPUT x\n        |', 'endif', '    endif'],
  ];
  for (const [doc, typed, expected] of cases) {
    it(typed.trim(), () => {
      expect(cursorLine(type(stateAt(doc), typed))).toBe(expected);
    });
  }

  it('leaves a variable that starts with NEXT alone', () => {
    expect(cursorLine(type(stateAt('FOR i <- 1 TO 3\n    |'), 'NextNum <- 1'))).toBe('    NextNum <- 1');
  });
});

describe('Enter on a closer line', () => {
  it('snaps a bare NEXT back before breaking the line', () => {
    const state = enter(stateAt('FOR i <- 1 TO 3\n    OUTPUT i\n    NEXT|'));
    expect(state.doc.toString()).toBe('FOR i <- 1 TO 3\n    OUTPUT i\nNEXT\n');
    expect(cursorLine(state)).toBe('');
  });

  it('is a single undo step', () => {
    const before = 'FOR i <- 1 TO 3\n    OUTPUT i\n    NEXT';
    const state = enter(stateAt(`${before}|`));
    let undone: EditorState | null = null;
    undo({ state, dispatch: (tr) => { undone = tr.state; } });
    expect((undone as EditorState | null)!.doc.toString()).toBe(before);
  });

  it('falls through when the closer is already in place', () => {
    const state = stateAt('IF x THEN\n    OUTPUT x\nENDIF|');
    expect(reindentCloserThenNewline({ state, dispatch: () => {} })).toBe(false);
  });
});

describe('agrees with the formatter', () => {
  it('typing a program line by line gives formatted code', () => {
    const lines = [
      'PROCEDURE Count(n : INTEGER)',
      'FOR i <- 1 TO n',
      'IF i MOD 2 = 0 THEN',
      'OUTPUT i',
      'ELSE',
      'OUTPUT "odd"',
      'ENDIF',
      'NEXT i',
      'ENDPROCEDURE',
    ];
    let state = stateAt('|');
    lines.forEach((line, i) => {
      state = type(state, line);
      if (i < lines.length - 1) state = enter(state);
    });
    const doc = state.doc.toString();
    expect(doc).toBe(formatPseudocode(doc));
  });
});
