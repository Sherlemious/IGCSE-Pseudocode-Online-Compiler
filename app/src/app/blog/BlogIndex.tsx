import Link from 'next/link';
import IndexLinks from '@/shared/layout/IndexLinks';
import { AnswerLines, PaperGrain } from '@/shared/brand';
import { SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import {
  BLOG_DESCRIPTION,
  BLOG_PATH,
  BLOG_TITLE,
  blogPage,
  blogPageCount,
  blogPageHref,
  blogPostHref,
  formatBlogDate,
} from '@/modules/content/blog';
import { BlogTracker } from './BlogAnalytics';

/** One page of the post list (newest first) with prev/next and page links. */
export default function BlogIndex({ page }: { page: number }) {
  const posts = blogPage(page) ?? [];
  const pages = blogPageCount();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${BLOG_TITLE} — ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}${blogPageHref(page)}`,
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}${blogPostHref(post)}`,
      datePublished: post.published,
    })),
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <BlogTracker slug="index" page={page} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 p-6 sm:p-8 mb-6">
          <PaperGrain className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-soft-light" />
          <AnswerLines className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
          <div className="relative">
            <p className="mono-label text-primary mb-3">IGCSE 0478 · O Level 2210 · Paper 2</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">{BLOG_TITLE}</h1>
            <p className="mt-3 text-sm text-dark-text leading-relaxed max-w-xl">{BLOG_DESCRIPTION}</p>
            {page > 1 && <p className="mt-2 text-xs text-dark-text">Page {page} of {pages}</p>}
          </div>
        </header>

        <ol className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={blogPostHref(post)}
                className="group block rounded-xl border border-border bg-surface/80 p-5 hover:border-primary/40 transition-colors"
              >
                <p className="mono-label text-dark-text">
                  {post.eyebrow} · <time dateTime={post.published}>{formatBlogDate(post.published)}</time>
                </p>
                <h2 className="mt-2 text-lg font-semibold text-light-text group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-sm text-dark-text leading-relaxed">{post.summary}</p>
                <p className="mt-3 text-xs text-primary">Read · {post.readingMinutes} min →</p>
              </Link>
            </li>
          ))}
        </ol>

        {pages > 1 && (
          <nav aria-label="Blog pages" className="mt-6 flex items-center justify-between text-sm">
            {page > 1 ? (
              <Link href={blogPageHref(page - 1)} rel="prev" className="text-primary hover:underline">
                ← Newer posts
              </Link>
            ) : (
              <span />
            )}
            <span className="flex gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} aria-current="page" className="px-2 py-0.5 rounded bg-primary/15 text-primary">
                    {n}
                  </span>
                ) : (
                  <Link key={n} href={blogPageHref(n)} className="px-2 py-0.5 rounded text-dark-text hover:text-primary">
                    {n}
                  </Link>
                ),
              )}
            </span>
            {page < pages ? (
              <Link href={blogPageHref(page + 1)} rel="next" className="text-primary hover:underline">
                Older posts →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        <IndexLinks current={BLOG_PATH} />
      </div>
    </div>
  );
}
