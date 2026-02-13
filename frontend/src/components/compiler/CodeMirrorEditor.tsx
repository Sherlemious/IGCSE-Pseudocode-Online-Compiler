import React, { useEffect, useRef, useCallback } from 'react';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  Decoration,
  DecorationSet,
} from '@codemirror/view';
import { EditorState, Compartment, StateField, StateEffect, RangeSetBuilder } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { pseudocodeLanguage } from '../../interpreter/pseudocode-lang';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const readOnlyCompartment = new Compartment();
const gutterCompartment = new Compartment();
const ariaLabelCompartment = new Compartment();

// Define StateEffect for line highlighting
const setLineHighlight = StateEffect.define<{ debugLine: number | null; errorLine: number | null }>();

// Define StateEffect for breakpoints
const setBreakpoints = StateEffect.define<Set<number>>();

// Define StateField for breakpoint decorations
const breakpointField = StateField.define<Set<number>>({
  create() {
    return new Set();
  },
  update(breakpoints, tr) {
    for (const e of tr.effects) {
      if (e.is(setBreakpoints)) {
        return e.value;
      }
    }
    return breakpoints;
  },
});

// Define StateField for line decorations
const lineHighlightField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setLineHighlight)) {
        const { debugLine, errorLine } = e.value;
        const builder = new RangeSetBuilder<Decoration>();
        if (debugLine && debugLine <= tr.state.doc.lines) {
          const line = tr.state.doc.line(debugLine);
          builder.add(line.from, line.from, Decoration.line({ class: 'cm-line-debug' }));
        }
        if (errorLine && errorLine <= tr.state.doc.lines) {
          const line = tr.state.doc.line(errorLine);
          builder.add(line.from, line.from, Decoration.line({ class: 'cm-line-error' }));
        }
        return builder.finish();
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange?: (line: number, col: number) => void;
  onRun?: () => void;
  onStop?: () => void;
  isRunning?: boolean;
  readOnly?: boolean;
  debugLine?: number | null;
  errorLine?: number | null;
  breakpoints?: Set<number>;
  onBreakpointToggle?: (line: number) => void;
  ariaLabel?: string;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  value,
  onChange,
  onCursorChange,
  onRun,
  onStop,
  isRunning = false,
  readOnly = false,
  debugLine = null,
  errorLine = null,
  breakpoints = new Set(),
  onBreakpointToggle,
  ariaLabel,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onCursorChangeRef = useRef(onCursorChange);
  const onRunRef = useRef(onRun);
  const onStopRef = useRef(onStop);
  const isRunningRef = useRef(isRunning);
  const debugLineRef = useRef(debugLine);
  const errorLineRef = useRef(errorLine);
  const breakpointsRef = useRef(breakpoints);
  const onBreakpointToggleRef = useRef(onBreakpointToggle);

  // Update refs when props change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onCursorChangeRef.current = onCursorChange;
  }, [onCursorChange]);

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    onBreakpointToggleRef.current = onBreakpointToggle;
  }, [onBreakpointToggle]);

  // Centralized gutter creation logic
  const createGutter = useCallback(
    () =>
      lineNumbers({
        formatNumber: (lineNo) => {
          if (debugLineRef.current === lineNo) return '▶';
          if (errorLineRef.current === lineNo) return '⚠';
          if (breakpointsRef.current.has(lineNo)) return '⬤';
          return lineNo.toString();
        },
        domEventHandlers: {
          click: (view, block) => {
            const lineNo = view.state.doc.lineAt(block.from).number;
            if (onBreakpointToggleRef.current && !isRunningRef.current) {
              onBreakpointToggleRef.current(lineNo);
              return true;
            }
            return false;
          },
        },
      }),
    [] // Refs are stable and don't need to be in the dependency array
  );

  useEffect(() => {
    breakpointsRef.current = breakpoints;

    if (viewRef.current) {
      // Update breakpoint state
      viewRef.current.dispatch({
        effects: setBreakpoints.of(breakpoints),
      });

      // Reconfigure gutter to show updated breakpoints
      viewRef.current.dispatch({
        effects: gutterCompartment.reconfigure([createGutter(), highlightActiveLineGutter()]),
      });
    }
  }, [breakpoints, createGutter]);

  useEffect(() => {
    debugLineRef.current = debugLine;
    errorLineRef.current = errorLine;

    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: setLineHighlight.of({ debugLine, errorLine }),
      });

      // Reconfigure gutter to show updated debug/error markers
      viewRef.current.dispatch({
        effects: gutterCompartment.reconfigure([createGutter(), highlightActiveLineGutter()]),
      });
    }
  }, [debugLine, errorLine, createGutter]);

  useEffect(() => {
    if (!editorRef.current) return;

    // Custom theme
    const customTheme = EditorView.theme({
      '&': {
        fontSize: 'var(--editor-font-size)',
        height: '100%',
        backgroundColor: 'var(--color-background)',
      },
      '.cm-content': {
        fontFamily: '"Fira Code Variable", "Fira Code", monospace',
        padding: '1rem 0',
        caretColor: 'var(--color-primary)',
        color: 'var(--color-light-text)',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        color: 'var(--color-dark-text)',
        paddingLeft: '0.5rem',
        paddingRight: '0.75rem',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
      },
      '.cm-lineNumbers .cm-gutterElement': {
        minWidth: '2.5rem',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
        cursor: 'pointer',
      },
      '.cm-activeLine': {
        backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
      },
      '.cm-selectionBackground': {
        backgroundColor: 'rgba(var(--color-primary-rgb), 0.15) !important',
      },
      '.cm-focused .cm-selectionBackground': {
        backgroundColor: 'rgba(var(--color-primary-rgb), 0.2) !important',
      },
      '.cm-cursor': {
        borderLeftColor: 'var(--color-primary)',
        borderLeftWidth: '2px',
      },
      '.cm-scroller': {
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-primary) var(--color-background)',
      },
      '.cm-scroller::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '.cm-scroller::-webkit-scrollbar-track': {
        background: 'var(--color-background)',
      },
      '.cm-scroller::-webkit-scrollbar-thumb': {
        background: 'var(--color-primary)',
        borderRadius: '10px',
      },
      '.cm-scroller::-webkit-scrollbar-thumb:hover': {
        background: 'var(--color-primary-hover)',
      },
      '&.cm-focused': {
        outline: 'none',
      },
      '.cm-line': {
        padding: '0 0.75rem',
      },
      // Debug line highlight
      '.cm-line-debug': {
        backgroundColor: 'rgba(var(--color-warning-rgb), 0.1)',
        borderLeft: '2px solid var(--color-warning)',
      },
      // Error line highlight
      '.cm-line-error': {
        backgroundColor: 'rgba(var(--color-error-rgb), 0.1)',
        borderLeft: '2px solid var(--color-error)',
      },
    });

    // Custom syntax highlighting using CSS variables
    const highlightStyle = HighlightStyle.define([
      { tag: t.keyword, color: 'var(--color-syntax-keyword)', fontWeight: '600' },
      { tag: t.typeName, color: 'var(--color-syntax-type)', fontWeight: '500' },
      { tag: t.variableName, color: 'var(--color-syntax-variable)' },
      { tag: t.string, color: 'var(--color-syntax-string)' },
      { tag: t.number, color: 'var(--color-syntax-number)' },
      { tag: t.bool, color: 'var(--color-syntax-boolean)', fontWeight: '600' },
      { tag: t.operator, color: 'var(--color-syntax-operator)' },
      { tag: t.lineComment, color: 'var(--color-syntax-comment)', fontStyle: 'italic' },
      { tag: t.comment, color: 'var(--color-syntax-comment)', fontStyle: 'italic' },
    ]);

    const highlightTheme = syntaxHighlighting(highlightStyle);

    // Custom keyboard shortcuts
    const customKeymap = keymap.of([
      {
        key: 'Ctrl-Enter',
        mac: 'Cmd-Enter',
        run: () => {
          if (!isRunningRef.current && onRunRef.current) {
            onRunRef.current();
            return true;
          }
          return false;
        },
      },
      {
        key: 'Ctrl-Shift-k',
        mac: 'Cmd-Shift-k',
        run: () => {
          if (isRunningRef.current && onStopRef.current) {
            onStopRef.current();
            return true;
          }
          return false;
        },
      },
      indentWithTab,
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
      ...completionKeymap,
    ]);

    // Create editor state
    const startState = EditorState.create({
      doc: value,
      extensions: [
        ariaLabelCompartment.of(EditorView.contentAttributes.of({ 'aria-label': ariaLabel || 'Code Editor' })),
        gutterCompartment.of([createGutter(), highlightActiveLineGutter()]),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        customKeymap,
        pseudocodeLanguage(),
        highlightTheme,
        customTheme,
        lineHighlightField,
        breakpointField,
        readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
          if (update.selectionSet && onCursorChangeRef.current) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            const col = pos - line.from + 1;
            onCursorChangeRef.current(line.number, col);
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    // Create editor view
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [createGutter]); // Include createGutter in dependencies

  // Update document when value changes externally
  useEffect(() => {
    if (!viewRef.current) return;
    const currentDoc = viewRef.current.state.doc.toString();
    if (currentDoc !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // Update read-only state
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  // Update aria-label
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: ariaLabelCompartment.reconfigure(EditorView.contentAttributes.of({ 'aria-label': ariaLabel || 'Code Editor' })),
    });
  }, [ariaLabel]);

  // Scroll debug line into view
  useEffect(() => {
    if (debugLine === null || !viewRef.current) return;
    const view = viewRef.current;
    const line = view.state.doc.line(Math.min(debugLine, view.state.doc.lines));
    view.dispatch({
      selection: { anchor: line.from },
      effects: EditorView.scrollIntoView(line.from, { y: 'center' }),
    });
  }, [debugLine]);

  return <div ref={editorRef} className="flex-1 min-w-0" />;
};

export default CodeMirrorEditor;
