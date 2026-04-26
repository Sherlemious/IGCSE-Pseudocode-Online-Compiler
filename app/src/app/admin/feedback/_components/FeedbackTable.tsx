'use client';

import { useState } from 'react';
import type { FeedbackSubmission } from '@prisma/client';

interface Props {
  submissions: FeedbackSubmission[];
}

export default function FeedbackTable({ submissions }: Props) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<string>('all');

  const filtered = submissions.filter((s) => {
    if (ratingFilter !== null && s.rating !== ratingFilter) return false;
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dark-text">Rating:</span>
          {[null, 1, 2, 3, 4, 5].map((r) => (
            <button
              key={r ?? 'all'}
              onClick={() => setRatingFilter(r)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                ratingFilter === r
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {r ?? 'All'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dark-text">Tier:</span>
          {['all', 'low', 'mid', 'high'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                tierFilter === t
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-240px)]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-44">Email</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Rating</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Tier</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Tags</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-dark-text">No submissions match the current filters.</td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-border/10 transition-colors">
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
                    <p className="truncate">{s.comment ?? <span className="italic text-dark-text/40">—</span>}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
