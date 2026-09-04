'use client';

import { useEffect, useState } from 'react';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: 'Ctrl + K', desc: 'Command palette' },
  { keys: 'Ctrl + Enter', desc: 'Run code' },
  { keys: 'Ctrl + Shift + Enter', desc: 'Check My Answer (practice / exam)' },
  { keys: 'Ctrl + Shift + K', desc: 'Stop execution' },
  { keys: 'Ctrl + /', desc: 'Toggle line comment' },
  { keys: 'Tab', desc: 'Indent / insert spaces' },
  { keys: 'Ctrl + S', desc: 'Auto-saved' },
  { keys: 'Esc', desc: 'Close modals' },
];

/**
 * Global keyboard-shortcuts reference. Opened from the command palette (and any
 * other surface) by dispatching `pseudocode:open-shortcuts`, so it no longer
 * needs a permanent button in the header.
 */
export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('pseudocode:open-shortcuts', openHandler);
    return () => window.removeEventListener('pseudocode:open-shortcuts', openHandler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-9 border-b border-border flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Keyboard size={13} className="text-primary" />
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Shortcuts</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close shortcuts"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-3 space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-xs">
              <span className="text-dark-text">{s.desc}</span>
              <kbd className="text-[10px]">{s.keys}</kbd>
            </div>
          ))}
          <div className="pt-2 border-t border-border/30 text-[10px] text-dark-text/50 text-center">
            Press <kbd>Ctrl+K</kbd> for the command palette
          </div>
        </div>
      </div>
    </div>
  );
}
