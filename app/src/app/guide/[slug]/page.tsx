import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IndexLinks from '@/shared/layout/IndexLinks';
import CodeBlock from '@/shared/ui/CodeBlock';
import {
  GUIDE_PAGES,
  getGuidePage,
  guideHref,
  type GuideBlock,
} from '@/modules/content/guidePages';
import { SHARE_IMAGE, SITE_URL } from '@/shared/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return GUIDE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getGuidePage((await params).slug);
  if (!page) return {};
  const url = `${SITE_URL}${guideHref(page.slug)}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: guideHref(page.slug) },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: 'article',
      images: [SHARE_IMAGE],
    },
  };
}

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

function Blocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <div key={index} className="mt-10">
              {block.kicker && <p className="mono-label text-primary mb-1">{block.kicker}</p>}
              <h2 className="text-lg font-semibold text-light-text mb-2">{block.text}</h2>
            </div>
          );
        }
        if (block.type === 'python') {
          return (
            <div key={index} className="my-3 overflow-hidden rounded-md border border-border">
              <div className="px-3 py-1.5 border-b border-border font-mono text-[11px] text-dark-text">
                Python
              </div>
              <pre className="px-3 py-3 bg-code-bg font-mono text-sm text-light-text overflow-x-auto leading-relaxed">{block.code}</pre>
            </div>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={index} className="mt-3 list-disc pl-5 space-y-1">
              {block.items.map((item) => (
                <li key={item} className="text-sm text-dark-text leading-relaxed">
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'code') {
          return <CodeBlock key={index} code={block.code} output={block.output} />;
        }
        return (
          <p key={index} className="text-sm text-dark-text leading-relaxed mt-3">
            <Inline text={block.text} />
          </p>
        );
      })}
    </>
  );
}

export default async function GuideArticle({ params }: Props) {
  const page = getGuidePage((await params).slug);
  if (!page) notFound();

  const url = `${SITE_URL}${guideHref(page.slug)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.h1,
    name: page.h1,
    description: page.description,
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    educationalLevel: 'IGCSE, O Level, AS & A Level',
  };

  const related = page.related
    .map((slug) => getGuidePage(slug))
    .filter((item) => item !== undefined);

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
          <p className="mono-label text-primary mb-3">Cambridge pseudocode</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">{page.h1}</h1>

          <Blocks blocks={page.blocks} />

          <p className="text-sm text-dark-text leading-relaxed mt-8">
            Run the example in the{' '}
            <Link href="/" className="text-primary hover:text-primary-hover">
              pseudocode compiler online
            </Link>
            , or read the matching section of the{' '}
            <Link href={page.docsHref} className="text-primary hover:text-primary-hover">
              Cambridge pseudocode guide
            </Link>
            .
            {page.slug === '9618' && (
              <>
                {' '}
                To practise in order, open the{' '}
                <Link href="/learn/9618" className="text-primary hover:text-primary-hover">
                  AS &amp; A Level 9618 path
                </Link>
                .
              </>
            )}
          </p>

          {related.length > 0 && (
            <nav aria-label="Related guides" className="mt-6 flex flex-wrap gap-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={guideHref(item.slug)}
                  className="text-[11px] px-2 py-1 rounded border border-border text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
                >
                  {item.h1}
                </Link>
              ))}
            </nav>
          )}

          <IndexLinks current={guideHref(page.slug)} />
        </div>
      </div>
    </div>
  );
}
