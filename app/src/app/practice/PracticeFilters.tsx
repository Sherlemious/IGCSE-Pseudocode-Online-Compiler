'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

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
}

export function PracticeFilters({
  topics,
  yearGroups,
  allTags,
  activeTopic,
  activeYear,
  activeSession,
  activeTag,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    activeYear ? new Set([activeYear]) : new Set()
  );

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(overrides)) {
      if (val === undefined) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    const qs = params.toString();
    return qs ? `/practice?${qs}` : '/practice';
  }

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function selectYear(year: number) {
    const isActive = activeYear === year && !activeSession;
    router.push(
      buildUrl(isActive ? { year: undefined, session: undefined } : { year: String(year), session: undefined })
    );
    if (!expandedYears.has(year)) setExpandedYears((prev) => new Set([...prev, year]));
  }

  function selectSession(year: number, session: string) {
    const isActive = activeYear === year && activeSession === session;
    router.push(
      buildUrl(isActive ? { year: undefined, session: undefined } : { year: String(year), session })
    );
  }

  return (
    <div className="space-y-3 mb-6">
      {/* ── Topic chips ── */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push(buildUrl({ topic: undefined }))}
            className={`px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
              !activeTopic
                ? 'bg-primary/20 border-primary/50 text-primary'
                : 'border-border text-dark-text hover:border-primary/40 hover:text-light-text'
            }`}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => router.push(buildUrl({ topic: activeTopic === t ? undefined : t }))}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs transition-colors cursor-pointer ${
                activeTopic === t
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'border-border text-dark-text hover:border-primary/40 hover:text-light-text'
              }`}
            >
              {t === 'File Handling' && <FileText size={10} />}
              {t}
            </button>
          ))}
        </div>
      )}

      {/* ── Year / Session tree ── */}
      {yearGroups.length > 0 && (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="px-3 py-1.5 border-b border-border/50 flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-dark-text/60">
              Year &amp; Session
            </span>
            {activeYear && (
              <button
                onClick={() => router.push(buildUrl({ year: undefined, session: undefined }))}
                className="ml-auto text-[10px] text-primary/60 hover:text-primary transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => router.push(buildUrl({ year: undefined, session: undefined }))}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                !activeYear
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-dark-text hover:bg-white/5 hover:text-light-text'
              }`}
            >
              All years
            </button>

            {yearGroups.map(({ year, sessions }) => {
              const isYearActive = activeYear === year;
              const isExpanded = expandedYears.has(year);

              return (
                <div key={year}>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => toggleYear(year)}
                      className="p-0.5 text-dark-text/40 hover:text-light-text transition-colors cursor-pointer shrink-0"
                    >
                      {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                    </button>
                    <button
                      onClick={() => selectYear(year)}
                      className={`flex-1 text-left px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isYearActive && !activeSession
                          ? 'bg-primary/15 text-primary'
                          : 'text-dark-text hover:bg-white/5 hover:text-light-text'
                      }`}
                    >
                      {year}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="ml-5 mb-1 space-y-0.5">
                      {sessions.map((s) => (
                        <button
                          key={s}
                          onClick={() => selectSession(year, s)}
                          className={`w-full text-left px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                            isYearActive && activeSession === s
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-dark-text/60 hover:bg-white/5 hover:text-light-text'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tag chips ── */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-dark-text/60 shrink-0">
            Tags:
          </span>
          {activeTag && (
            <button
              onClick={() => router.push(buildUrl({ tag: undefined }))}
              className="text-[10px] text-primary/60 hover:text-primary transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(buildUrl({ tag: activeTag === tag ? undefined : tag }))}
              className={`px-2.5 py-0.5 rounded-full border text-[11px] transition-colors cursor-pointer ${
                activeTag === tag
                  ? 'bg-info/15 border-info/40 text-info'
                  : 'border-border text-dark-text/70 hover:border-primary/40 hover:text-light-text'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
