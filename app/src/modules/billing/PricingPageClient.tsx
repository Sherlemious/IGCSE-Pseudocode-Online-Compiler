'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SITE_NAME, SUPPORT_EMAIL } from '@/shared/lib/seo';
import { planBadge } from './planDisplay';
import PaddleProvider from './PaddleProvider';
import PricingAudiencePicker, { PricingSwitchLink } from './PricingAudiencePicker';
import PricingClient, {
  type PricingTierView,
  type StudentMonthlyView,
  type StudentPassView,
} from './PricingClient';

type PricingView = 'choose' | 'student' | 'teacher';

function studentBlurb(passes: StudentPassView[]): string {
  const hasMay = passes.some((p) => p.kind === 'may_june');
  const hasOct = passes.some((p) => p.kind === 'oct_nov');
  if (hasMay && hasOct) {
    return '$2/month, or switch between the May/June and Oct/Nov session passes.';
  }
  if (hasMay) {
    return '$2/month, or a one-time May/June session pass through the series.';
  }
  if (hasOct) {
    return '$2/month, or a one-time Oct/Nov session pass through the series.';
  }
  return '$2/month for the full practice and exam library. Cancel anytime.';
}

function PricingViewInner({
  teacherTiers,
  studentMonthly,
  studentPasses,
  paddleEnv,
}: {
  teacherTiers: PricingTierView[];
  studentMonthly: StudentMonthlyView | null;
  studentPasses: StudentPassView[];
  paddleEnv: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const portalFailed = searchParams.get('portal') === 'error';

  useEffect(() => {
    if (searchParams.get('reason') == null) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete('reason');
    const qs = next.toString();
    router.replace(qs ? `/pricing?${qs}` : '/pricing', { scroll: false });
  }, [router, searchParams]);

  const viewParam = searchParams.get('view');
  const role = session?.user?.role;
  const defaultView: PricingView = !session
    ? 'choose'
    : role === 'STUDENT'
      ? 'student'
      : 'teacher';
  const view: PricingView =
    viewParam === 'student' || viewParam === 'teacher' ? viewParam : defaultView;

  const showTeachers = view === 'teacher';
  const showPasses = view === 'student';
  const viewerIsTeacher = role === 'TEACHER';

  const [now] = useState(() => Date.now());
  const passActiveUntil =
    session?.user?.planExpiresAt && new Date(session.user.planExpiresAt).getTime() > now
      ? session.user.planExpiresAt
      : null;
  const currentTier = session?.user?.planTier ?? null;
  const currentPlanLabel = currentTier
    ? planBadge({
        plan: session?.user?.plan,
        planTier: currentTier,
        legacyCapacity: session?.user?.legacyCapacity,
        planExpiresAt: session?.user?.planExpiresAt ? new Date(session.user.planExpiresAt) : null,
      }).label
    : null;
  const canManageBilling = Boolean(
    session?.user?.hasPaddleSubscription ?? session?.user?.hasPaddleCustomer,
  );

  const switchTo =
    view === 'student' && teacherTiers.length
      ? { href: '/pricing?view=teacher', label: 'Teaching a class? See teacher plans →' }
      : view === 'teacher'
        ? { href: '/pricing?view=student', label: 'Looking for a student plan? →' }
        : null;

  const empty =
    (showTeachers ? teacherTiers.length === 0 : true) &&
    (showPasses ? !studentMonthly && studentPasses.length === 0 : true);

  const heading = useMemo(() => {
    if (view === 'choose') return 'Who are you buying for?';
    if (view === 'student') return 'Student plans';
    return 'Plans for teachers';
  }, [view]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="mono-label text-primary mb-3">Plans</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">{heading}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-light-text/90 leading-relaxed">
            {view === 'choose' ? (
              'Pick student or teacher and we will show the right prices — not both at once.'
            ) : view === 'student' ? (
              <>
                {studentBlurb(studentPasses)} The {SITE_NAME} editor stays free; a plan unlocks
                the practice and exam library. See{' '}
                <Link href="/compare" className="text-primary hover:text-primary-hover">
                  what Student includes
                </Link>
                .
              </>
            ) : (
              <>
                Start with Starter, or tell us how many students you teach — we&apos;ll show the
                matching plan and how many classes you get. Students on your roster get the
                library; they don&apos;t buy a pass.
              </>
            )}
          </p>
          {view === 'teacher' && (
            <p className="mx-auto mt-2 max-w-xl text-sm text-dark-text leading-relaxed">
              Prices are shown in your local currency. Yearly is about two months free.
            </p>
          )}
        </div>

        {portalFailed && (
          <div
            className="mb-8 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-center"
            role="alert"
          >
            <p className="text-sm text-light-text">
              We couldn&apos;t open the billing portal. Email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Billing portal — update payment or cancel')}`}
                className="font-medium text-primary hover:text-primary-hover"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              from this account to update your payment method or cancel.
            </p>
          </div>
        )}

        {switchTo && (
          <div className={`mb-8 text-center ${portalFailed ? '' : '-mt-2'}`}>
            <PricingSwitchLink
              href={switchTo.href}
              audience={view === 'student' ? 'teacher' : 'student'}
              paddleEnv={paddleEnv}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {switchTo.label}
            </PricingSwitchLink>
            {!session && (
              <>
                <span className="mx-2 text-dark-text/50">·</span>
                <PricingSwitchLink
                  href="/pricing"
                  audience="choose"
                  paddleEnv={paddleEnv}
                  className="inline-flex items-center gap-1 text-sm font-medium text-dark-text hover:text-light-text transition-colors"
                >
                  Choose again
                </PricingSwitchLink>
              </>
            )}
          </div>
        )}

        {view === 'choose' ? (
          <PricingAudiencePicker paddleEnv={paddleEnv} />
        ) : empty ? (
          <div className="rounded-2xl border border-border bg-surface/80 p-8 text-center text-sm text-dark-text">
            Pricing is being finalized — please check back soon.
          </div>
        ) : (
          <PaddleProvider>
            <PricingClient
              teacherTiers={showTeachers ? teacherTiers : []}
              studentMonthly={showPasses ? studentMonthly : null}
              studentPasses={showPasses ? studentPasses : []}
              showTeachers={showTeachers}
              showPasses={showPasses}
              viewerIsTeacher={viewerIsTeacher}
              customerEmail={session?.user?.email ?? undefined}
              appUserId={session?.user?.id}
              currentTier={currentTier}
              currentPlanLabel={currentPlanLabel}
              passActiveUntil={passActiveUntil}
              canManageBilling={canManageBilling}
              paddleEnv={paddleEnv}
            />
          </PaddleProvider>
        )}

        <p className="mt-8 text-center text-sm text-dark-text">
          Payments are processed by Paddle. See the{' '}
          <Link href="/refund" className="text-primary hover:text-primary-hover transition-colors font-medium">
            Refund Policy
          </Link>{' '}
          for cancellations and refunds.
        </p>
      </div>
    </div>
  );
}

export default function PricingPageClient(props: {
  teacherTiers: PricingTierView[];
  studentMonthly: StudentMonthlyView | null;
  studentPasses: StudentPassView[];
  paddleEnv: string;
}) {
  return (
    <Suspense fallback={<div className="flex-1 bg-background" />}>
      <PricingViewInner {...props} />
    </Suspense>
  );
}
