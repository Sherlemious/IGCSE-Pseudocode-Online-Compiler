'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { planBadge } from '@/modules/billing/planDisplay';
import { AdminSearch, Chip, ChipRow, EmptyState, formatRelative, nice } from '../../_components/adminUi';
import UserDrawer, {
  PlanSelect,
  RoleSelect,
  UserAvatar,
  isTrialActive,
  PLANS,
  type UserRow,
} from './UserDrawer';

interface Props {
  users: UserRow[];
  currentAdminRole: string;
}

export default function UsersTable({ users, currentAdminRole }: Props) {
  const [search, setSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'paid' | 'trial'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [roleOverrides, setRoleOverrides] = useState<Record<string, string>>({});
  const [planOverrides, setPlanOverrides] = useState<Record<string, string>>({});
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const effectiveRole = roleOverrides[u.id] ?? u.role;
    const effectivePlan = planOverrides[u.id] ?? u.plan;
    const paid = planBadge({
      plan: effectivePlan,
      planTier: u.planTier,
      legacyCapacity: u.legacyCapacity,
      planExpiresAt: u.planExpiresAt,
    }).paid;
    const trial = isTrialActive(u.trialEndsAt);
    if (accessFilter === 'free' && paid) return false;
    if (accessFilter === 'paid' && !paid) return false;
    if (accessFilter === 'trial' && !trial) return false;
    if (planFilter !== 'all' && effectivePlan !== planFilter) return false;
    if (roleFilter !== 'all' && effectiveRole !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const accessCounts = users.reduce(
    (acc, u) => {
      const effectivePlan = planOverrides[u.id] ?? u.plan;
      const paid = planBadge({
        plan: effectivePlan,
        planTier: u.planTier,
        legacyCapacity: u.legacyCapacity,
        planExpiresAt: u.planExpiresAt,
      }).paid;
      if (paid) acc.paid += 1;
      else acc.free += 1;
      if (isTrialActive(u.trialEndsAt)) acc.trial += 1;
      return acc;
    },
    { free: 0, paid: 0, trial: 0 },
  );

  const selected = filtered.find((u) => u.id === selectedId) ?? users.find((u) => u.id === selectedId) ?? null;

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

  async function handlePlanChange(userId: string, newPlan: string) {
    setUpdatingPlan(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        toast.error(data.error ?? 'Failed to update plan');
        return;
      }
      setPlanOverrides((prev) => ({ ...prev, [userId]: newPlan }));
      toast.success('Plan updated — takes effect on the user\'s next sign-in');
    } finally {
      setUpdatingPlan(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <AdminSearch value={search} onChange={setSearch} placeholder="Search name or email…" />
        <ChipRow label="Access">
          {([
            { id: 'all', label: 'All' },
            { id: 'free', label: `Free · ${accessCounts.free}` },
            { id: 'paid', label: `Paid · ${accessCounts.paid}` },
            { id: 'trial', label: `Trial · ${accessCounts.trial}` },
          ] as const).map((opt) => (
            <Chip key={opt.id} active={accessFilter === opt.id} onClick={() => setAccessFilter(opt.id)}>
              {opt.label}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Plan">
          {['all', ...PLANS].map((p) => (
            <Chip key={p} active={planFilter === p} onClick={() => setPlanFilter(p)}>
              {p === 'all' ? 'All' : nice(p)}
            </Chip>
          ))}
        </ChipRow>
        <ChipRow label="Role">
          {['all', 'STUDENT', 'TEACHER', 'ADMIN'].map((r) => (
            <Chip key={r} active={roleFilter === r} onClick={() => setRoleFilter(r)}>
              {r === 'all' ? 'All' : nice(r)}
            </Chip>
          ))}
        </ChipRow>
        <p className="text-xs text-dark-text">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>No users match.</EmptyState>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="md:hidden space-y-2">
            {filtered.map((u) => {
              const effectiveRole = roleOverrides[u.id] ?? u.role;
              const effectivePlan = planOverrides[u.id] ?? u.plan;
              const trial = isTrialActive(u.trialEndsAt);
              return (
                <li key={u.id}>
                  <article className="rounded-2xl border border-border bg-surface p-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(u.id)}
                      className="w-full flex items-center gap-3 text-left"
                    >
                      <UserAvatar name={u.name} image={u.image} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-light-text truncate">{u.name ?? 'Unnamed'}</p>
                        <p className="text-xs text-dark-text truncate">{u.email ?? '—'}</p>
                      </div>
                      <ChevronRight size={16} className="text-dark-text/40 shrink-0" />
                    </button>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <PlanSelect
                        userId={u.id}
                        currentPlan={effectivePlan}
                        isUpdating={updatingPlan === u.id}
                        onChange={(id, plan) => void handlePlanChange(id, plan)}
                      />
                      {trial && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border text-warning border-warning/40 bg-warning/10">
                          Trial
                        </span>
                      )}
                      <RoleSelect
                        userId={u.id}
                        currentRole={effectiveRole}
                        currentAdminRole={currentAdminRole}
                        isUpdating={updatingRole === u.id}
                        onChange={(id, role) => void handleRoleChange(id, role)}
                      />
                      <span className="ml-auto text-[10px] text-dark-text/70 font-mono">
                        {u._count.learnProgress}p · {u._count.progress}q · {u._count.examAttempts}e · {formatRelative(u.createdAt)}
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Desktop table */}
          <div className="hidden md:block bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-240px)] scrollbar-pretty">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-36">Plan</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-24">Role</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Path</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-20">Practice</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-16">Exams</th>
                    <th className="text-left px-4 py-3 text-dark-text font-medium w-28">Joined</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => {
                    const effectiveRole = roleOverrides[u.id] ?? u.role;
                    const effectivePlan = planOverrides[u.id] ?? u.plan;
                    const trial = isTrialActive(u.trialEndsAt);
                    const open = selectedId === u.id;
                    return (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedId(u.id)}
                        className={`cursor-pointer transition-colors ${open ? 'bg-primary/10' : 'hover:bg-border/10'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <UserAvatar name={u.name} image={u.image} size={24} />
                            <span className="text-light-text truncate">{u.name ?? <span className="italic text-dark-text/50">—</span>}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-dark-text">{u.email ?? <span className="italic text-dark-text/50">—</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <PlanSelect
                              userId={u.id}
                              currentPlan={effectivePlan}
                              isUpdating={updatingPlan === u.id}
                              onChange={(id, plan) => void handlePlanChange(id, plan)}
                            />
                            {trial && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border text-warning border-warning/40 bg-warning/10">
                                Trial
                              </span>
                            )}
                          </div>
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
                        <td className="px-4 py-3 text-dark-text">{u._count.learnProgress}</td>
                        <td className="px-4 py-3 text-dark-text">{u._count.progress}</td>
                        <td className="px-4 py-3 text-dark-text">{u._count.examAttempts}</td>
                        <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="pr-3">
                          <ChevronRight size={14} className={`text-dark-text/40 transition-colors ${open ? 'text-primary' : ''}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <UserDrawer
        user={selected}
        currentAdminRole={currentAdminRole}
        effectiveRole={selected ? (roleOverrides[selected.id] ?? selected.role) : ''}
        effectivePlan={selected ? (planOverrides[selected.id] ?? selected.plan) : ''}
        updatingRole={selected ? updatingRole === selected.id : false}
        updatingPlan={selected ? updatingPlan === selected.id : false}
        onClose={() => setSelectedId(null)}
        onRoleChange={(id, role) => void handleRoleChange(id, role)}
        onPlanChange={(id, plan) => void handlePlanChange(id, plan)}
      />
    </div>
  );
}
