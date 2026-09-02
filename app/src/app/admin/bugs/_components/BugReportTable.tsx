'use client';

import { useState, Fragment } from 'react';
import type { BugReport, BugStatus } from '@prisma/client';

interface Props {
  reports: BugReport[];
}

const CATEGORY_FILTERS = ['all', 'bug', 'suggestion', 'other'] as const;
const STATUS_FILTERS = ['all', 'OPEN', 'IN_PROGRESS', 'FIXED', 'WONT_FIX'] as const;

const STATUS_META: Record<BugStatus, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'text-error border-error/40 bg-error/10' },
  IN_PROGRESS: { label: 'In progress', color: 'text-warning border-warning/40 bg-warning/10' },
  FIXED: { label: 'Fixed', color: 'text-success border-success/40 bg-success/10' },
  WONT_FIX: { label: "Won't fix", color: 'text-dark-text border-border bg-background' },
};

export default function BugReportTable({ reports }: Props) {
  const [rows, setRows] = useState(reports);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contextId, setContextId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = rows.filter(
    (r) =>
      (categoryFilter === 'all' || r.category === categoryFilter) &&
      (statusFilter === 'all' || r.status === statusFilter),
  );

  async function updateStatus(id: string, status: BugStatus) {
    setBusyId(id);
    const res = await fetch(`/api/admin/bugs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (res.ok) {
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-dark-text w-16">Category:</span>
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
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-dark-text w-16">Status:</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                statusFilter === s
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {s === 'all' ? 'all' : STATUS_META[s as BugStatus].label}
            </button>
          ))}
          <span className="ml-auto text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-260px)] scrollbar-pretty">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-44">Email</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Category</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Status</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Description</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Context</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-dark-text">No reports match the current filter.</td>
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
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        disabled={busyId === r.id}
                        onChange={(e) => updateStatus(r.id, e.target.value as BugStatus)}
                        className={`rounded border text-[10px] font-medium px-1.5 py-1 cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_META[r.status].color}`}
                      >
                        {(Object.keys(STATUS_META) as BugStatus[]).map((s) => (
                          <option key={s} value={s} className="bg-surface text-light-text">
                            {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className="px-4 py-3 text-dark-text max-w-xs cursor-pointer"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      title={r.description}
                    >
                      <p className={expandedId === r.id ? 'whitespace-pre-wrap break-words' : 'truncate'}>{r.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      {r.code || r.output
                        ? (
                          <button
                            onClick={() => setContextId(contextId === r.id ? null : r.id)}
                            className="px-2 py-0.5 rounded border border-border text-[10px] text-primary hover:bg-primary/10 transition-colors"
                          >
                            {contextId === r.id ? 'Hide' : 'View'}
                          </button>
                        )
                        : <span className="italic text-dark-text/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40" title={r.pageUrl ?? undefined}>
                      {r.pageUrl ?? <span className="italic text-dark-text/40">—</span>}
                    </td>
                  </tr>
                  {contextId === r.id && (r.code || r.output) && (
                    <tr className="bg-background/40">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="grid gap-3 lg:grid-cols-2">
                          {r.code && (
                            <div className="min-w-0">
                              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dark-text">Code</p>
                              <pre className="text-[11px] leading-relaxed font-mono text-light-text bg-background border border-border rounded-lg p-3 overflow-x-auto scrollbar-pretty whitespace-pre">
                                {r.code}
                              </pre>
                            </div>
                          )}
                          {r.output && (
                            <div className="min-w-0">
                              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dark-text">Output</p>
                              <pre className="text-[11px] leading-relaxed font-mono text-light-text bg-background border border-border rounded-lg p-3 overflow-x-auto scrollbar-pretty whitespace-pre-wrap break-words">
                                {r.output}
                              </pre>
                            </div>
                          )}
                        </div>
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
