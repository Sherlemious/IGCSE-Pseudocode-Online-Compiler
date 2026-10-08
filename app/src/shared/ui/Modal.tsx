'use client';

// In-app modal. Use this (or ConfirmDialog) instead of window.confirm / alert /
// prompt: those block the page and can't be themed. Esc or a click on the
// backdrop closes it; focus moves into the dialog and returns when it closes.

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Small icon shown before the title. */
  icon?: ReactNode;
  children: ReactNode;
  /** Tailwind max-width class for the panel. */
  widthClass?: string;
};

export default function Modal({ open, onClose, title, icon, children, widthClass = 'max-w-sm' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', onKey, true);
    // Focus the first field, else the panel, so Esc and Tab work straight away.
    requestAnimationFrame(() => {
      const panel = panelRef.current;
      const field = panel?.querySelector<HTMLElement>('[autofocus], textarea, input, select');
      (field ?? panel)?.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey, true);
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        // Only a press that starts on the backdrop closes it (not a text drag out of the panel).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`w-full ${widthClass} rounded-xl border border-border bg-surface p-5 shadow-2xl outline-none animate-scale-in`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-light-text">
            {icon}
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-0.5 text-dark-text transition-colors hover:text-light-text"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  message?: ReactNode;
  confirmLabel: string;
  icon?: ReactNode;
  /** `danger` for destructive actions (red), `warning` for resets (amber). */
  tone?: 'warning' | 'danger';
};

/** Yes/no question in a Modal — the replacement for window.confirm. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  icon,
  tone = 'warning',
}: ConfirmDialogProps) {
  const toneClass =
    tone === 'danger'
      ? 'text-error bg-error/10 hover:bg-error/20 border-error/30'
      : 'text-warning bg-warning/10 hover:bg-warning/20 border-warning/30';
  return (
    <Modal open={open} onClose={onClose} title={title} icon={icon}>
      {message && <p className="mb-4 text-xs leading-relaxed text-dark-text">{message}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-xs text-dark-text transition-colors hover:bg-background hover:text-light-text"
        >
          Cancel
        </button>
        <button
          type="button"
          autoFocus
          onClick={() => {
            onClose();
            onConfirm();
          }}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${toneClass}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
