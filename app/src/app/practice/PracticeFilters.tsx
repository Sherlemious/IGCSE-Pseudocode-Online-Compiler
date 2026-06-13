'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, SlidersHorizontal, FileText, Search, ChevronDown } from 'lucide-react';
import {
  buildPracticeUrl,
  DIFF_META,
  STATUS_META,
  type ActiveFilters,
  type DiffFacet,
  type NamedFacet,
  type StatusFacet,
  type YearFacet,
} from './filterUtils';

interface Props {
  variant: 'desktop' | 'mobile';
  topics: NamedFacet[];
  years: YearFacet[];
  tags: NamedFacet[];
  difficulties: DiffFacet[];
  statuses: StatusFacet[];
  statusAllCount: number;
  active: ActiveFilters;
  showStatus: boolean;
}

const TAG_COLLAPSED_LIMIT = 14;

export function PracticeFilters(props: Props) {
  const { variant, active } = props;
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (overrides: Record<string, string | undefined>) =>
    router.push(buildPracticeUrl(searchParams.toString(), overrides));

  // ── Local-first search with debounced navigation ──────────────────────────
  const [query, setQuery] = useState(active.q ?? '');
  const searchRef = useRef<HTMLInputElement>(null);
  const skipFirst = useRef(true);

  useEffect(() => {
    setQuery(active.q ?? '');
  }, [active.q]);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const id = setTimeout(() => {
      if ((query || undefined) !== (active.q || undefined)) {
        router.replace(buildPracticeUrl(searchParams.toString(), { q: query || undefined }));
      }
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Press "/" anywhere to focus the search (desktop only — single listener).
  useEffect(() => {
    if (variant !== 'desktop') return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant]);

  const facets = <Facets {...props} go={go} />;

  // ── Desktop sidebar ───────────────────────────────────────────────────────
  if (variant === 'desktop') {
    return (
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-9 py-2 bg-surface border border-border rounded-lg text-xs text-light-text placeholder:text-dark-text outline-none focus:border-primary/50 transition-colors"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-text hover:text-light-text transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">/</kbd>
          )}
        </div>
        {facets}
      </div>
    );
  }

  // ── Mobile compact bar ──────────────────────────────────────────────────────
  return <MobileBar {...props} go={go} query={query} setQuery={setQuery} facets={facets} />;
}

// ── Mobile wrapper ────────────────────────────────────────────────────────────

