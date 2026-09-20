'use client';

import { useState } from 'react';
import type { ContactMessage, ContactStatus } from '@prisma/client';
import { ChevronRight } from 'lucide-react';
import AdminDrawer from '../../_components/AdminDrawer';
import { AdminSearch, Chip, ChipRow, EmptyState, formatAdminDate, formatRelative, MetaField } from '../../_components/adminUi';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const selected = filtered.find((m) => m.id === selectedId) ?? rows.find((m) => m.id === selectedId) ?? null;

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
      <div className="flex flex-col gap-3">
        <AdminSearch value={search} onChange={setSearch} placeholder="Search name, email or message…" />
        <ChipRow label="Status">
          {STATUS_FILTERS.map((s) => (
            <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : STATUS_META[s as ContactStatus].label}
            </Chip>
          ))}
        </ChipRow>
        <p className="text-xs text-dark-text">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>No messages match.</EmptyState>
      ) : (
        <>
          <ul className="md:hidden space-y-2">
            {filtered.map((m) => (
              <li key={m.id}>
                <article className="rounded-2xl border border-border bg-surface p-3">
                  <button type="button" onClick={() => setSelectedId(m.id)} className="w-full flex items-start gap-2.5 text-left">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-light-text truncate">{m.name ?? 'Anonymous'}</p>
                      <p className="text-xs text-dark-text truncate">{m.email ?? 'no email'}</p>
                      <p className="text-sm text-light-text/80 line-clamp-2 mt-1">{m.subject ?? m.message}</p>
                    </div>
                    <ChevronRight size={16} className="text-dark-text/40 shrink-0 mt-1" />
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <StatusSelect
                      status={m.status}
                      disabled={busyId === m.id}
                      onChange={(status) => updateStatus(m.id, status)}
                    />
                    <span className="ml-auto text-[10px] text-dark-text/60 font-mono">{formatRelative(m.createdAt)}</span>
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
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-48">From</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Subject</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-32">Status</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Message</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-40">Page</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className={`cursor-pointer transition-colors align-top ${selectedId === m.id ? 'bg-primary/10' : 'hover:bg-border/10'}`}
                    >
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
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusSelect
                          status={m.status}
                          disabled={busyId === m.id}
                          onChange={(status) => updateStatus(m.id, status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-dark-text max-w-xs">
                        <p className="truncate">{m.message}</p>
                      </td>
                      <td className="px-4 py-3 text-dark-text truncate max-w-0 w-40" title={m.pageUrl ?? undefined}>
                        {m.pageUrl ?? <span className="italic text-dark-text/40">—</span>}
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
          title={selected.subject ?? 'Contact message'}
          subtitle={selected.name ?? selected.email ?? 'Anonymous'}
        >
          <div className="space-y-4">
            <StatusSelect
              status={selected.status}
              disabled={busyId === selected.id}
              onChange={(status) => updateStatus(selected.id, status)}
              size="lg"
            />
            <dl className="grid gap-3">
              <MetaField label="From" value={selected.name ?? 'Anonymous'} />
              <MetaField label="Email" value={selected.email ?? '—'} />
              <MetaField label="Received" value={formatAdminDate(selected.createdAt)} />
              <MetaField label="Page" value={selected.pageUrl ?? '—'} mono />
            </dl>
            <p className="text-sm text-light-text whitespace-pre-wrap break-words leading-relaxed">{selected.message}</p>
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
  status: ContactStatus;
  disabled: boolean;
  onChange: (status: ContactStatus) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <select
      value={status}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as ContactStatus)}
      className={`${size === 'lg' ? 'w-full text-sm px-3 py-2.5 rounded-xl' : 'text-[10px] px-1.5 py-1 rounded'} font-medium border cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_META[status].color}`}
    >
      {(Object.keys(STATUS_META) as ContactStatus[]).map((s) => (
        <option key={s} value={s} className="bg-surface text-light-text">
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}
