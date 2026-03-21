import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms for using IGCSE Pseudocode Compiler.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By creating an account or using this platform, you agree to these terms and all applicable laws and regulations.',
  },
  {
    title: 'Educational Use',
    content:
      'This platform is provided for learning and practice. You are responsible for how you use generated or graded outputs in assessments.',
  },
  {
    title: 'Account Responsibilities',
    content:
      'You are responsible for keeping your sign-in details secure and for activity performed through your account.',
  },
  {
    title: 'Acceptable Conduct',
    content:
      'You agree not to misuse the service, attempt unauthorized access, distribute harmful code, or interfere with other users.',
  },
  {
    title: 'Content and Availability',
    content:
      'We aim to provide accurate content and reliable uptime, but we cannot guarantee uninterrupted service or error-free functionality.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'To the fullest extent allowed by law, the service is provided as is and we are not liable for indirect or consequential losses resulting from its use.',
  },
  {
    title: 'Changes to Terms',
    content: 'We may revise these terms. Updated terms take effect when posted on this page with a new effective date.',
  },
  {
    title: 'Contact',
    content:
      'If you have questions about these terms, please contact the project maintainer through the official project channels.',
  },
];

export default function TermsPage() {
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">Terms &amp; Conditions</h1>
          <p className="text-sm text-dark-text mt-2">Effective date: March 21, 2026.</p>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.title} className="space-y-2">
                <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">{section.title}</h2>
                <p className="text-sm text-dark-text leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-border text-sm text-dark-text flex flex-wrap items-center gap-3">
            <span>For data handling details, see:</span>
            <Link href="/privacy" className="text-primary hover:text-primary-hover transition-colors font-medium">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
