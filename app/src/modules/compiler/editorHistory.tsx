'use client';

import { useCallback, useRef, useState } from 'react';
import { Redo2, Undo2 } from 'lucide-react';

export type EditorHistoryState = {
  canUndo: boolean;
  canRedo: boolean;
};

export type EditorActions = {
  undo: () => void;
  redo: () => void;
};

/** Tracks whether the open editor can undo or redo, and calls into it. */
export function useEditorHistory() {
  const actionsRef = useRef<EditorActions | null>(null);
  const [history, setHistory] = useState<EditorHistoryState>({ canUndo: false, canRedo: false });

  const onHistoryChange = useCallback((next: EditorHistoryState) => {
    setHistory((prev) =>
      prev.canUndo === next.canUndo && prev.canRedo === next.canRedo ? prev : next,
    );
  }, []);

  const undo = useCallback(() => actionsRef.current?.undo(), []);
  const redo = useCallback(() => actionsRef.current?.redo(), []);

  return { actionsRef, history, onHistoryChange, undo, redo };
}

/**
 * Visible undo. CodeMirror already undoes with Ctrl+Z; students who delete
 * their program do not know that, so the word is always on the button.
 */
export function EditorUndoButtons({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  disabled = false,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  disabled?: boolean;
}) {
  const item =
    'flex shrink-0 items-center gap-1 whitespace-nowrap px-2 py-1 text-xs rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent';
  return (
    <>
      <button
        type="button"
        onClick={onUndo}
        disabled={disabled || !canUndo}
        className={`${item} text-light-text hover:bg-background`}
        title="Undo the last change (Ctrl+Z)"
        aria-label="Undo the last change"
      >
        <Undo2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Undo
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={disabled || !canRedo}
        className={`${item} text-dark-text hover:text-light-text hover:bg-background`}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>
    </>
  );
}
