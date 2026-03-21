import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How IGCSE Pseudocode Compiler collects, uses, and protects personal data.',
};

const sections = [
  {
    title: 'Information We Collect',
    points: [
      'Account data such as your name, email address, and profile image when you sign in.',
      'Learning activity including saved exams, practice attempts, scores, and progress analytics.',
      'Technical and device data such as browser type, approximate location by IP, and error logs.',
    ],
  },
  {
    title: 'How We Use Information',
    points: [
      'To provide the compiler, grading, account, and progress features.',
      'To improve performance, fix bugs, and enhance user experience.',
      'To maintain platform security and prevent abuse.',
    ],
  },
  {
    title: 'Data Sharing',
    points: [
      'We do not sell your personal data.',
      'We may share limited data with trusted infrastructure and authentication providers that help run the service.',
      'We may disclose data when required by law or to protect the safety and rights of users and the platform.',
    ],
  },
  {
    title: 'Data Retention',
    points: [
      'We keep account and practice records while your account is active.',
      'We may retain limited logs for security and operational reasons.',
      'You can request account deletion, and we will remove personal data unless retention is legally required.',
    ],
  },
  {
    title: 'Your Rights',
    points: [
      'You may request access, correction, or deletion of your personal data.',
      'You may request clarification about how your data is processed.',
      'You may contact us about privacy concerns at any time.',
    ],
  },
  {
    title: 'Policy Updates',
    points: [
      'We may update this policy occasionally to reflect legal, technical, or product changes.',
      'The updated version will be posted on this page with a revised effective date.',
    ],
  },
];

export default function PrivacyPolicyPage() {
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">Privacy Policy</h1>
          <p className="text-sm text-dark-text mt-2">
            Effective date: March 21, 2026. This policy explains how IGCSE Pseudocode Compiler handles your data.
          </p>

          <div className="mt-8 space-y-7">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">{section.title}</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-dark-text">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-border text-sm text-dark-text flex flex-wrap items-center gap-3">
            <span>Read the terms too:</span>
            <Link href="/terms" className="text-primary hover:text-primary-hover transition-colors font-medium">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
