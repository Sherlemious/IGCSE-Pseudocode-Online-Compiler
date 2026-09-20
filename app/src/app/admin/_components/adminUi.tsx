'use client';

import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

export function nice(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function formatAdminDate(value: Date | string | null | undefined, compact = false) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  if (compact) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(value: Date | string | null | undefined) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  const mins = Math.round((Date.now() - d.getTime()) / 60_000);
  if (Math.abs(mins) < 1) return 'just now';
  if (Math.abs(mins) < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function chipClass(active: boolean) {
  return `shrink-0 px-2.5 py-1.5 sm:py-1 rounded-lg text-xs border transition-colors touch-manipulation ${
    active
      ? 'bg-primary/15 border-primary/50 text-primary'
      : 'bg-background border-border text-dark-text hover:text-light-text'
  }`;
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} className={chipClass(active)}>
      {children}
    </button>
  );
}

export function ChipRow({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {label && <span className="text-xs text-dark-text shrink-0">{label}</span>}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none overscroll-x-contain py-0.5">
        {children}
      </div>
    </div>
  );
}

export function AdminSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-w-0 sm:w-64 px-3 py-2 sm:py-1.5 rounded-lg bg-background border border-border text-sm sm:text-xs text-light-text placeholder-dark-text/40 outline-none focus:border-primary/50 transition-colors"
    />
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
      <div className="min-w-0">
        <h1 className="hidden md:block text-2xl font-bold text-light-text tracking-tight">{title}</h1>
        {description && <p className="text-sm text-dark-text md:mt-1">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-10 text-center text-sm text-dark-text">
      {children}
    </div>
  );
}

export function CopyValue({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-dark-text/60">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 min-w-0">
        <span
          className={`text-sm text-light-text truncate ${mono ? 'font-mono text-xs' : ''}`}
          title={value ?? undefined}
        >
          {value ?? <span className="italic text-dark-text/40">—</span>}
        </span>
        {value && (
          <button
            type="button"
            onClick={() => void copy()}
            className="shrink-0 p-1 rounded-md text-dark-text/50 hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          </button>
        )}
      </dd>
    </div>
  );
}

export function MetaField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-dark-text/60">{label}</dt>
      <dd className={`mt-0.5 text-sm text-light-text break-words ${mono ? 'font-mono text-xs' : ''}`}>
        {value ?? <span className="italic text-dark-text/40">—</span>}
      </dd>
    </div>
  );
}
