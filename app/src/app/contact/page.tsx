import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import IndexLinks from '@/components/layout/IndexLinks';
import ContactForm from './_components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the IGCSE & A Level Pseudocode Compiler team. Questions, feedback, school licences and support.',
  alternates: {
    canonical: '/contact',
  },
};

export default async function ContactPage() {
  const session = await auth();

  return (
    <div className="flex-1 overflow-y-auto bg-background bg-dot-grid">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <p className="mono-label text-primary mb-3">Contact</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">Get in touch</h1>
          <p className="text-sm text-dark-text mt-2">
            Questions, feedback, bug reports, or interested in a school licence? Send us a message and
            we&apos;ll get back to you by email.
          </p>

          <div className="mt-8">
            <ContactForm
              defaultName={session?.user?.name ?? ''}
              defaultEmail={session?.user?.email ?? ''}
              signedIn={!!session?.user}
            />
          </div>

          <IndexLinks current="/contact" />
        </div>
      </div>
    </div>
  );
}
