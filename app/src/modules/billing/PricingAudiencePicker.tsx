'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { GraduationCap, User } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

export default function PricingAudiencePicker({ paddleEnv }: { paddleEnv: string }) {
  const ph = usePostHog();

  const pick = (audience: 'student' | 'teacher') => {
    ph?.capture('pricing_audience_clicked', {
      audience,
      paddle_env: paddleEnv,
      source: 'gate',
    });
  };

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Link
        href="/pricing?view=student"
        onClick={() => pick('student')}
        className="group flex flex-col rounded-2xl border border-border bg-surface/80 p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background text-dark-text group-hover:bg-primary/20 group-hover:text-primary">
          <User size={18} />
        </span>
        <span className="mt-4 text-lg font-semibold text-light-text">I&apos;m a student</span>
        <span className="mt-1 text-sm leading-relaxed text-dark-text">
          $2/month, or a one-time pass for the exam series you&apos;re sitting.
        </span>
      </Link>
      <Link
        href="/pricing?view=teacher"
        onClick={() => pick('teacher')}
        className="group flex flex-col rounded-2xl border border-border bg-surface/80 p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background text-dark-text group-hover:bg-primary/20 group-hover:text-primary">
          <GraduationCap size={18} />
        </span>
        <span className="mt-4 text-lg font-semibold text-light-text">I&apos;m a teacher</span>
        <span className="mt-1 text-sm leading-relaxed text-dark-text">
          Starter for a small class, or pick how many students you teach and we&apos;ll show the plan.
        </span>
      </Link>
    </div>
  );
}

export function PricingSwitchLink({
  href,
  audience,
  paddleEnv,
  className,
  children,
}: {
  href: string;
  audience: 'student' | 'teacher' | 'choose';
  paddleEnv: string;
  className?: string;
  children: ReactNode;
}) {
  const ph = usePostHog();
  return (
    <Link
      href={href}
      onClick={() =>
        ph?.capture('pricing_audience_clicked', {
          audience,
          paddle_env: paddleEnv,
          source: 'switch',
        })
      }
      className={className}
    >
      {children}
    </Link>
  );
}
