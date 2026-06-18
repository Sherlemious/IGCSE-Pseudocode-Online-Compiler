'use client';

import React, { useEffect, useRef } from 'react';
import { EditorView, lineNumbers } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { python } from '@codemirror/lang-python';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Read-only CodeMirror view that renders generated Python with syntax
 * highlighting, reusing the app's theme tokens so it matches the editor.
 */
const PythonView: React.FC<{ code: string }> = ({ code }) => {
  const { fontSize } = useTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const fontSizeCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!hostRef.current) return;

    const theme = EditorView.theme({
      '&': { height: '100%', width: '100%', backgroundColor: 'var(--color-background)' },
      '.cm-content': {
        fontFamily: 'var(--editor-font-family)',
        padding: '1rem 0',
        color: 'var(--color-light-text)',
        letterSpacing: 'var(--editor-letter-spacing)',
        lineHeight: 'var(--editor-line-height)',
      },
      '.cm-gutters': {
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        color: 'var(--color-dark-text)',
        paddingLeft: '0.5rem',
        paddingRight: '0.75rem',
      },
      '.cm-lineNumbers .cm-gutterElement': { minWidth: '2.5rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
      '.cm-line': { padding: '0 0.75rem' },
      '.cm-selectionBackground': { backgroundColor: 'rgba(var(--color-primary-rgb), 0.15) !important' },
      '.cm-scroller': { scrollbarWidth: 'thin', scrollbarColor: 'var(--color-primary) var(--color-background)' },
      '.cm-scroller::-webkit-scrollbar': { width: '8px', height: '8px' },
      '.cm-scroller::-webkit-scrollbar-track': { background: 'var(--color-background)' },
      '.cm-scroller::-webkit-scrollbar-thumb': { background: 'var(--color-primary)', borderRadius: '10px' },
      '.cm-scroller::-webkit-scrollbar-thumb:hover': { background: 'var(--color-primary-hover)' },
      '&.cm-focused': { outline: 'none' },
    });

    const highlightStyle = HighlightStyle.define([
      { tag: t.keyword, color: 'var(--color-syntax-keyword)', fontWeight: '600' },
      { tag: t.typeName, color: 'var(--color-syntax-type)', fontWeight: '500' },
      { tag: t.variableName, color: 'var(--color-syntax-variable)' },
      { tag: t.function(t.variableName), color: 'var(--color-syntax-type)' },
      { tag: t.string, color: 'var(--color-syntax-string)' },
      { tag: t.number, color: 'var(--color-syntax-number)' },
      { tag: t.bool, color: 'var(--color-syntax-boolean)', fontWeight: '600' },
      { tag: t.operator, color: 'var(--color-syntax-operator)' },
      { tag: t.comment, color: 'var(--color-syntax-comment)', fontStyle: 'italic' },
    ]);

    const view = new EditorView({
      state: EditorState.create({
        doc: code,
        extensions: [
          lineNumbers(),
          EditorView.lineWrapping,
          python(),
          syntaxHighlighting(highlightStyle),
          theme,
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
          fontSizeCompartment.current.of(EditorView.theme({ '&': { fontSize: `${fontSize}px` } })),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document when the converted code changes.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== code) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: code } });
    }
  }, [code]);

  // Keep font size in sync with the editor's typography control.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: fontSizeCompartment.current.reconfigure(EditorView.theme({ '&': { fontSize: `${fontSize}px` } })),
    });
  }, [fontSize]);

  return <div ref={hostRef} className="h-full w-full" />;
};

export default PythonView;
