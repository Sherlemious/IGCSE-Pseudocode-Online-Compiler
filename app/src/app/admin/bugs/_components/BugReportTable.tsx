'use client';

import { useState } from 'react';
import type { BugReport, BugStatus } from '@prisma/client';
import { ChevronRight } from 'lucide-react';
import AdminDrawer from '../../_components/AdminDrawer';
import { Chip, ChipRow, EmptyState, formatAdminDate, formatRelative, MetaField } from '../../_components/adminUi';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = rows.filter(
    (r) =>
      (categoryFilter === 'all' || r.category === categoryFilter) &&
      (statusFilter === 'all' || r.status === statusFilter),
  );

  const selected = filtered.find((r) => r.id === selectedId) ?? rows.find((r) => r.id === selectedId) ?? null;

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
      <div className="flex flex-col gap-3">
        <ChipRow label="Category">
          {CATEGORY_FILTERS.map((c) => (
            <Chip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>
              {c === 'all' ? 'All' : c}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Status">
          {STATUS_FILTERS.map((s) => (
            <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : STATUS_META[s as BugStatus].label}
            </Chip>
          ))}
        </ChipRow>
        <p className="text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>No reports match the current filter.</EmptyState>
      ) : (
        <>
          <ul className="md:hidden space-y-2">
            {filtered.map((r) => (
              <li key={r.id}>
                <article className="rounded-2xl border border-border bg-surface p-3">
                  <button type="button" onClick={() => setSelectedId(r.id)} className="w-full flex items-start gap-2.5 text-left">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-dark-text truncate">{r.email ?? 'Anonymous'}</p>
                      <p className="text-sm text-light-text/80 line-clamp-2 mt-0.5">{r.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-dark-text/40 shrink-0 mt-1" />
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${categoryColor(r.category)}`}>
                      {r.category}
                    </span>
                    <StatusSelect
                      status={r.status}
                      disabled={busyId === r.id}
                      onChange={(status) => updateStatus(r.id, status)}
                    />
                    <span className="ml-auto text-[10px] text-dark-text/60 font-mono">{formatRelative(r.createdAt)}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-260px)] scrollbar-pretty">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-44">Email</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Category</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Status</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Description</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Page</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`cursor-pointer transition-colors align-top ${selectedId === r.id ? 'bg-primary/10' : 'hover:bg-border/10'}`}
                    >
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
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          status={r.status}
                          disabled={busyId === r.id}
                          onChange={(status) => updateStatus(r.id, status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-dark-text max-w-xs">
                        <p className="truncate">{r.description}</p>
                      </td>
                      <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40" title={r.pageUrl ?? undefined}>
                        {r.pageUrl ?? <span className="italic text-dark-text/40">—</span>}
                      </td>
                      <td className="pr-3 pt-3">
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
          title={selected.category.charAt(0).toUpperCase() + selected.category.slice(1)}
          subtitle={selected.email ?? 'Anonymous'}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusSelect
                status={selected.status}
                disabled={busyId === selected.id}
                onChange={(status) => updateStatus(selected.id, status)}
                size="lg"
              />
              <span className="text-xs text-dark-text">{formatAdminDate(selected.createdAt)}</span>
            </div>
            <p className="text-sm text-light-text whitespace-pre-wrap break-words leading-relaxed">{selected.description}</p>
            <dl className="grid gap-3">
              <MetaField label="Page" value={selected.pageUrl ?? '—'} mono />
              {selected.userAgent && <MetaField label="User agent" value={selected.userAgent} />}
            </dl>
            {selected.code && (
              <div>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dark-text">Code</p>
                <pre className="text-[11px] leading-relaxed font-mono text-light-text bg-background border border-border rounded-lg p-3 overflow-x-auto scrollbar-pretty whitespace-pre">
                  {selected.code}
                </pre>
              </div>
            )}
            {selected.output && (
              <div>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-dark-text">Output</p>
                <pre className="text-[11px] leading-relaxed font-mono text-light-text bg-background border border-border rounded-lg p-3 overflow-x-auto scrollbar-pretty whitespace-pre-wrap break-words">
                  {selected.output}
                </pre>
              </div>
            )}
          </div>
        </AdminDrawer>
      )}
    </div>
  );
}

function StatusSelect({
  status,
  disabled,
  onChange,
  size = 'sm',
}: {
  status: BugStatus;
  disabled: boolean;
  onChange: (status: BugStatus) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as BugStatus)}
      className={`${size === 'lg' ? 'text-sm px-3 py-2.5 rounded-xl' : 'text-[10px] px-1.5 py-1 rounded'} font-medium border cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_META[status].color}`}
    >
      {(Object.keys(STATUS_META) as BugStatus[]).map((s) => (
        <option key={s} value={s} className="bg-surface text-light-text">
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}

function categoryColor(category: string) {
  if (category === 'bug') return 'text-error border-error/40 bg-error/10';
  if (category === 'suggestion') return 'text-primary border-primary/40 bg-primary/10';
  return 'text-warning border-warning/40 bg-warning/10';
}
