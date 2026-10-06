'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { featuredPassKind, studentCheckoutHref, studentCheckoutLabel } from '@/modules/billing/paddle/passes';

/** May/June is the long one-time grant. Hide it from teachers and anyone already paid up. */
export function shouldOfferPracticePass(input: {
  role?: string | null;
  plan?: string | null;
  planExpiresAt?: string | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();
  if (featuredPassKind(now) !== 'may_june') return false;
  if (input.role === 'TEACHER') return false;
  const plan = input.plan ?? 'FREE';
  if (plan === 'FREE') return true;
  if (input.planExpiresAt && new Date(input.planExpiresAt).getTime() <= now.getTime()) return true;
  return false;
}

export default function PracticePassOffer({ questionId }: { questionId: string }) {
  const { data: session, status } = useSession();
  const shown = useRef(false);
  const user = session?.user;
  const visible =
    status !== 'loading' &&
    shouldOfferPracticePass({
      role: status === 'authenticated' ? user?.role : null,
      plan: status === 'authenticated' ? user?.plan : 'FREE',
      planExpiresAt: user?.planExpiresAt,
    });

  useEffect(() => {
    if (!visible || shown.current) return;
    shown.current = true;
    captureEvent('nudge_shown', { nudge: 'practice_pass', question_id: questionId });
  }, [visible, questionId]);

  if (!visible) return null;

  return (
    <p className="text-center text-[11px] text-dark-text">
      One payment covers practice until 30 June.{' '}
      <Link
        href={studentCheckoutHref('practice_solved')}
        onClick={() => captureEvent('nudge_clicked', { nudge: 'practice_pass', question_id: questionId })}
        className="font-semibold text-primary hover:underline"
      >
        {studentCheckoutLabel()}
      </Link>
    </p>
  );
}
