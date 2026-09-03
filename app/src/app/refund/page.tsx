import type { Metadata } from 'next';
import Link from 'next/link';
import IndexLinks from '@/components/layout/IndexLinks';
import { SUPPORT_EMAIL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Refund and cancellation terms for paid IGCSE Pseudocode Compiler subscriptions billed through Paddle.',
  alternates: {
    canonical: '/refund',
  },
};

const sections = [
  {
    title: 'What this covers',
    points: [
      'This policy applies to paid subscriptions purchased on this site (for example Student, Starter, and Pro), including monthly and yearly renewals.',
      'The compiler, practice questions, and other free features do not require payment, so they are not part of this policy.',
      'Custom school or Advanced licences quoted by email follow this policy unless the written quote says otherwise.',
    ],
  },
  {
    title: '14-day refunds',
    points: [
      'You can request a full refund within 14 days of a purchase or renewal charge.',
      'If we approve the request, we refund that charge in full to the original payment method.',
      'Paid-plan access may end once the refund is processed. Free features stay available.',
    ],
  },
  {
    title: 'How to request a refund',
    points: [
      `Email ${SUPPORT_EMAIL} from the address you used at checkout.`,
      'Include the plan name, the approximate purchase or renewal date, and your Paddle receipt or transaction ID if you have it.',
      'We aim to reply within two business days.',
    ],
  },
  {
    title: 'Cancellations',
    points: [
      'You can cancel a subscription at any time to stop future charges. You keep paid access until the end of the current billing period.',
      'Cancelling does not automatically refund time already paid. Ask for a refund separately if you are still inside the 14-day window.',
    ],
  },
  {
    title: 'Exceptions',
    points: [
      'Duplicate charges, tax mistakes, and other billing errors are always refunded.',
      'Requests after 14 days are considered case by case, for example if paid features were unavailable for an extended period.',
      'We may decline a refund if the account was closed for violating the Terms, or if repeat requests look like abuse.',
    ],
  },
  {
    title: 'Paddle and your rights',
    points: [
      'Payments are processed by Paddle, who is the Merchant of Record for purchases on this site.',
      'Refunds are issued by Paddle to the original payment method and usually appear within 5–10 business days, depending on your bank or card issuer.',
      'This policy does not limit any rights you have under applicable consumer law, including UK and EU cooling-off rules where they apply.',
      'If you need to dispute a charge, contact us first. Chargebacks opened without notice may lead to the paid account being suspended while they are investigated.',
    ],
  },
  {
    title: 'Policy updates',
    points: [
      'We may update this policy to reflect legal, billing, or product changes.',
      'The updated version will be posted on this page with a revised effective date.',
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <p className="mono-label text-primary mb-3">Legal</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">Refund Policy</h1>
          <p className="text-sm text-dark-text mt-2">
            Effective date: September 3, 2026. This policy explains refunds and cancellations for
            paid IGCSE Pseudocode Compiler plans.
          </p>

          <div className="mt-8 space-y-7">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
                  {section.title}
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-dark-text">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-border text-sm text-dark-text space-y-3">
            <p>
              Questions:{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Refund request')}`}
                className="text-primary hover:text-primary-hover transition-colors font-medium"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="flex flex-wrap items-center gap-3">
              <span>Also see:</span>
              <Link href="/terms" className="text-primary hover:text-primary-hover transition-colors font-medium">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy" className="text-primary hover:text-primary-hover transition-colors font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>

          <IndexLinks current="/refund" />
        </div>
      </div>
    </div>
  );
}
