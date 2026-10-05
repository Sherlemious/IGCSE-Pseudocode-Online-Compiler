'use client';

/**
 * Shared editor kit — the pieces practice/exams may import from the compiler
 * module. Do not import CompilerPage (the playground shell) from other features.
 */
export { default as CodeMirrorEditor } from './CodeMirrorEditor';
export { EditorUndoButtons, useEditorHistory } from './editorHistory';
export { default as TraceTable } from './TraceTable';
