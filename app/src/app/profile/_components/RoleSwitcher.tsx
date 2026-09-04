'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GraduationCap, User, Loader2 } from 'lucide-react';

type Role = 'STUDENT' | 'TEACHER';

const OPTIONS = [
  { value: 'STUDENT' as const, label: 'Student', Icon: User },
  { value: 'TEACHER' as const, label: 'Teacher', Icon: GraduationCap },
];

export default function RoleSwitcher({ currentRole }: { currentRole: Role }) {
  const router = useRouter();
  const { update } = useSession();
  const [role, setRole] = useState<Role>(currentRole);
  const [saving, setSaving] = useState<Role | null>(null);
  const [error, setError] = useState('');

  async function choose(next: Role) {
    if (next === role || saving) return;
    setError('');
    setSaving(next);
    try {
      const res = await fetch('/api/me/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not update your role.');
        return;
      }
      setRole(next);
      await update?.(); // refresh the session token so the new role is live
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
        {OPTIONS.map(({ value, label, Icon }) => {
          const active = role === value;
          const busy = saving === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={saving !== null}
              onClick={() => choose(value)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
                active
                  ? 'border-primary/60 bg-primary/10 text-light-text'
                  : 'border-border bg-background text-dark-text hover:border-primary/30 hover:text-light-text'
              }`}
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Icon size={15} className={active ? 'text-primary' : ''} />
              )}
              {label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 text-[11px] text-error">{error}</p>
      ) : (
        <p className="mt-2 text-[11px] text-dark-text/60">
          Teachers can create classes and set assignments; students get the compiler and practice library.
        </p>
      )}
    </div>
  );
}
