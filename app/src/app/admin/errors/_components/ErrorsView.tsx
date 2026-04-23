'use client';

import { useState } from 'react';
import type { ErrorLog } from '@prisma/client';

interface GroupedError {
  errorMessage: string;
  errorType: string;
  _count: { _all: number };
}

interface Props {
  recent: ErrorLog[];
  grouped: GroupedError[];
}

export default function ErrorsView({ recent, grouped }: Props) {
  const [view, setView] = useState<'frequency' | 'log'>('frequency');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredGrouped = grouped.filter(
    (g) => typeFilter === 'all' || g.errorType === typeFilter,
  );
  const filteredRecent = recent.filter(
    (e) => typeFilter === 'all' || e.errorType === typeFilter,
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border overflow-hidden text-xs">
          {(['frequency', 'log'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 transition-colors capitalize ${
                view === v
                  ? 'bg-primary/15 text-primary'
                  : 'text-dark-text hover:text-light-text hover:bg-border/30'
              }`}
            >
              {v === 'frequency' ? 'By frequency' : 'Recent log'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dark-text">Type:</span>
          {['all', 'parse', 'runtime'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                typeFilter === t
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency view */}
      {view === 'frequency' && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filteredGrouped.length === 0 && (
              <p className="px-5 py-8 text-sm text-center text-dark-text">No errors logged yet.</p>
            )}
            {filteredGrouped.map((g, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                <span className="text-sm font-bold text-dark-text w-6 shrink-0 mt-0.5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-light-text/90 break-words">{g.errorMessage}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColor(g.errorType)}`}>
                    {g.errorType}
                  </span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded">
                    ×{g._count._all}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent log view */}
      {view === 'log' && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-background/40">
                  <th className="text-left px-4 py-3 text-dark-text font-medium w-36">Date</th>
                  <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Type</th>
                  <th className="text-left px-4 py-3 text-dark-text font-medium w-14">Line</th>
                  <th className="text-left px-4 py-3 text-dark-text font-medium">Message</th>
                  <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecent.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-dark-text">No errors logged yet.</td>
                  </tr>
                )}
                {filteredRecent.map((e) => (
                  <tr key={e.id} className="hover:bg-border/10 transition-colors">
                    <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColor(e.errorType)}`}>
                        {e.errorType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-dark-text">
                      {e.line ?? <span className="text-dark-text/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-light-text/80 max-w-xs">
                      <p className="truncate">{e.errorMessage}</p>
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40">
                      {e.email ?? <span className="italic text-dark-text/40">Anonymous</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function typeColor(type: string) {
  return type === 'parse'
    ? 'text-warning border-warning/40 bg-warning/10'
    : 'text-error border-error/40 bg-error/10';
}