function MobileBar({
  active,
  difficulties,
  statuses,
  showStatus,
  go,
  query,
  setQuery,
  facets,
}: Props & {
  go: (o: Record<string, string | undefined>) => void;
  query: string;
  setQuery: (v: string) => void;
  facets: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = [active.topic, active.year, active.tag, active.diff, active.status].filter(Boolean).length;

  return (
    <div className="mb-5">
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {/* Search + toggle */}
        <div className="flex items-center gap-2 px-3 py-2">
          <Search size={13} className="text-dark-text shrink-0" />
          <input
            type="text"
            placeholder="Search questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-light-text placeholder:text-dark-text outline-none min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-dark-text hover:text-light-text transition-colors shrink-0 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
          <div className="w-px h-4 bg-border/60 mx-0.5 shrink-0" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-[11px] font-medium text-dark-text hover:text-light-text transition-colors shrink-0 cursor-pointer"
          >
            <SlidersHorizontal size={12} />
            <span>Filters{activeCount > 0 ? ` (${activeCount})` : ''}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {open && <div className="border-t border-border/40 p-3.5">{facets}</div>}
      </div>

      {/* Quick difficulty / status row stays visible when collapsed */}
      {!open && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {difficulties.map((d) => {
            const isActive = active.diff === d.value;
            const m = DIFF_META[d.value];
            return (
              <button
                key={d.value}
                onClick={() => go({ diff: isActive ? undefined : d.value })}
                style={
                  isActive
                    ? {
                        backgroundColor: `color-mix(in srgb, ${m.color} 16%, transparent)`,
                        borderColor: `color-mix(in srgb, ${m.color} 45%, transparent)`,
                        color: m.color,
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-colors ${
                  isActive ? '' : 'border-border text-dark-text'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                {m.label}
                <span className="font-mono tabular-nums opacity-70">{d.count}</span>
              </button>
            );
          })}
          {showStatus &&
            statuses
              .filter((s) => s.value !== 'todo')
              .map((s) => {
                const isActive = active.status === s.value;
                const m = STATUS_META[s.value];
                return (
                  <button
                    key={s.value}
                    onClick={() => go({ status: isActive ? undefined : s.value })}
                    style={
                      isActive
                        ? {
                            backgroundColor: `color-mix(in srgb, ${m.color} 16%, transparent)`,
                            borderColor: `color-mix(in srgb, ${m.color} 45%, transparent)`,
                            color: m.color,
                          }
                        : undefined
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-colors ${
                      isActive ? '' : 'border-border text-dark-text'
                    }`}
                  >
                    {m.label}
                    <span className="font-mono tabular-nums opacity-70">{s.count}</span>
                  </button>
                );
              })}
        </div>
      )}
    </div>
  );
}

// ── Shared facet stack ──────────────────────────────────────────────────────

function Facets({
  topics,
  years,
  tags,
  difficulties,
  statuses,
  statusAllCount,
  active,
  showStatus,
  go,
}: Props & { go: (o: Record<string, string | undefined>) => void }) {
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const maxTopic = topics.reduce((m, t) => Math.max(m, t.count), 0);
  const visibleTags = tagsExpanded ? tags : tags.slice(0, TAG_COLLAPSED_LIMIT);

  return (
    <div className="flex flex-col gap-5">
      {/* Status */}
      {showStatus && (
        <Section label="Status" onClear={active.status ? () => go({ status: undefined }) : undefined}>
          <div className="grid grid-cols-2 gap-1.5">
            <ChipStat
              label="All"
              count={statusAllCount}
              active={!active.status}
              onClick={() => go({ status: undefined })}
            />
            {statuses.map((s) => {
              const m = STATUS_META[s.value];
              const isActive = active.status === s.value;
              return (
                <ChipStat
                  key={s.value}
                  label={m.label}
                  count={s.count}
                  color={m.color}
                  active={isActive}
                  onClick={() => go({ status: isActive ? undefined : s.value })}
                />
              );
            })}
          </div>
        </Section>
      )}

      {/* Difficulty */}
      <Section label="Difficulty" onClear={active.diff ? () => go({ diff: undefined }) : undefined}>
        <div className="grid grid-cols-3 gap-1.5">
          {difficulties.map((d) => {
            const m = DIFF_META[d.value];
            const isActive = active.diff === d.value;
            return (
              <button
                key={d.value}
                onClick={() => go({ diff: isActive ? undefined : d.value })}
                style={
                  isActive
                    ? {
                        backgroundColor: `color-mix(in srgb, ${m.color} 15%, transparent)`,
                        borderColor: `color-mix(in srgb, ${m.color} 45%, transparent)`,
                      }
                    : undefined
                }
                className={`flex flex-col items-start gap-1 rounded-lg border px-2 py-1.5 cursor-pointer transition-colors ${
                  isActive ? '' : 'border-border hover:border-dark-text/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-[11px] font-medium" style={{ color: isActive ? m.color : 'var(--color-light-text)' }}>
                    {m.label}
                  </span>
                </span>
                <span className="text-[10px] font-mono tabular-nums text-dark-text">{d.count}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Topic — rendered as a compact horizontal bar chart */}
      {topics.length > 0 && (
        <Section label="Topic" onClear={active.topic ? () => go({ topic: undefined }) : undefined}>
          <div className="space-y-0.5">
            {topics.map((t) => {
              const isActive = active.topic === t.name;
              const barPct = maxTopic > 0 && t.count > 0 ? Math.max(8, Math.round((t.count / maxTopic) * 100)) : 0;
              return (
                <button
                  key={t.name}
                  onClick={() => go({ topic: isActive ? undefined : t.name })}
                  className={`group relative w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 overflow-hidden text-left cursor-pointer transition-colors ${
                    t.count === 0 && !isActive ? 'opacity-40' : ''
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0.5 left-0 rounded-md transition-all duration-300 ease-out"
                    style={{
                      width: `${barPct}%`,
                      background: isActive
                        ? 'rgba(var(--color-primary-rgb), 0.18)'
                        : 'color-mix(in srgb, var(--color-border) 60%, transparent)',
                    }}
                  />
                  <span
                    className={`relative z-10 flex items-center gap-1.5 min-w-0 text-xs transition-colors ${
                      isActive ? 'text-primary font-medium' : 'text-light-text/90 group-hover:text-light-text'
                    }`}
                  >
                    {t.name === 'File Handling' && <FileText size={10} className="shrink-0 opacity-70" />}
                    <span className="truncate">{t.name}</span>
                  </span>
                  <span
                    className={`relative z-10 text-[10px] font-mono tabular-nums shrink-0 ${
                      isActive ? 'text-primary' : 'text-dark-text'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* Year + sessions */}
      {years.length > 0 && (
        <Section
          label="Year"
          onClear={active.year ? () => go({ year: undefined, session: undefined }) : undefined}
        >
          <div className="flex flex-wrap gap-1">
            {years.map(({ year, count }) => {
              const isActive = active.year === year;
              return (
                <button
                  key={year}
                  onClick={() =>
                    go(
                      isActive && !active.session
                        ? { year: undefined, session: undefined }
                        : { year: String(year), session: undefined }
                    )
                  }
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono tabular-nums cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                  }`}
                >
                  {year}
                  <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Sessions for the selected year */}
          {active.year &&
            (() => {
              const yg = years.find((y) => y.year === active.year);
              if (!yg || yg.sessions.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-1 mt-2 pl-2 border-l-2 border-primary/20">
                  {yg.sessions.map((s) => {
                    const isActive = active.session === s.name;
                    return (
                      <button
                        key={s.name}
                        onClick={() =>
                          go(
                            isActive
                              ? { year: String(active.year), session: undefined }
                              : { year: String(active.year), session: s.name }
                          )
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-primary/15 border-primary/40 text-primary'
                            : 'border-border/70 text-dark-text hover:text-light-text'
                        }`}
                      >
                        {s.name}
                        <span className="font-mono opacity-60">{s.count}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
        </Section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Section label="Tags" onClear={active.tag ? () => go({ tag: undefined }) : undefined}>
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => {
              const isActive = active.tag === tag.name;
              return (
                <button
                  key={tag.name}
                  onClick={() => go({ tag: isActive ? undefined : tag.name })}
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-info/15 border-info/40 text-info'
                      : 'border-border/60 text-dark-text hover:border-info/30 hover:text-info/80 hover:bg-info/5'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
            {tags.length > TAG_COLLAPSED_LIMIT && (
              <button
                onClick={() => setTagsExpanded((v) => !v)}
                className="text-[10px] px-2 py-0.5 rounded-full text-primary/80 hover:text-primary font-medium cursor-pointer transition-colors"
              >
                {tagsExpanded ? 'Show less' : `+${tags.length - TAG_COLLAPSED_LIMIT} more`}
              </button>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({
  label,
  onClear,
  children,
}: {
  label: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="mono-label text-dark-text">{label}</span>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[10px] text-dark-text hover:text-error transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ChipStat({
  label,
  count,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={
        active && color
          ? {
              backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
              color,
            }
          : undefined
      }
      className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 cursor-pointer transition-colors ${
        active
          ? color
            ? ''
            : 'bg-primary/15 border-primary/40 text-primary'
          : 'border-border text-dark-text hover:border-dark-text/40 hover:text-light-text'
      }`}
    >
      <span className="text-[11px] font-medium">{label}</span>
      <span className="text-[10px] font-mono tabular-nums opacity-80">{count}</span>
    </button>
  );
}
