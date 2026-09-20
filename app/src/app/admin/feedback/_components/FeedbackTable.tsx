'use client';

import { useState } from 'react';
import type { FeedbackSubmission } from '@prisma/client';
import { ChevronRight } from 'lucide-react';
import AdminDrawer from '../../_components/AdminDrawer';
import { Chip, ChipRow, EmptyState, formatAdminDate, formatRelative } from '../../_components/adminUi';

interface Props {
  submissions: FeedbackSubmission[];
}

export default function FeedbackTable({ submissions }: Props) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (ratingFilter !== null && s.rating !== ratingFilter) return false;
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false;
    return true;
  });

  const selected = filtered.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <ChipRow label="Rating">
          {[null, 1, 2, 3, 4, 5].map((r) => (
            <Chip key={r ?? 'all'} active={ratingFilter === r} onClick={() => setRatingFilter(r)}>
              {r ?? 'All'}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Tier">
          {['all', 'low', 'mid', 'high'].map((t) => (
            <Chip key={t} active={tierFilter === t} onClick={() => setTierFilter(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Chip>
          ))}
        </ChipRow>
        <p className="text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>No submissions match the current filters.</EmptyState>
      ) : (
        <>
          <ul className="md:hidden space-y-2">
            {filtered.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className="w-full rounded-2xl border border-border bg-surface p-3 text-left"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-0.5 text-xs font-bold font-mono px-1.5 py-0.5 rounded border ${ratingColor(s.rating)}`}>
                      {s.rating}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-dark-text truncate">{s.email ?? 'Anonymous'}</p>
                      <p className="text-sm text-light-text/80 line-clamp-2 mt-0.5">
                        {s.comment || <span className="italic text-dark-text/40">No comment</span>}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${tierColor(s.tier)}`}>
                          {s.tier}
                        </span>
                        {s.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-border/30 text-dark-text border border-border">
                            {tag}
                          </span>
                        ))}
                        <span className="ml-auto text-[10px] text-dark-text/60 font-mono">{formatRelative(s.createdAt)}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-dark-text/40 shrink-0 mt-1" />
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-240px)] scrollbar-pretty">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-44">Email</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Rating</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Tier</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Tags</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Comment</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`cursor-pointer transition-colors ${selectedId === s.id ? 'bg-primary/10' : 'hover:bg-border/10'}`}
                    >
                      <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-dark-text truncate max-w-0 w-44">
                        {s.email ?? <span className="italic text-dark-text/50">Anonymous</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${ratingColor(s.rating)}`}>
                          {s.rating}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${tierColor(s.tier)}`}>
                          {s.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-border/30 text-dark-text border border-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-dark-text max-w-xs">
                        {s.comment
                          ? <p className="truncate">{s.comment}</p>
                          : <span className="italic text-dark-text/40">—</span>}
                      </td>
                      <td className="pr-3">
                        <ChevronRight size={14} className="text-dark-text/40" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selected && (
        <AdminDrawer
          open
          onClose={() => setSelectedId(null)}
          title={`Rating ${selected.rating}/5`}
          subtitle={selected.email ?? 'Anonymous'}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${ratingColor(selected.rating)}`}>
                {selected.rating}
              </span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${tierColor(selected.tier)}`}>
                {selected.tier}
              </span>
              {selected.tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded-full text-[10px] bg-border/30 text-dark-text border border-border">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-dark-text">{formatAdminDate(selected.createdAt)}</p>
            {selected.comment ? (
              <p className="text-sm text-light-text whitespace-pre-wrap break-words leading-relaxed">{selected.comment}</p>
            ) : (
              <p className="text-sm italic text-dark-text/50">No comment</p>
            )}
          </div>
        </AdminDrawer>
      )}
    </div>
  );
}

function ratingColor(r: number) {
  if (r <= 2) return 'text-error border-error/40 bg-error/10';
  if (r === 3) return 'text-warning border-warning/40 bg-warning/10';
  return 'text-success border-success/40 bg-success/10';
}

function tierColor(tier: string) {
  if (tier === 'low') return 'text-error border-error/40 bg-error/10';
  if (tier === 'mid') return 'text-warning border-warning/40 bg-warning/10';
  return 'text-success border-success/40 bg-success/10';
}
