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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      {/* ── Desktop Sidebar ───────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions…"
            value={activeQ ?? ''}
            onChange={(e) => router.push(buildUrl({ q: e.target.value || undefined }))}
            className="w-full pl-8 pr-7 py-2 bg-surface border border-border rounded-lg text-xs text-light-text placeholder:text-dark-text outline-none focus:border-primary/50 transition-colors"
          />
          {activeQ && (
            <button
              onClick={() => router.push(buildUrl({ q: undefined }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-text hover:text-light-text transition-colors"
              aria-label="Clear search"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Active filter pills */}
        {hasActiveFilter && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-text">Active filters</span>
              <button
                onClick={clearAll}
                className="text-[10px] text-dark-text hover:text-error transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeTopic && (
                <ActivePill label={activeTopic} onRemove={() => router.push(buildUrl({ topic: undefined }))} />
              )}
              {activeYear && (
                <ActivePill
                  label={activeSession ? `${activeYear} · ${activeSession}` : String(activeYear)}
                  onRemove={() => router.push(buildUrl({ year: undefined, session: undefined }))}
                />
              )}
              {activeTag && (
                <ActivePill label={activeTag} onRemove={() => router.push(buildUrl({ tag: undefined }))} color="info" />
              )}
              {activeQ && (
                <ActivePill label={`"${activeQ}"`} onRemove={() => router.push(buildUrl({ q: undefined }))} />
              )}
            </div>
          </div>
        )}

        {/* Topic section */}
        {topics.length > 0 && (
          <SidebarSection label="Topic">
            <SidebarItem active={!activeTopic} onClick={() => router.push(buildUrl({ topic: undefined }))}>
              All
            </SidebarItem>
            {topics.map((t) => (
              <SidebarItem
                key={t}
                active={activeTopic === t}
                onClick={() => router.push(buildUrl({ topic: activeTopic === t ? undefined : t }))}
              >
                {t === 'File Handling' && <FileText size={10} className="shrink-0 opacity-70" />}
                {t}
              </SidebarItem>
            ))}
          </SidebarSection>
        )}

        {/* Year section */}
        {yearGroups.length > 0 && (
          <SidebarSection label="Year">
            <SidebarItem
              active={!activeYear}
              onClick={() => router.push(buildUrl({ year: undefined, session: undefined }))}
            >
              All
            </SidebarItem>
            {yearGroups.map(({ year }) => (
              <SidebarItem
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
              </SidebarItem>
            ))}
          </SidebarSection>
        )}

        {/* Session sub-section */}
        {activeYear && activeSessions.length > 0 && (
          <SidebarSection label="Session" indent>
            {activeSessions.map((s) => (
              <SidebarItem
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
                small
              >
                {s}
              </SidebarItem>
            ))}
          </SidebarSection>
        )}

        {/* Tags section */}
        {allTags.length > 0 && (
          <SidebarSection label="Tags">
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(buildUrl({ tag: activeTag === tag ? undefined : tag }))}
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-all cursor-pointer ${
                    activeTag === tag
                      ? 'bg-info/15 border-info/40 text-info'
                      : 'border-border/60 text-dark-text hover:border-info/30 hover:text-info/70 hover:bg-info/5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </SidebarSection>
        )}
      </div>

      {/* ── Mobile Compact Bar ────────────────────────────────────── */}
      <div className="lg:hidden mb-5">
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Search + toggle row */}
          <div className="flex items-center gap-2 px-3 py-2">
            <Search size={13} className="text-dark-text shrink-0" />
            <input
              type="text"
              placeholder="Search questions…"
              value={activeQ ?? ''}
              onChange={(e) => router.push(buildUrl({ q: e.target.value || undefined }))}
              className="flex-1 bg-transparent text-xs text-light-text placeholder:text-dark-text outline-none min-w-0"
            />
            {activeQ && (
              <button
                onClick={() => router.push(buildUrl({ q: undefined }))}
                className="text-dark-text hover:text-light-text transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
            <div className="w-px h-4 bg-border/60 mx-0.5 shrink-0" />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-medium text-dark-text hover:text-light-text transition-colors shrink-0"
            >
              <SlidersHorizontal size={12} />
              <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Expandable filter rows */}
          {mobileOpen && (
            <div className="border-t border-border/40 p-3 space-y-3">
              {topics.length > 0 && (
                <MobileFilterRow label="Topic">
                  <FilterChip active={!activeTopic} onClick={() => router.push(buildUrl({ topic: undefined }))}>All</FilterChip>
                  {topics.map((t) => (
                    <FilterChip
                      key={t}
                      active={activeTopic === t}
                      onClick={() => router.push(buildUrl({ topic: activeTopic === t ? undefined : t }))}
                    >
                      {t}
                    </FilterChip>
                  ))}
                </MobileFilterRow>
              )}
              {yearGroups.length > 0 && (
                <MobileFilterRow label="Year">
                  <FilterChip active={!activeYear} onClick={() => router.push(buildUrl({ year: undefined, session: undefined }))}>All</FilterChip>
                  {yearGroups.map(({ year }) => (
                    <FilterChip
                      key={year}
                      active={activeYear === year}
                      onClick={() =>
                        router.push(
                          buildUrl(
                            activeYear === year
                              ? { year: undefined, session: undefined }
                              : { year: String(year), session: undefined }
                          )
                        )
                      }
                    >
                      {year}
                    </FilterChip>
                  ))}
                </MobileFilterRow>
              )}
              {activeYear && activeSessions.length > 0 && (
                <MobileFilterRow label="Session" indent>
                  {activeSessions.map((s) => (
                    <FilterChip
                      key={s}
                      active={activeSession === s}
                      size="sm"
                      onClick={() =>
                        router.push(
                          buildUrl(
                            activeSession === s
                              ? { year: String(activeYear), session: undefined }
                              : { year: String(activeYear), session: s }
                          )
                        )
                      }
                    >
                      {s}
                    </FilterChip>
                  ))}
                </MobileFilterRow>
              )}
              {allTags.length > 0 && (
                <MobileFilterRow label="Tags">
                  {allTags.map((tag) => (
                    <FilterChip
                      key={tag}
                      active={activeTag === tag}
                      color="info"
                      onClick={() => router.push(buildUrl({ tag: activeTag === tag ? undefined : tag }))}
                    >
                      {tag}
                    </FilterChip>
                  ))}
                </MobileFilterRow>
              )}
              {hasActiveFilter && (
                <div className="pt-1 flex justify-end border-t border-border/30">
                  <button
                    onClick={clearAll}
                    className="text-[11px] text-dark-text hover:text-error transition-colors cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active filter pills (when collapsed) */}
        {hasActiveFilter && !mobileOpen && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2 px-0.5">
            {activeTopic && (
              <ActivePill label={activeTopic} onRemove={() => router.push(buildUrl({ topic: undefined }))} />
            )}
            {activeYear && (
              <ActivePill
                label={activeSession ? `${activeYear} · ${activeSession}` : String(activeYear)}
                onRemove={() => router.push(buildUrl({ year: undefined, session: undefined }))}
              />
            )}
            {activeTag && (
              <ActivePill label={activeTag} onRemove={() => router.push(buildUrl({ tag: undefined }))} color="info" />
            )}
            {activeQ && (
              <ActivePill label={`"${activeQ}"`} onRemove={() => router.push(buildUrl({ q: undefined }))} />
            )}
            <button
              onClick={clearAll}
              className="text-[10px] text-dark-text hover:text-dark-text transition-colors cursor-pointer underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SidebarSection({
  label,
  indent,
  children,
}: {
  label: string;
  indent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`text-[10px] uppercase tracking-wider font-semibold mb-1.5 ${
          indent ? 'text-primary/50 pl-2' : 'text-dark-text'
        }`}
      >
        {label}
      </div>
      <div className={`space-y-0.5 ${indent ? 'pl-2 border-l-2 border-border/30' : ''}`}>
        {children}
      </div>
    </div>
  );
}

function SidebarItem({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 text-left rounded-md px-2 py-1 cursor-pointer transition-all duration-150 ${
        small ? 'text-[11px]' : 'text-xs'
      } ${
        active
          ? 'text-primary bg-primary/10'
          : 'text-dark-text hover:text-light-text hover:bg-surface'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 ${
          active ? 'bg-primary' : 'bg-transparent'
        }`}
      />
      <span className="flex items-center gap-1">{children}</span>
    </button>
  );
}

function MobileFilterRow({
  label,
  indent,
  children,
}: {
  label: string;
  indent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={indent ? 'pl-3 border-l border-border/40' : ''}>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-text mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function FilterChip({
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
  const activeCls =
    color === 'info'
      ? 'bg-info/15 border-info/40 text-info'
      : 'bg-primary/20 border-primary/50 text-primary';
  const inactiveCls =
    color === 'info'
      ? 'border-border text-dark-text hover:border-info/30 hover:text-info/80 hover:bg-info/5'
      : 'border-border/70 text-dark-text hover:border-primary/40 hover:text-light-text hover:bg-primary/5';
  return (
    <button onClick={onClick} className={`${base} ${sz} ${active ? activeCls : inactiveCls}`}>
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
