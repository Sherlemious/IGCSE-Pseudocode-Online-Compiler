'use client';

import { useState, Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { planBadge } from '@/lib/planDisplay';

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  planTier: string | null;
  trialEndsAt: Date | null;
  planUpdatedAt: Date | null;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
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

const PLAN_COLOURS: Record<string, string> = {
  FREE:    'text-dark-text border-border bg-border/20',
  STUDENT: 'text-dark-text border-primary/30 bg-primary/5',
  STARTER: 'text-warning border-warning/40 bg-warning/10',
  PRO:     'text-primary border-primary/40 bg-primary/10',
  SCHOOL:  'text-success border-success/40 bg-success/10',
};

const PLANS = ['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'];

function nice(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

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
          {nice(r)}
        </option>
      ))}
    </select>
  );
}

function PlanSelect({
  userId,
  currentPlan,
  isUpdating,
  onChange,
}: {
  userId: string;
  currentPlan: string;
  isUpdating: boolean;
  onChange: (userId: string, plan: string) => void;
}) {
  return (
    <select
      value={currentPlan}
      disabled={isUpdating}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${PLAN_COLOURS[currentPlan] ?? PLAN_COLOURS.FREE}`}
    >
      {PLANS.map((p) => (
        <option key={p} value={p}>
          {nice(p)}
        </option>
      ))}
    </select>
  );
}

function isTrialActive(trialEndsAt: Date | null) {
  return trialEndsAt != null && new Date(trialEndsAt).getTime() > Date.now();
}

export default function UsersTable({ users, currentAdminRole }: Props) {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [roleOverrides, setRoleOverrides] = useState<Record<string, string>>({});
  const [planOverrides, setPlanOverrides] = useState<Record<string, string>>({});
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const effectiveRole = roleOverrides[u.id] ?? u.role;
    const effectivePlan = planOverrides[u.id] ?? u.plan;
    if (planFilter !== 'all' && effectivePlan !== planFilter) return false;
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
          {['all', ...PLANS].map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                planFilter === p
                  ? 'bg-primary/15 border-primary/50 text-primary'
                  : 'bg-background border-border text-dark-text hover:text-light-text'
              }`}
            >
              {p === 'all' ? 'All' : nice(p)}
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
              {r === 'all' ? 'All' : nice(r)}
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
                <th className="text-left px-4 py-3 text-dark-text font-medium w-36">Plan</th>
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
                const effectivePlan = planOverrides[u.id] ?? u.plan;
                const trial = isTrialActive(u.trialEndsAt);
                const expanded = expandedId === u.id;
                return (
                  <Fragment key={u.id}>
                    <tr className="hover:bg-border/10 transition-colors">
                      <td className="px-4 py-3 text-light-text">{u.name ?? <span className="italic text-dark-text/50">—</span>}</td>
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
                          <button
                            onClick={() => setExpandedId(expanded ? null : u.id)}
                            title="Billing details"
                            className="text-dark-text/50 hover:text-primary transition-colors"
                          >
                            <ChevronDown size={13} className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
                          </button>
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
                      <td className="px-4 py-3 text-dark-text">{u._count.progress}</td>
                      <td className="px-4 py-3 text-dark-text">{u._count.examAttempts}</td>
                      <td className="px-4 py-3 text-dark-text whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-background/40">
                        <td colSpan={7} className="px-4 py-3">
                          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 text-[11px]">
                            <BillingField label="Display label" value={planBadge({ plan: effectivePlan, planTier: u.planTier }).label} />
                            <BillingField label="Marketing tier" value={u.planTier} mono />
                            <BillingField
                              label="Trial ends"
                              value={u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleString() : null}
                            />
                            <BillingField
                              label="Plan updated"
                              value={u.planUpdatedAt ? new Date(u.planUpdatedAt).toLocaleString() : null}
                            />
                            <BillingField label="Paddle customer" value={u.paddleCustomerId} mono />
                            <BillingField label="Paddle subscription" value={u.paddleSubscriptionId} mono />
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BillingField({ label, value, mono = false }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wider text-dark-text/60">{label}</dt>
      <dd className={`text-light-text truncate ${mono ? 'font-mono' : ''}`} title={value ?? undefined}>
        {value ?? <span className="italic text-dark-text/40">—</span>}
      </dd>
    </div>
  );
}
