'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** `detail` = bottom sheet on mobile, right panel on desktop. `start` = left nav sheet. */
  side?: 'detail' | 'start';
}

export default function AdminDrawer({
  open,
  onClose,
  title,
  subtitle,
  lead,
  children,
  footer,
  side = 'detail',
}: Props) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const isNav = side === 'start';

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55 admin-overlay"
        onClick={onClose}
      />

      <div
        className={
          isNav
            ? 'absolute inset-y-0 left-0 z-10 w-[min(18.5rem,88vw)] bg-surface border-r border-border shadow-intense flex flex-col admin-nav-panel'
            : 'admin-drawer-panel absolute inset-x-0 bottom-0 z-10 max-h-[92dvh] md:inset-y-0 md:left-auto md:right-0 md:inset-x-auto md:max-h-none md:h-full md:w-[min(26rem,100vw)] bg-surface border-t md:border-t-0 md:border-l border-border shadow-intense flex flex-col rounded-t-2xl md:rounded-none'
        }
      >
        {!isNav && (
          <div className="md:hidden flex justify-center pt-2.5 pb-1" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>
        )}

        <header className="flex items-start gap-3 px-4 py-3 border-b border-border shrink-0">
          {lead}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-base font-semibold text-light-text truncate">
              {title}
            </h2>
            {subtitle && <div className="mt-0.5 text-xs text-dark-text break-words">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 -mr-1 rounded-lg text-dark-text hover:text-light-text hover:bg-border/40 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-pretty px-4 py-4 ${footer ? '' : 'pb-[max(1rem,env(safe-area-inset-bottom))]'}`}>
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
