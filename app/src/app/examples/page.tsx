import type { Metadata } from 'next';
import Link from 'next/link';
import IndexLinks from '@/shared/layout/IndexLinks';
import { examples, exampleSlug, examplesByCategory } from '@/modules/content/examples';
import { editorCodeHref } from '@/modules/compiler/editorShare';
import { SITE_NAME, SITE_URL } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: 'Cambridge Pseudocode Examples',
  description:
    'Runnable Cambridge IGCSE, O Level and AS & A Level (9618) pseudocode examples — INPUT/OUTPUT, loops, arrays, files, algorithms, OOP, stacks, queues, linked lists, binary trees and hash tables.',
  alternates: {
    canonical: '/examples',
  },
  openGraph: {
    title: 'Cambridge Pseudocode Examples',
    description:
      'Browse and run Cambridge IGCSE and A Level pseudocode examples in the browser compiler.',
    url: `${SITE_URL}/examples`,
    type: 'website',
  },
};

const grouped = examplesByCategory();

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `Cambridge pseudocode examples — ${SITE_NAME}`,
  url: `${SITE_URL}/examples`,
  numberOfItems: examples.length,
  itemListElement: examples.map((example, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: example.title,
    url: `${SITE_URL}/examples#${exampleSlug(example.title)}`,
    description: `${example.category} pseudocode example`,
  })),
};

function categoryAnchor(category: string) {
  return `cat-${exampleSlug(category)}`;
}

export default function ExamplesPage() {
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
            Cambridge pseudocode examples
          </h1>
          <p className="text-sm text-dark-text mt-2 leading-relaxed">
            Runnable Cambridge IGCSE (0478/0984), O Level (2210) and AS &amp; A Level (9618)
            snippets, including Paper 4 data structures. Open any example in the{' '}
            <Link href="/" className="text-primary hover:text-primary-hover">
              compiler
            </Link>
            {' '}
            — same programs as the in-editor Examples picker.
          </p>

          <nav aria-label="Example categories" className="mt-6 flex flex-wrap gap-2">
            {grouped.map(({ category, items }) => (
              <a
                key={category}
                href={`#${categoryAnchor(category)}`}
                className="text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
              >
                {category}
                <span className="text-dark-text/40 ml-1">{items.length}</span>
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-8">
            {grouped.map(({ category, items }) => (
              <section key={category} id={categoryAnchor(category)} className="scroll-mt-4">
                <h2 className="text-lg font-semibold text-light-text border-b border-border pb-2 mb-3">
                  {category}
                </h2>
                <div className="divide-y divide-border">
                  {items.map((example) => {
                    const slug = exampleSlug(example.title);
                    return (
                      <article key={slug} id={slug} className="py-2 scroll-mt-4">
                        <div className="flex items-start gap-3">
                          <details className="min-w-0 flex-1">
                            <summary className="cursor-pointer text-sm font-medium text-light-text hover:text-primary list-outside ml-4">
                              {example.title}
                            </summary>
                            <pre className="mt-2 mb-1 overflow-x-auto rounded-md border border-border bg-code-bg p-3 font-mono text-xs text-light-text leading-relaxed scrollbar-pretty">
                              <code>{example.code}</code>
                            </pre>
                          </details>
                          <Link
                            href={editorCodeHref(example.code)}
                            className="shrink-0 mt-0.5 text-[11px] font-semibold text-primary hover:text-primary-hover"
                          >
                            Run
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <IndexLinks current="/examples" />
        </div>
      </div>
    </div>
  );
}
