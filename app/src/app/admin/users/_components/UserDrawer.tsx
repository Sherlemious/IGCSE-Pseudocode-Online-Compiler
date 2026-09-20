'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, BookOpenCheck, Check, Copy, Route } from 'lucide-react';
import { planBadge } from '@/modules/billing/planDisplay';
import AdminDrawer, { useHeld } from '../../_components/AdminDrawer';
import { CopyValue, MetaField, formatAdminDate, nice } from '../../_components/adminUi';
import StudentLearning, { useStudentLearning } from './StudentLearning';

export interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  plan: string;
  planTier: string | null;
  trialEndsAt: Date | null;
  planUpdatedAt: Date | null;
  planExpiresAt: Date | null;
  legacyCapacity: boolean;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
  role: string;
  createdAt: Date;
  _count: { progress: number; examAttempts: number; learnProgress: number };
}

const ROLE_COLOURS: Record<string, string> = {
  ADMIN: 'text-error border-error/40 bg-error/10',
  TEACHER: 'text-primary border-primary/40 bg-primary/10',
  STUDENT: 'text-dark-text border-border bg-border/20',
};

const PLAN_COLOURS: Record<string, string> = {
  FREE: 'text-dark-text border-border bg-border/20',
  STUDENT: 'text-dark-text border-primary/30 bg-primary/5',
  STARTER: 'text-warning border-warning/40 bg-warning/10',
  PRO: 'text-primary border-primary/40 bg-primary/10',
  SCHOOL: 'text-success border-success/40 bg-success/10',
};

export const PLANS = ['FREE', 'STUDENT', 'STARTER', 'PRO', 'SCHOOL'];

export function roleColour(role: string) {
  return ROLE_COLOURS[role] ?? ROLE_COLOURS.STUDENT;
}

export function planColour(plan: string) {
  return PLAN_COLOURS[plan] ?? PLAN_COLOURS.FREE;
}

export function isTrialActive(trialEndsAt: Date | string | null) {
  return trialEndsAt != null && new Date(trialEndsAt).getTime() > Date.now();
}

export function RoleSelect({
  userId,
  currentRole,
  currentAdminRole,
  isUpdating,
  onChange,
  size = 'sm',
}: {
  userId: string;
  currentRole: string;
  currentAdminRole: string;
  isUpdating: boolean;
  onChange: (userId: string, role: string) => void;
  size?: 'sm' | 'lg';
}) {
  const roles = currentAdminRole === 'ADMIN'
    ? ['STUDENT', 'TEACHER', 'ADMIN']
    : ['STUDENT', 'TEACHER'];

  return (
    <select
      value={currentRole}
      disabled={isUpdating}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`${size === 'lg' ? 'w-full text-sm px-3 py-2.5 rounded-xl' : 'text-[10px] px-1.5 py-0.5 rounded'} font-medium border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${roleColour(currentRole)}`}
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {nice(r)}
        </option>
      ))}
    </select>
  );
}

export function PlanSelect({
  userId,
  currentPlan,
  isUpdating,
  onChange,
  size = 'sm',
}: {
  userId: string;
  currentPlan: string;
  isUpdating: boolean;
  onChange: (userId: string, plan: string) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <select
      value={currentPlan}
      disabled={isUpdating}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(userId, e.target.value)}
      className={`${size === 'lg' ? 'w-full text-sm px-3 py-2.5 rounded-xl' : 'text-[10px] px-1.5 py-0.5 rounded'} font-medium border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${planColour(currentPlan)}`}
    >
      {PLANS.map((p) => (
        <option key={p} value={p}>
          {nice(p)}
        </option>
      ))}
    </select>
  );
}

export function UserAvatar({
  name,
  image,
  size = 40,
}: {
  name: string | null;
  image: string | null;
  size?: number;
}) {
  const initials = name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-border shrink-0"
        style={{ width: size, height: size }}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span
      className="rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center ring-1 ring-primary/25 shrink-0"
      style={{ width: size, height: size, fontSize: size < 32 ? 10 : 13 }}
    >
      {initials}
    </span>
  );
}

interface DrawerProps {
  user: UserRow | null;
  currentAdminRole: string;
  effectiveRole: string;
  effectivePlan: string;
  updatingRole: boolean;
  updatingPlan: boolean;
  onClose: () => void;
  onRoleChange: (userId: string, role: string) => void;
  onPlanChange: (userId: string, plan: string) => void;
}

