'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const ADMIN_DRAWER_EXIT_MS = 340;

/** Keep the last non-null value so a drawer can animate out after its item is cleared. */
export function useHeld<T>(value: T | null | undefined): T | null {
  const ref = useRef<T | null>(value ?? null);
  if (value != null) ref.current = value;
  return value ?? ref.current;
}

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

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileSheet() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, label'));
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
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [hydrated, setHydrated] = useState(false);
  const [shown, setShown] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const shownRef = useRef(open);
  const dragDismissing = useRef(false);

  const [dragY, setDragY] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const drag = useRef({
    pointerId: -1,
    startY: 0,
    lastY: 0,
    lastT: 0,
    velocity: 0,
  });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (open) {
      shownRef.current = true;
      dragDismissing.current = false;
      setShown(true);
      setLeaving(false);
      setDragY(0);
      setDragActive(false);
      return;
    }
    if (!shownRef.current) return;
    if (dragDismissing.current || reducedMotion()) {
      dragDismissing.current = false;
      shownRef.current = false;
      setShown(false);
      setLeaving(false);
      setDragY(0);
      setDragActive(false);
      return;
    }
    setLeaving(true);
    const t = window.setTimeout(() => {
      shownRef.current = false;
      setShown(false);
      setLeaving(false);
      setDragY(0);
    }, ADMIN_DRAWER_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [shown]);

  const finishDragClose = useCallback(() => {
    const height = sheetRef.current?.getBoundingClientRect().height ?? window.innerHeight;
    dragDismissing.current = true;
    setDragActive(false);
    setDragY(height + 40);
    window.setTimeout(() => onCloseRef.current(), 280);
  }, []);

  const onHandlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (side !== 'detail' || leaving || !isMobileSheet()) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (isInteractive(e.target)) return;
    drag.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: performance.now(),
      velocity: 0,
    };
    setDragActive(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onHandlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragActive || e.pointerId !== drag.current.pointerId) return;
    const now = performance.now();
    const dy = e.clientY - drag.current.startY;
    const dt = Math.max(1, now - drag.current.lastT);
    drag.current.velocity = (e.clientY - drag.current.lastY) / dt;
    drag.current.lastY = e.clientY;
    drag.current.lastT = now;
    setDragY(Math.max(0, dy));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragActive || e.pointerId !== drag.current.pointerId) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    const height = sheetRef.current?.getBoundingClientRect().height ?? 480;
    const fastFling = drag.current.velocity > 0.55;
    const farEnough = dragY > 88 || dragY > height * 0.2;
    drag.current.pointerId = -1;
    if (fastFling || farEnough) {
      finishDragClose();
      return;
    }
    setDragActive(false);
    setDragY(0);
  };

  if (!hydrated || !shown) return null;

  const isNav = side === 'start';
  const dragging = dragActive || dragY > 0;
  const leave = leaving && !dragging ? ' is-leaving' : '';
  const dragClass = dragging ? ' is-dragging' : '';

  const sheetStyle: CSSProperties | undefined = dragging
    ? {
        transform: `translate3d(0, ${dragY}px, 0)`,
        transition: dragActive ? 'none' : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
      }
    : undefined;

  const overlayStyle: CSSProperties | undefined = dragging
    ? {
        opacity: Math.max(0.08, 1 - dragY / 420),
        transition: dragActive ? 'none' : 'opacity 0.34s ease',
      }
    : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 bg-black/55 md:bg-black/45 backdrop-blur-[3px] admin-overlay${leave}${dragClass}`}
        style={overlayStyle}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        style={sheetStyle}
        className={
          (isNav
            ? 'absolute inset-y-0 left-0 z-10 w-[min(18.5rem,88vw)] bg-surface border-r border-border shadow-intense flex flex-col admin-nav-panel'
            : 'admin-drawer-panel absolute inset-x-0 bottom-0 z-10 max-h-[92dvh] md:inset-x-auto md:inset-y-4 md:right-4 md:left-auto md:max-h-[calc(100dvh-2rem)] md:h-auto md:w-[min(32rem,calc(100vw-2rem))] bg-surface border-t md:border border-border shadow-intense flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden')
          + leave
          + dragClass
        }
      >
        <div
          className="shrink-0 touch-none md:touch-auto"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {!isNav && (
            <div className="md:hidden flex flex-col items-center pt-2.5 pb-1" aria-hidden>
              <span className={`h-1.5 w-12 rounded-full transition-colors ${dragging ? 'bg-primary/70' : 'bg-dark-text/35'}`} />
            </div>
          )}

          <header className="flex items-start gap-3 px-4 py-3 md:px-5 md:py-4 border-b border-border">
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
        </div>

        <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-pretty px-4 py-4 md:px-5 md:py-5 ${footer ? '' : 'pb-[max(1rem,env(safe-area-inset-bottom))]'}`}>
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-border px-4 py-3 md:px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
