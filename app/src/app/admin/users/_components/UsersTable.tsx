'use client';

import { useState } from 'react';

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  createdAt: Date;
  _count: { progress: number; examAttempts: number };
}

interface Props {
  users: UserRow[];
}

export default function UsersTable({ users }: Props) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filtered = users.filter((u) => {
    if (planFilter !== 'all' && u.plan !== planFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-light-text placeholder-dark-text/40 outline-none focus:border-primary/50 transition-colors w-56"
        />
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dark-text">Plan:</span>
          {['all', 'FREE', 'PREMIUM'].map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                planFilter === p
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-dark-text">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left px-4 py-3 text-dark-text font-medium">Name</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Email</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Plan</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Questions</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Exams</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-dark-text">No users match.</td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-border/10 transition-colors">
                  <td className="px-4 py-3 text-light-text">{u.name ?? <span className="italic text-dark-text/50">—</span>}</td>
                  <td className="px-4 py-3 text-dark-text">{u.email ?? <span className="italic text-dark-text/50">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                      u.plan === 'PREMIUM'
                        ? 'text-warning border-warning/40 bg-warning/10'
                        : 'text-dark-text border-border bg-border/20'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-text">{u._count.progress}</td>
                  <td className="px-4 py-3 text-dark-text">{u._count.examAttempts}</td>
                  <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
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
