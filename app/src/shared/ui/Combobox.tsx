'use client';

import { useMemo, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronsUpDown, Check, Search } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

interface Props {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/** A searchable single-select built on Radix Popover, themed to the app tokens.
 *  Keyboard: type to filter, ↑/↓ to move, Enter to pick, Esc to close. */
export default function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No matches.',
  disabled,
  ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q));
  }, [options, query]);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQuery('');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[active];
      if (opt) pick(opt.value);
    }
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setQuery('');
          setActive(0);
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          className="w-full flex items-center justify-between gap-2 rounded-lg bg-background border border-border px-3.5 py-2.5
            text-sm text-left focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 hover:border-border/80"
        >
          <span className={`truncate ${selected ? 'text-light-text' : 'text-dark-text/50'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown size={14} className="shrink-0 text-dark-text/50" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-popover-trigger-width)] max-h-72 overflow-hidden rounded-lg border border-border bg-surface shadow-intense animate-scale-in"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).querySelector('input')?.focus();
          }}
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={13} className="text-dark-text/60 shrink-0" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-light-text placeholder:text-dark-text/40 focus:outline-none"
            />
          </div>

          <div ref={listRef} className="max-h-56 overflow-y-auto scrollbar-pretty py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-dark-text/60 text-center">{emptyText}</p>
            ) : (
              filtered.map((o, i) => {
                const isActive = i === active;
                const isSelected = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(o.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? 'bg-primary/10 text-light-text' : 'text-dark-text hover:text-light-text'
                    }`}
                  >
                    <Check size={13} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-transparent'}`} />
                    <span className="min-w-0 flex-1 truncate">{o.label}</span>
                    {o.hint && <span className="shrink-0 text-[10px] text-dark-text/50 font-mono">{o.hint}</span>}
                  </button>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
