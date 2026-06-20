'use client';

import { Plus, Pencil, Trash2, Check, Palette } from 'lucide-react';
import {
  useTheme,
  useThemeEditor,
  type CustomColors,
} from '@/theme';
import ThemeEditorModal from '@/components/layout/ThemeEditorModal';

// The handful of colours shown in each theme's preview strip.
const PREVIEW_KEYS: (keyof CustomColors)[] = [
  'background', 'surface', 'primary', 'syntax-keyword', 'syntax-string', 'syntax-number',
];

export default function ThemeManager() {
  const {
    themeId, setTheme,
    customThemes, themesLoading, isSignedIn,
  } = useTheme();

  const {
    editor, openCreate, openEdit, closeEditor, handleSubmit,
    confirmDeleteId, requestDelete, cancelDelete, handleDelete,
  } = useThemeEditor();

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-1.5 text-xs font-semibold text-light-text">
          <Palette size={13} className="text-primary" />
          Custom Themes
        </h2>
        {isSignedIn && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"
          >
            <Plus size={12} />
            New
          </button>
        )}
      </div>

      {!isSignedIn ? (
        <p className="text-xs text-dark-text">Sign in to create and save custom themes.</p>
      ) : themesLoading ? (
        <p className="text-xs text-dark-text">Loading…</p>
      ) : customThemes.length === 0 ? (
        <p className="text-xs text-dark-text">
          No custom themes yet. Click <span className="text-light-text font-medium">New</span> to design one.
        </p>
      ) : (
        <ul className="space-y-2">
          {customThemes.map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <li
                key={theme.id}
                className={`rounded-lg border transition-colors ${
                  isActive ? 'border-primary/50 bg-primary/8' : 'border-border bg-background'
                }`}
              >
                <div className="flex items-center gap-2.5 px-3 py-2">
                  {/* Activate by clicking the swatch + name */}
                  <button
                    onClick={() => setTheme(theme.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                    aria-pressed={isActive}
                    aria-label={`Use ${theme.name}`}
                  >
                    <span className="flex flex-shrink-0 rounded-md overflow-hidden border border-white/10">
                      {PREVIEW_KEYS.map((k) => (
                        <span key={k} className="w-2.5 h-6" style={{ backgroundColor: theme.colors[k] }} />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-light-text truncate">{theme.name}</span>
                      {isActive && (
                        <span className="flex items-center gap-0.5 text-[10px] text-primary">
                          <Check size={9} /> Active
                        </span>
                      )}
                    </span>
                  </button>

                  {/* Actions */}
                  {confirmDeleteId === theme.id ? (
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => void handleDelete(theme.id)}
                        className="px-2 py-1 rounded-md bg-error/15 text-error text-[10px] font-medium hover:bg-error/25 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="px-2 py-1 rounded-md text-dark-text text-[10px] hover:text-light-text transition-colors"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => openEdit(theme)}
                        className="p-1.5 rounded-md text-dark-text hover:text-light-text hover:bg-border/40 transition-colors"
                        aria-label={`Edit ${theme.name}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => requestDelete(theme.id)}
                        className="p-1.5 rounded-md text-dark-text hover:text-error hover:bg-error/10 transition-colors"
                        aria-label={`Delete ${theme.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editor && (
        <ThemeEditorModal
          mode={editor.mode}
          initialName={editor.name}
          initialColors={editor.colors}
          onSubmit={handleSubmit}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}
