'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, SlidersHorizontal, FileText, Search, ChevronDown } from 'lucide-react';

interface YearGroup {
  year: number;
  sessions: string[];
}

interface Props {
  topics: string[];
  yearGroups: YearGroup[];
  allTags: string[];
  activeTopic?: string;
  activeYear?: number;
  activeSession?: string;
  activeTag?: string;
  activeQ?: string;
}

export function PracticeFilters({
  topics,
  yearGroups,
  allTags,
  activeTopic,
  activeYear,
  activeSession,
  activeTag,
  activeQ,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(true);

  const activeFilterCount = [activeTopic, activeYear, activeTag].filter(Boolean).length;
  const hasActiveFilter = !!(activeTopic || activeYear || activeTag || activeQ);

  const activeSessions = activeYear
    ? (yearGroups.find((g) => g.year === activeYear)?.sessions ?? [])
    : [];

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(overrides)) {
      if (val === undefined) params.delete(key);
      else params.set(key, val);
    }
    const qs = params.toString();
    return qs ? `/practice?${qs}` : '/practice';
  }

  function clearAll() {
    router.push('/practice');
  }

  return (
    <div
      className="mb-6 sticky top-0 z-20"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* bottom fade so content doesn't hard-cut under the panel */}
      <div className="pb-3 [box-shadow:0_8px_16px_4px_var(--color-background)]">

        {/* ── Unified filter panel ── */}
        <div className="rounded-xl border border-border bg-surface overflow-hidden divide-y divide-border/40">

          {/* Search + toggle row */}
          <div className="flex items-center gap-2 px-3 py-2">
            <Search size={13} className="text-dark-text/50 shrink-0" />
            <input
              type="text"
              placeholder="Search questions…"
              value={activeQ ?? ''}
              onChange={(e) => router.push(buildUrl({ q: e.target.value || undefined }))}
              className="flex-1 bg-transparent text-xs text-light-text placeholder:text-dark-text/40 outline-none min-w-0"
            />
            {activeQ && (
              <button
                onClick={() => router.push(buildUrl({ q: undefined }))}
                className="text-dark-text/40 hover:text-dark-text transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
            <div className="w-px h-4 bg-border/60 shrink-0 mx-0.5" />
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-medium text-dark-text/60 hover:text-light-text transition-colors shrink-0"
              title={filtersOpen ? 'Hide filters' : 'Show filters'}
            >
              <SlidersHorizontal size={12} />
              <span className="hidden sm:inline">
                {filtersOpen ? 'Filters' : `Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${filtersOpen ? '' : '-rotate-90'}`}
              />
            </button>
          </div>

          {/* Collapsible filter rows */}
          {filtersOpen && (
            <>
              {/* Topic row */}
              {topics.length > 0 && (
                <FilterRow label="Topic">
                  <Chip
                    active={!activeTopic}
                    onClick={() => router.push(buildUrl({ topic: undefined }))}
                  >
                    All
                  </Chip>
                  {topics.map((t) => (
                    <Chip
                      key={t}
                      active={activeTopic === t}
                      onClick={() => router.push(buildUrl({ topic: activeTopic === t ? undefined : t }))}
                    >
                      {t === 'File Handling' && <FileText size={10} className="shrink-0" />}
                      {t}
                    </Chip>
                  ))}
                </FilterRow>
              )}

              {/* Year row */}
              {yearGroups.length > 0 && (
                <FilterRow label="Year">
                  <Chip
                    active={!activeYear}
                    onClick={() => router.push(buildUrl({ year: undefined, session: undefined }))}
                  >
                    All
                  </Chip>
                  {yearGroups.map(({ year }) => (
                    <Chip
                      key={year}
                      active={activeYear === year}
                      onClick={() =>
                        router.push(
                          buildUrl(
                            activeYear === year && !activeSession
                              ? { year: undefined, session: undefined }
                              : { year: String(year), session: undefined }
                          )
                        )
                      }
                    >
                      {year}
                    </Chip>
                  ))}
                </FilterRow>
              )}

              {/* Session sub-row */}
              {activeYear && activeSessions.length > 0 && (
                <FilterRow label="Session" indent>
                  {activeSessions.map((s) => (
                    <Chip
                      key={s}
                      active={activeSession === s}
                      onClick={() =>
                        router.push(
                          buildUrl(
                            activeSession === s
                              ? { year: String(activeYear), session: undefined }
                              : { year: String(activeYear), session: s }
                          )
                        )
                      }
                      size="sm"
                    >
                      {s}
                    </Chip>
                  ))}
                </FilterRow>
              )}

              {/* Tags row */}
              {allTags.length > 0 && (
                <FilterRow label="Tags">
                  {allTags.map((tag) => (
                    <Chip
                      key={tag}
                      active={activeTag === tag}
                      onClick={() => router.push(buildUrl({ tag: activeTag === tag ? undefined : tag }))}
                      color="info"
                    >
                      {tag}
                    </Chip>
                  ))}
                </FilterRow>
              )}
            </>
          )}
        </div>

        {/* ── Active filter pills (shown below panel when filters are collapsed) ── */}
        {hasActiveFilter && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2 px-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-dark-text/50 shrink-0 flex items-center gap-1">
              <SlidersHorizontal size={10} />
              Active:
            </span>
            {activeTopic && (
              <ActivePill
                label={activeTopic}
                onRemove={() => router.push(buildUrl({ topic: undefined }))}
              />
            )}
            {activeYear && (
              <ActivePill
                label={activeSession ? `${activeYear} · ${activeSession}` : String(activeYear)}
                onRemove={() => router.push(buildUrl({ year: undefined, session: undefined }))}
              />
            )}
            {activeTag && (
              <ActivePill
                label={activeTag}
                onRemove={() => router.push(buildUrl({ tag: undefined }))}
                color="info"
              />
            )}
            {activeQ && (
              <ActivePill
                label={`"${activeQ}"`}
                onRemove={() => router.push(buildUrl({ q: undefined }))}
              />
            )}
            <button
              onClick={clearAll}
              className="text-[10px] text-dark-text/40 hover:text-dark-text transition-colors cursor-pointer underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterRow({
  label,
  indent,
  children,
}: {
  label: string;
  indent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex items-start gap-3 px-3 py-1.5 ${indent ? 'bg-primary/[0.03]' : ''}`}>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 pt-0.5 w-14 text-right ${
          indent ? 'text-primary/40' : 'text-dark-text/50'
        }`}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5 flex-1">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  color = 'primary',
  size = 'md',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: 'primary' | 'info';
  size?: 'md' | 'sm';
}) {
  const base = 'inline-flex items-center gap-1 rounded-full border font-medium transition-all duration-150 cursor-pointer select-none';
  const sz = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  const active_cls =
    color === 'info'
      ? 'bg-info/15 border-info/40 text-info'
      : 'bg-primary/20 border-primary/50 text-primary';
  const inactive_cls =
    color === 'info'
      ? 'border-border text-dark-text/60 hover:border-info/30 hover:text-info/80 hover:bg-info/5'
      : 'border-border/70 text-dark-text/70 hover:border-primary/40 hover:text-light-text hover:bg-primary/5';

  return (
    <button onClick={onClick} className={`${base} ${sz} ${active ? active_cls : inactive_cls}`}>
      {children}
    </button>
  );
}

function ActivePill({
  label,
  onRemove,
  color = 'primary',
}: {
  label: string;
  onRemove: () => void;
  color?: 'primary' | 'info';
}) {
  const cls =
    color === 'info'
      ? 'bg-info/10 border-info/30 text-info'
      : 'bg-primary/10 border-primary/30 text-primary';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${cls}`}>
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </span>
  );
}
