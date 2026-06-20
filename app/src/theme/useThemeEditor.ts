'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useTheme,
  type CustomColors,
  type SavedTheme,
  DEFAULT_CUSTOM_COLORS,
  presetToCustomColors,
  themes,
} from './index';

export type EditorState =
  | { mode: 'create'; name: string; colors: CustomColors }
  | { mode: 'edit'; id: string; name: string; colors: CustomColors };

/**
 * Shared orchestration for creating/editing/deleting custom themes.
 * Used by both the profile ThemeManager and the header settings panel so the
 * two surfaces stay in sync without duplicating the create/edit/delete wiring.
 */
export function useThemeEditor() {
  const { themeId, setTheme, createTheme, updateTheme, deleteTheme } = useTheme();

  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function openCreate() {
    const seed = themeId in themes
      ? presetToCustomColors(themeId as keyof typeof themes)
      : DEFAULT_CUSTOM_COLORS;
    setEditor({ mode: 'create', name: '', colors: seed });
  }

  function openEdit(theme: SavedTheme) {
    setEditor({ mode: 'edit', id: theme.id, name: theme.name, colors: theme.colors });
  }

  function closeEditor() {
    setEditor(null);
  }

  async function handleSubmit(name: string, colors: CustomColors): Promise<boolean> {
    if (editor?.mode === 'edit') {
      const ok = await updateTheme(editor.id, { name, colors });
      if (ok) toast.success('Theme updated');
      return ok;
    }
    const created = await createTheme(name, colors);
    if (created) {
      setTheme(created.id);
      toast.success('Theme created');
      return true;
    }
    return false;
  }

  function requestDelete(id: string) {
    setConfirmDeleteId(id);
  }

  function cancelDelete() {
    setConfirmDeleteId(null);
  }

  async function handleDelete(id: string) {
    const ok = await deleteTheme(id);
    setConfirmDeleteId(null);
    if (ok) toast.success('Theme deleted');
  }

  return {
    editor,
    openCreate,
    openEdit,
    closeEditor,
    handleSubmit,
    confirmDeleteId,
    requestDelete,
    cancelDelete,
    handleDelete,
  };
}
