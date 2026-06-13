'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X, ArrowDownNarrowWide } from 'lucide-react';
import {
  buildPracticeUrl,
  SORT_KEYS,
  SORT_META,
  DIFF_META,
  STATUS_META,
  type ActiveFilters,
} from './filterUtils';

interface Props {
  filteredCount: number;
  totalCount: number;
  active: ActiveFilters;
}

/**
 * Command-bar that sits above the question list: a live results meter on the
 * left, a sort control on the right, and a row of removable filter chips that
 * mirror whatever facets are currently narrowing the set.
 */
export function PracticeToolbar({ filteredCount, totalCount, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = (overrides: Record<string, string | undefined>) =>
    router.push(buildPracticeUrl(searchParams.toString(), overrides));

  const pct = totalCount > 0 ? Math.round((filteredCount / totalCount) * 100) : 0;

  const chips: { key: string; label: string; tone: 'primary' | 'info' | 'diff' | 'status'; color?: string; clear: Record<string, string | undefined> }[] = [];
  if (active.diff) {
    chips.push({
      key: 'diff',
      label: DIFF_META[active.diff].label,
      tone: 'diff',
      color: DIFF_META[active.diff].color,
      clear: { diff: undefined },
    });
  }
  if (active.status) {
    chips.push({
      key: 'status',
      label: STATUS_META[active.status].label,
      tone: 'status',
      color: STATUS_META[active.status].color,
      clear: { status: undefined },
    });
  }
  if (active.topic) {
    chips.push({ key: 'topic', label: active.topic, tone: 'primary', clear: { topic: undefined } });
  }
  if (active.year) {
    chips.push({
      key: 'year',
      label: active.session ? `${active.year} · ${active.session}` : String(active.year),
      tone: 'primary',
      clear: { year: undefined, session: undefined },
    });
  }
  if (active.tag) {
    chips.push({ key: 'tag', label: active.tag, tone: 'info', clear: { tag: undefined } });
  }
  if (active.q) {
    chips.push({ key: 'q', label: `“${active.q}”`, tone: 'primary', clear: { q: undefined } });
  }

  return (
    <div className="mb-5">
      {/* Meter + sort row */}
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-light-text tabular-nums leading-none">
              {filteredCount}
            </span>
            <span className="text-xs text-dark-text">
              {filteredCount === totalCount ? 'questions' : `of ${totalCount} questions`}
            </span>
          </div>
          {/* slim results meter */}
          <div className="mt-2 h-1 w-40 max-w-full rounded-full bg-border/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.max(filteredCount > 0 ? 4 : 0, pct)}%` }}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ArrowDownNarrowWide size={13} className="text-dark-text" />
          <div className="flex rounded-lg border border-border bg-surface p-0.5">
            {SORT_KEYS.map((key) => {
              const isActive = active.sort === key;
              return (
                <button
                  key={key}
                  onClick={() => go({ sort: key === 'year' ? undefined : key })}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-dark-text hover:text-light-text'
                  }`}
                >
                  {SORT_META[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5 animate-fade-in">
          {chips.map((c) => {
            const toneCls =
              c.tone === 'info'
                ? 'bg-info/10 border-info/30 text-info'
                : c.tone === 'diff' || c.tone === 'status'
                  ? 'border-transparent text-light-text'
                  : 'bg-primary/10 border-primary/30 text-primary';
            const toneStyle =
              c.tone === 'diff' || c.tone === 'status'
                ? {
                    backgroundColor: `color-mix(in srgb, ${c.color} 14%, transparent)`,
                    borderColor: `color-mix(in srgb, ${c.color} 40%, transparent)`,
                    color: c.color,
                  }
                : undefined;
            return (
              <span
                key={c.key}
                style={toneStyle}
                className={`inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full border text-[11px] font-medium ${toneCls}`}
              >
                {c.label}
                <button
                  onClick={() => go(c.clear)}
                  className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label={`Remove ${c.label} filter`}
                >
                  <X size={11} />
                </button>
              </span>
            );
          })}
          <button
            onClick={() => router.push('/practice')}
            className="ml-1 text-[11px] text-dark-text hover:text-error transition-colors cursor-pointer underline underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
