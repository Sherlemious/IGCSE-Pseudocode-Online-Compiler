'use client';

import { useState, Fragment } from 'react';
import type { BugReport } from '@prisma/client';

interface Props {
  reports: BugReport[];
}

const CATEGORY_FILTERS = ['all', 'bug', 'suggestion', 'other'] as const;

export default function BugReportTable({ reports }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [codeId, setCodeId] = useState<string | null>(null);

  const filtered = reports.filter((r) => categoryFilter === 'all' || r.category === categoryFilter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-dark-text">Category:</span>
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2.5 py-1 rounded-lg text-xs border capitalize transition-colors ${
                categoryFilter === c
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="sm:ml-auto text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-240px)] scrollbar-pretty">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-44">Email</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Category</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Description</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Code</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-dark-text">No reports match the current filter.</td>
                </tr>
              )}
              {filtered.map((r) => (
                <Fragment key={r.id}>
                  <tr className="hover:bg-border/10 transition-colors align-top">
                    <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-44">
                      {r.email ?? <span className="italic text-dark-text/50">Anonymous</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${categoryColor(r.category)}`}>
                        {r.category}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-dark-text max-w-xs cursor-pointer"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      title={r.description}
                    >
                      <p className={expandedId === r.id ? 'whitespace-pre-wrap break-words' : 'truncate'}>{r.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      {r.code
                        ? (
                          <button
                            onClick={() => setCodeId(codeId === r.id ? null : r.id)}
                            className="px-2 py-0.5 rounded border border-border text-[10px] text-primary hover:bg-primary/10 transition-colors"
                          >
                            {codeId === r.id ? 'Hide code' : 'View code'}
                          </button>
                        )
                        : <span className="italic text-dark-text/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40" title={r.pageUrl ?? undefined}>
                      {r.pageUrl ?? <span className="italic text-dark-text/40">—</span>}
                    </td>
                  </tr>
                  {codeId === r.id && r.code && (
                    <tr className="bg-background/40">
                      <td colSpan={6} className="px-4 py-3">
                        <pre className="text-[11px] leading-relaxed font-mono text-light-text bg-background border border-border rounded-lg p-3 overflow-x-auto scrollbar-pretty whitespace-pre">
                          {r.code}
                        </pre>
                        {r.userAgent && (
                          <p className="mt-2 text-[10px] text-dark-text/50 break-words">{r.userAgent}</p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function categoryColor(category: string) {
  if (category === 'bug') return 'text-error border-error/40 bg-error/10';
  if (category === 'suggestion') return 'text-primary border-primary/40 bg-primary/10';
  return 'text-warning border-warning/40 bg-warning/10';
}
