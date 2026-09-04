'use client';

import { useState } from 'react';
import type { ContactMessage, ContactStatus } from '@prisma/client';

interface Props {
  messages: ContactMessage[];
}

const STATUS_FILTERS = ['all', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'] as const;

const STATUS_META: Record<ContactStatus, { label: string; color: string }> = {
  NEW: { label: 'New', color: 'text-error border-error/40 bg-error/10' },
  IN_PROGRESS: { label: 'In progress', color: 'text-warning border-warning/40 bg-warning/10' },
  RESOLVED: { label: 'Resolved', color: 'text-success border-success/40 bg-success/10' },
  ARCHIVED: { label: 'Archived', color: 'text-dark-text border-border bg-background' },
};

export default function ContactTable({ messages }: Props) {
  const [rows, setRows] = useState(messages);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = rows.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !m.email?.toLowerCase().includes(q) &&
        !m.name?.toLowerCase().includes(q) &&
        !m.message.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  async function updateStatus(id: string, status: ContactStatus) {
    setBusyId(id);
    const res = await fetch(`/api/admin/contact/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (res.ok) {
      setRows((rs) => rs.map((m) => (m.id === id ? { ...m, status } : m)));
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or message…"
          className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-light-text placeholder-dark-text/40 outline-none focus:border-primary/50 transition-colors w-64"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-dark-text">Status:</span>
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
              {s === 'all' ? 'All' : STATUS_META[s as ContactStatus].label}
            </button>
          ))}
        </div>
        <span className="sm:ml-auto text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-260px)] scrollbar-pretty">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Date</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-48">From</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Subject</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Status</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Message</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-dark-text">No messages match.</td>
                </tr>
              )}
              {filtered.map((m) => {
                const expanded = expandedId === m.id;
                return (
                  <tr key={m.id} className="hover:bg-border/10 transition-colors align-top">
                    <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 truncate max-w-0 w-48">
                      <p className="text-light-text truncate">{m.name ?? <span className="italic text-dark-text/50">Anonymous</span>}</p>
                      <p className="text-dark-text truncate">{m.email ?? <span className="italic text-dark-text/50">no email</span>}</p>
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-28" title={m.subject ?? undefined}>
                      {m.subject ?? <span className="italic text-dark-text/40">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={m.status}
                        disabled={busyId === m.id}
                        onChange={(e) => updateStatus(m.id, e.target.value as ContactStatus)}
                        className={`rounded border text-[10px] font-medium px-1.5 py-1 cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_META[m.status].color}`}
                      >
                        {(Object.keys(STATUS_META) as ContactStatus[]).map((s) => (
                          <option key={s} value={s} className="bg-surface text-light-text">
                            {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className="px-4 py-3 text-dark-text max-w-xs cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : m.id)}
                      title={m.message}
                    >
                      <p className={expanded ? 'whitespace-pre-wrap break-words' : 'truncate'}>{m.message}</p>
                    </td>
                    <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40" title={m.pageUrl ?? undefined}>
                      {m.pageUrl ?? <span className="italic text-dark-text/40">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
