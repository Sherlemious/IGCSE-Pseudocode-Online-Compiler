import type { Metadata } from 'next';
import Link from 'next/link';
import IndexLinks from '@/components/layout/IndexLinks';
import { faqByGroup, faqItems } from '@/data/faq';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'IGCSE Pseudocode Compiler FAQ',
  description:
    'FAQ for the free Cambridge IGCSE, O Level and AS & A Level (9618) pseudocode compiler. How Run, INPUT, DECLARE, grading, shared exams and school use work.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'IGCSE Pseudocode Compiler FAQ',
    description:
      'Answers about the free Cambridge IGCSE and A Level pseudocode compiler — how it works, DECLARE, exams, and using it in school.',
    url: `${SITE_URL}/faq`,
    type: 'website',
  },
};

const grouped = faqByGroup();

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: `FAQ — ${SITE_NAME}`,
  url: `${SITE_URL}/faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.paragraphs.join(' '),
    },
  })),
};

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code
            key={index}
            className="bg-code-bg border border-border px-1 py-0.5 rounded font-mono text-primary text-[0.9em]"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export default function FaqPage() {
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
          <p className="mono-label text-primary mb-3">Index</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">
            Frequently asked questions
          </h1>
          <p className="text-sm text-dark-text mt-2 leading-relaxed">
            Free Cambridge IGCSE (0478/0984), O Level (2210) and AS &amp; A Level (9618) pseudocode
            compiler. Open the{' '}
            <Link href="/" className="text-primary hover:text-primary-hover">
              editor
            </Link>
            ,{' '}
            <Link href="/docs" className="text-primary hover:text-primary-hover">
              syntax guide
            </Link>
            , or{' '}
            <Link href="/practice" className="text-primary hover:text-primary-hover">
              practice questions
            </Link>
            .
          </p>

          <nav aria-label="FAQ sections" className="mt-6 flex flex-wrap gap-2">
            {grouped.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
              >
                {group.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-10">
            {grouped.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-4 space-y-5">
                <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2">
                  {group.label}
                </h2>
                {group.items.map((item) => (
                  <article key={item.id} id={item.id} className="scroll-mt-4 space-y-2">
                    <h3 className="text-sm font-semibold text-light-text">{item.question}</h3>
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm text-dark-text leading-relaxed">
                        <Inline text={paragraph} />
                      </p>
                    ))}
                  </article>
                ))}
              </section>
            ))}
          </div>

          <IndexLinks current="/faq" />
        </div>
      </div>
    </div>
  );
}
