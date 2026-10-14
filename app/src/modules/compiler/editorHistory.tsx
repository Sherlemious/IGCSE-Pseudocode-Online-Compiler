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
 * their program do not know that, so the word stays on the button from `sm` up.
 * On phones the toolbar is tight: Undo is icon-only and Redo only appears once
 * there is something to redo.
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
        <Undo2 className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Undo</span>
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={disabled || !canRedo}
        className={`${item} text-dark-text hover:text-light-text hover:bg-background ${canRedo ? '' : 'max-sm:hidden'}`}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>
    </>
  );
}
