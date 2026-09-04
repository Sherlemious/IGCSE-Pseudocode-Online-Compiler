'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GraduationCap, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

type Role = 'STUDENT' | 'TEACHER';

const OPTIONS = [
  {
    value: 'STUDENT' as const,
    label: "I'm a student",
    desc: 'Write and run pseudocode, work through the practice library, and track your progress.',
    Icon: User,
  },
  {
    value: 'TEACHER' as const,
    label: "I'm a teacher",
    desc: 'Create classes, set assignments with autograding, and see how your students are doing.',
    Icon: GraduationCap,
  },
];

export default function RolePicker() {
  const router = useRouter();
  const { update } = useSession();
  const [role, setRole] = useState<Role>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/me/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not save that. Please try again.');
        setLoading(false);
        return;
      }
      // Refresh the JWT so the new role is live everywhere without a re-login.
      await update?.();
      router.push(role === 'TEACHER' ? '/pricing' : '/practice');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-surface/80 backdrop-blur-sm rounded-xl border border-border p-5 sm:p-6 card-glow"
      style={{ animationDelay: '100ms' }}
    >
      {error && (
        <div className="mb-3 flex items-start gap-2.5 text-xs text-error bg-error/8 border border-error/15 rounded-lg px-3.5 py-2.5">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2.5" role="radiogroup" aria-label="How will you use this?">
        {OPTIONS.map(({ value, label, desc, Icon }) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(value)}
              className={`w-full flex items-start gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                active
                  ? 'border-primary/60 bg-primary/10 shadow-[0_0_16px_-6px_rgba(var(--color-primary-rgb),0.5)]'
                  : 'border-border bg-background hover:border-primary/30'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
                  active ? 'bg-primary/20 text-primary' : 'bg-surface text-dark-text'
                }`}
              >
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold leading-tight ${active ? 'text-light-text' : 'text-light-text/90'}`}>
                  {label}
                </span>
                <span className="block text-xs text-dark-text leading-snug mt-0.5">{desc}</span>
              </span>
              <span
                className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                  active ? 'border-primary bg-primary' : 'border-border'
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg mt-4
          bg-primary text-on-primary text-sm font-semibold
          hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50
          shadow-[0_0_16px_-4px_rgba(var(--color-primary-rgb),0.4)]"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight size={14} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-[11px] text-dark-text/60">
        You can change this later from your profile.
      </p>
    </div>
  );
}
