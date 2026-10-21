'use client';

import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Props {
  value: string | null; // 'yyyy-mm-dd' or null
  onChange: (value: string | null) => void;
  placeholder?: string;
  ariaLabel?: string;
  /** Earliest selectable day ('yyyy-mm-dd'), inclusive. */
  min?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const pad = (n: number) => String(n).padStart(2, '0');
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parseISO(s: string | null): { y: number; m: number; d: number } | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { y, m: m - 1, d };
}

function formatDisplay(s: string): string {
  const p = parseISO(s);
  if (!p) return s;
  return `${p.d} ${MONTHS[p.m].slice(0, 3)} ${p.y}`;
}

function todayISO(): string {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function DatePicker({ value, onChange, placeholder = 'No due date', ariaLabel, min }: Props) {
  const [open, setOpen] = useState(false);
  const selected = parseISO(value);
  const initial = selected ?? { y: new Date().getFullYear(), m: new Date().getMonth(), d: new Date().getDate() };
  const [view, setView] = useState({ y: initial.y, m: initial.m }); // first-of-month view

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  function shift(delta: number) {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  }

  function isDisabled(iso: string): boolean {
    // Keep the current value selectable so a due date that has since passed can stay.
    if (!min || iso >= min || iso === value) return false;
    return true;
  }

  const today = todayISO();

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="w-full sm:w-auto flex items-center gap-2 rounded-lg bg-background border border-border px-3.5 py-2.5
            text-sm focus:outline-none focus:border-primary/50 transition-colors hover:border-border/80"
        >
          <CalendarIcon size={14} className="shrink-0 text-dark-text/60" />
          <span className={value ? 'text-light-text' : 'text-dark-text/50'}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
              className="ml-1 text-dark-text/50 hover:text-error transition-colors"
              aria-label="Clear date"
            >
              <X size={13} />
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-[80] w-64 rounded-lg border border-border bg-surface shadow-intense p-3 animate-scale-in"
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => shift(-1)} className="p-1 rounded hover:bg-background text-dark-text hover:text-light-text transition-colors" aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-semibold text-light-text">{MONTHS[view.m]} {view.y}</span>
            <button type="button" onClick={() => shift(1)} className="p-1 rounded hover:bg-background text-dark-text hover:text-light-text transition-colors" aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-center text-[10px] font-mono text-dark-text/50">{w}</span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              if (d === null) return <span key={i} />;
              const iso = toISO(view.y, view.m, d);
              const isSelected = iso === value;
              const disabled = isDisabled(iso);
              const isToday = iso === today;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  title={disabled ? 'Already passed' : isToday ? 'Today' : undefined}
                  aria-label={disabled ? `${d}, already passed` : isToday ? `${d}, today` : undefined}
                  style={disabled ? { color: 'color-mix(in srgb, var(--color-dark-text) 42%, transparent)' } : undefined}
                  className={`h-8 rounded-md text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary font-semibold'
                      : disabled
                        ? 'bg-disabled-bg line-through decoration-current cursor-not-allowed'
                        : isToday
                          ? 'font-semibold text-light-text ring-1 ring-inset ring-primary/70 hover:bg-primary/10'
                          : 'text-dark-text hover:bg-primary/10 hover:text-light-text'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          {min && (
            <p className="mt-2 text-center text-[10px] text-dark-text">Struck-through days have already passed.</p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
