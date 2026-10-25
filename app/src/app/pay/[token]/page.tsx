import type { Metadata } from 'next';
import { LogoBadge } from '@/shared/brand';
import { verifyPayForToken } from '@/modules/billing/parentPay';
import { findPayForStudent } from '@/modules/billing/repo';
import { getPaddleEnv } from '@/modules/billing/paddle/env';
import { earlyBirdFor, featuredPass, featuredPassOffer, priceIdForPass } from '@/modules/billing/paddle/passes';
import ParentPayClient from '@/modules/billing/ParentPayClient';

export const metadata: Metadata = {
  title: 'Pay for an exam pass',
  description: 'A student asked you to pay for their Paper 2 exam pass.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ paid?: string }>;
}

function firstName(name: string | null): string | null {
  return name?.trim().split(/\s+/)[0]?.slice(0, 30) || null;
}

const until = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Where a parent lands from a student's "ask a parent to pay" link. */
export default async function ParentPayPage({ params, searchParams }: Props) {
  const { token } = await params;
  const paid = (await searchParams).paid === '1';
  const studentId = verifyPayForToken(token);
  const student = studentId ? await findPayForStudent(studentId) : null;
  const name = firstName(student?.name ?? null);
  const pass = featuredPass();
  const offer = featuredPassOffer();
  const hasPlan = Boolean(
    student && student.plan !== 'FREE' && (!student.planExpiresAt || student.planExpiresAt > new Date()),
  );
  const activeUntil = hasPlan ? (student?.planExpiresAt ?? null) : null;

  let body: React.ReactNode;
  if (!student || student.role === 'TEACHER' || !pass || pass.kind === 'month' || !offer) {
    body = (
      <>
        <h1 className="text-2xl font-bold tracking-tight text-light-text">This link has expired</h1>
        <p className="mt-3 text-sm text-dark-text leading-relaxed">
          Payment links last 30 days. Ask the student to send a new one from the lesson page.
        </p>
      </>
    );
  } else if (paid) {
    body = (
      <>
        <p className="mono-label text-primary mb-3">Payment received</p>
        <h1 className="text-2xl font-bold tracking-tight text-light-text">Thank you</h1>
        <p className="mt-3 text-sm text-dark-text leading-relaxed">
          {name ?? 'The student'}&apos;s pass switches on within a minute or two. They only need to refresh the
          page. Your receipt is on its way to the email you paid with.
        </p>
      </>
    );
  } else if (hasPlan) {
    body = (
      <>
        <h1 className="text-2xl font-bold tracking-tight text-light-text">Nothing to pay</h1>
        <p className="mt-3 text-sm text-dark-text leading-relaxed">
          {name ?? 'This student'} already has full access{activeUntil ? ` until ${until(activeUntil)}` : ''}.
        </p>
      </>
    );
  } else {
    body = (
      <ParentPayClient
        token={token}
        studentName={name}
        offer={offer}
        passLabel={pass.label}
        priceId={priceIdForPass(pass, getPaddleEnv())}
        discountCode={earlyBirdFor(pass.kind)?.code ?? null}
      />
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4 py-12 sm:py-20">
        <div className="w-full rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <LogoBadge size={56} className="mb-4" />
          {body}
        </div>
      </div>
    </div>
  );
}
