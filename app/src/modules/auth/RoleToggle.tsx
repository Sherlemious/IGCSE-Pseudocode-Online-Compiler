'use client';

import { GraduationCap, User } from 'lucide-react';
import type { SignupRole } from './signupRole';

const OPTIONS = [
  { value: 'STUDENT' as const, label: 'Student', Icon: User },
  { value: 'TEACHER' as const, label: 'Teacher', Icon: GraduationCap },
];

export default function RoleToggle({
  role,
  onChange,
  disabled = false,
}: {
  role: SignupRole;
  onChange: (role: SignupRole) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <span className="mono-label text-dark-text mb-1.5 block">I&apos;m a…</span>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
        {OPTIONS.map(({ value, label, Icon }) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(value)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${
                active
                  ? 'border-primary/60 bg-primary/10 text-light-text'
                  : 'border-border bg-background text-dark-text hover:border-primary/30 hover:text-light-text'
              }`}
            >
              <Icon size={15} className={active ? 'text-primary' : ''} />
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-dark-text/60">
        {role === 'TEACHER'
          ? 'Teachers can create classes, set assignments, and see class plans. Applies to Google and email.'
          : 'Students get the full compiler, practice library, and progress tracking.'}
      </p>
    </div>
  );
}