export default function UserDrawer({
  user,
  currentAdminRole,
  effectiveRole,
  effectivePlan,
  updatingRole,
  updatingPlan,
  onClose,
  onRoleChange,
  onPlanChange,
}: DrawerProps) {
  const open = user != null;
  const view = useHeld(user ? { user, role: effectiveRole, plan: effectivePlan } : null);
  const { data: learning, loading: learningLoading } = useStudentLearning(view?.user.id ?? null, open);
  if (!view) return null;

  const { user: shown, role, plan } = view;
  const trial = isTrialActive(shown.trialEndsAt);
  const badge = planBadge({
    plan,
    planTier: shown.planTier,
    legacyCapacity: shown.legacyCapacity,
    planExpiresAt: shown.planExpiresAt,
  });

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={shown.name ?? 'Unnamed user'}
      subtitle={<EmailLine email={shown.email} />}
      lead={<UserAvatar name={shown.name} image={shown.image} size={40} />}
    >
      <div className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <StatChip
            icon={Route}
            label="Path"
            value={learning ? `${learning.learn.completedCount}/${learning.learn.playableCount}` : shown._count.learnProgress}
          />
          <StatChip icon={BookOpenCheck} label="Practice" value={learning ? learning.practice.solved : shown._count.progress} />
          <StatChip icon={BookOpen} label="Exams" value={shown._count.examAttempts} />
        </div>
        <p className="text-[11px] text-dark-text font-mono -mt-2">
          Joined {formatAdminDate(shown.createdAt, true)}
        </p>

        <StudentLearning data={learning} loading={learningLoading} />

        <section className="space-y-3">
          <p className="mono-label text-dark-text">Account</p>
          <label className="block space-y-1.5">
            <span className="text-xs text-dark-text">Role</span>
            <RoleSelect
              userId={shown.id}
              currentRole={role}
              currentAdminRole={currentAdminRole}
              isUpdating={updatingRole}
              onChange={onRoleChange}
              size="lg"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs text-dark-text">Plan</span>
            <PlanSelect
              userId={shown.id}
              currentPlan={plan}
              isUpdating={updatingPlan}
              onChange={onPlanChange}
              size="lg"
            />
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${planColour(plan)}`}>
              {badge.label}
            </span>
            {trial && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border text-warning border-warning/40 bg-warning/10">
                Trial
              </span>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <p className="mono-label text-dark-text">Billing</p>
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background/50 p-3">
            <MetaField label="Display label" value={badge.label} />
            <MetaField label="Marketing tier" value={shown.planTier ?? '—'} mono />
            <MetaField
              label="Trial ends"
              value={shown.trialEndsAt ? formatAdminDate(shown.trialEndsAt) : '—'}
            />
            <MetaField
              label="Plan expires"
              value={shown.planExpiresAt ? formatAdminDate(shown.planExpiresAt) : '—'}
            />
            <MetaField
              label="Plan updated"
              value={shown.planUpdatedAt ? formatAdminDate(shown.planUpdatedAt) : '—'}
            />
            <CopyValue label="Paddle customer" value={shown.paddleCustomerId} mono />
            <CopyValue label="Paddle subscription" value={shown.paddleSubscriptionId} mono />
          </div>
        </section>
      </div>
    </AdminDrawer>
  );
}

function EmailLine({ email }: { email: string | null }) {
  const [copied, setCopied] = useState(false);

  if (!email) return <span className="italic text-dark-text/50">No email</span>;

  async function copy() {
    try {
      await navigator.clipboard.writeText(email ?? '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex items-center gap-1 max-w-full text-left hover:text-primary transition-colors"
      title="Copy email"
    >
      <span className="truncate">{email}</span>
      {copied ? <Check size={11} className="text-success shrink-0" /> : <Copy size={11} className="shrink-0 opacity-50" />}
    </button>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 px-2.5 py-2.5 text-center">
      <Icon size={13} className="mx-auto text-primary mb-1" />
      <p className="font-mono tabular-nums text-sm font-semibold text-light-text leading-none">{value}</p>
      <p className="text-[10px] text-dark-text mt-1">{label}</p>
    </div>
  );
}
