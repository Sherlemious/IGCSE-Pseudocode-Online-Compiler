'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  role: string;
  createdAt: Date;
  _count: { progress: number; examAttempts: number };
}

interface Props {
  users: UserRow[];
  currentAdminRole: string;
}

const ROLE_COLOURS: Record<string, string> = {
  ADMIN:   'text-error border-error/40 bg-error/10',
  TEACHER: 'text-primary border-primary/40 bg-primary/10',
  STUDENT: 'text-dark-text border-border bg-border/20',
};

function RoleSelect({
  userId,
  currentRole,
  currentAdminRole,
  isUpdating,
  onChange,
}: {
  userId: string;
  currentRole: string;
  currentAdminRole: string;
  isUpdating: boolean;
  onChange: (userId: string, role: string) => void;
}) {
  const roles = currentAdminRole === 'ADMIN'
    ? ['STUDENT', 'TEACHER', 'ADMIN']
    : ['STUDENT', 'TEACHER'];

  return (
    <select
      value={currentRole}
      disabled={isUpdating}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${ROLE_COLOURS[currentRole] ?? ROLE_COLOURS.STUDENT}`}
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r.charAt(0) + r.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

export default function UsersTable({ users, currentAdminRole }: Props) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [roleOverrides, setRoleOverrides] = useState<Record<string, string>>({});
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const effectiveRole = roleOverrides[u.id] ?? u.role;
    if (planFilter !== 'all' && u.plan !== planFilter) return false;
    if (roleFilter !== 'all' && effectiveRole !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingRole(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? 'Failed to update role');
        return;
      }
      setRoleOverrides((prev) => ({ ...prev, [userId]: newRole }));
      toast.success('Role updated — takes effect on the user\'s next sign-in');
    } finally {
      setUpdatingRole(null);
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
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dark-text">Role:</span>
          {['all', 'STUDENT', 'TEACHER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                roleFilter === r
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="sm:ml-auto text-xs text-dark-text">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-240px)] scrollbar-pretty">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-dark-text font-medium">Name</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium">Email</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Plan</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-24">Role</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Questions</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Exams</th>
                <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-dark-text">No users match.</td>
                </tr>
              )}
              {filtered.map((u) => {
                const effectiveRole = roleOverrides[u.id] ?? u.role;
                return (
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
                    <td className="px-4 py-3">
                      <RoleSelect
                        userId={u.id}
                        currentRole={effectiveRole}
                        currentAdminRole={currentAdminRole}
                        isUpdating={updatingRole === u.id}
                        onChange={(id, role) => void handleRoleChange(id, role)}
                      />
                    </td>
                    <td className="px-4 py-3 text-dark-text">{u._count.progress}</td>
                    <td className="px-4 py-3 text-dark-text">{u._count.examAttempts}</td>
                    <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
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
