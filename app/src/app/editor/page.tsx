import type { Metadata } from 'next';
import Link from 'next/link';
import IndexLinks from '@/shared/layout/IndexLinks';
import { guideHref } from '@/modules/content/guidePages';
import { SHARE_IMAGE, SITE_URL } from '@/shared/lib/seo';

const TITLE = 'Pseudocode Editor Online | Free Runner for IGCSE & A Level';
const DESCRIPTION =
  'Free pseudocode editor online. Write, run and trace Cambridge IGCSE 0478 and A Level 9618 pseudocode in the browser — a compiler, runner and IDE with no install.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'pseudocode editor',
    'pseudocode editor online',
    'online pseudocode editor',
    'pseudo code editor',
    'pseudocode runner',
    'pseudocode online',
    'pseudocode ide',
    'write pseudocode online',
    'pseudocode interpreter',
  ],
  alternates: { canonical: '/editor' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/editor`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

const ctaPrimary =
  'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors';
const ctaSecondary =
  'inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-light-text hover:border-primary/40 hover:text-primary transition-colors';

const FAQS = [
  {
    q: 'Where can I run pseudocode online?',
    a: 'Open the editor in the browser. It is a pseudocode runner: OUTPUT prints straight away, and INPUT stops and waits for you to type. Nothing is installed.',
  },
  {
    q: 'Is this a pseudocode editor or a compiler?',
    a: 'Both. You write in the editor, and the compiler interprets that program on the same page. Cambridge IGCSE 0478, O Level 2210 and A Level 9618 syntax are all available.',
  },
  {
    q: 'Can I check whether my pseudocode is correct?',
    a: 'Running the program shows what it prints. To test it against hidden cases, use the pseudocode practice checker. The editor itself does not grade a program you invented.',
  },
] as const;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Pseudocode Editor Online',
      url: `${SITE_URL}/editor`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: DESCRIPTION,
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function EditorPage() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% -10%, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <p className="mono-label text-primary mb-3">Free, in the browser</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            Pseudocode Editor Online
          </h1>
          <p className="text-sm text-dark-text mt-2 leading-relaxed max-w-2xl">
            A pseudocode editor for Cambridge IGCSE (0478 and 0984), O Level (2210) and AS &amp; A
            Level (9618). Write pseudocode online, run it, and dry-run it with a trace table. The
            same page is the compiler.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className={ctaPrimary}>
              Open the editor
            </Link>
            <Link href="/practice" className={ctaSecondary}>
              Check an answer
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-light-text mt-10 mb-2">Write Cambridge pseudocode</h2>
          <p className="text-sm text-dark-text leading-relaxed">
            The editor highlights DECLARE, IF, loops, procedures and the A Level words. Assignment
            is <code className="font-mono text-primary">&lt;-</code>. Not equal to is{' '}
            <code className="font-mono text-primary">&lt;&gt;</code>. A mistake is marked on the
            line, in plain language, with a fix when one is safe. It also works as a pseudocode
            IDE: one window for the program, the output and the trace.
          </p>

          <h2 className="text-lg font-semibold text-light-text mt-8 mb-2">Pseudocode runner</h2>
          <p className="text-sm text-dark-text leading-relaxed">
            Press run and the interpreter executes the program in the browser. OUTPUT appears in
            the terminal. INPUT asks you, then continues. You can stop a runaway loop. This is
            the pseudocode runner, and the pseudocode website: open the page and run it, with
            nothing to install.
          </p>

          <h2 className="text-lg font-semibold text-light-text mt-8 mb-2">Pseudocode online</h2>
          <p className="text-sm text-dark-text leading-relaxed">
            Pseudocode online here means the Cambridge language, not a generic flowchart tool.
            IGCSE and A Level programs use the same editor. The{' '}
            <Link href="/docs" className="text-primary hover:text-primary-hover">
              Cambridge pseudocode guide
            </Link>{' '}
            covers DECLARE, DIV, ROUND and constants. The{' '}
            <Link href={guideHref('9618')} className="text-primary hover:text-primary-hover">
              9618 pseudocode guide
            </Link>{' '}
            covers records, BYREF, files and classes. New to Paper 2, start with the{' '}
            <Link href="/tutorial" className="text-primary hover:text-primary-hover">
              O Level tutorial
            </Link>
            .
          </p>

          <h2 className="text-lg font-semibold text-light-text mt-8 mb-2">Trace it, then test it</h2>
          <p className="text-sm text-dark-text leading-relaxed">
            A trace table steps through the variables the way a Paper 2 dry run does. When the
            task has a known answer, the{' '}
            <Link href="/practice" className="text-primary hover:text-primary-hover">
              pseudocode practice checker
            </Link>{' '}
            runs hidden tests. That is the tester. The editor runs the program you wrote. It does
            not invent a mark for it.
          </p>

          <h2 className="text-lg font-semibold text-light-text mt-8 mb-2">Questions</h2>
          <dl className="mt-3 space-y-4">
            {FAQS.map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-semibold text-light-text">{item.q}</dt>
                <dd className="text-sm text-dark-text leading-relaxed mt-1">{item.a}</dd>
              </div>
            ))}
          </dl>

          <IndexLinks current="/editor" />
        </div>
      </div>
    </div>
  );
}
