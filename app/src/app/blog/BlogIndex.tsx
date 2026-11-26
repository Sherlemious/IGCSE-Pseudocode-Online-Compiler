import Link from '@/shared/ui/HoverPrefetchLink';
import IndexLinks from '@/shared/layout/IndexLinks';
import { PaperGrain } from '@/shared/brand';
import { SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import {
  BLOG_DESCRIPTION,
  BLOG_PATH,
  BLOG_TITLE,
  audienceLabel,
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
        <div className="relative bg-brand-paper text-brand-ink shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <PaperGrain className="pointer-events-none absolute inset-0 h-full w-full opacity-25 mix-blend-multiply" />
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-red" />
          <div className="relative px-5 py-8 sm:px-10 sm:py-10">
            <header className="border-b border-brand-ink/15 pb-6">
              <p className="mono-label text-brand-ink/70">IGCSE 0478 · O Level 2210 · Paper 2</p>
              <h1 className="display-serif mt-3 text-[1.85rem] font-semibold leading-tight sm:text-[2.15rem]">{BLOG_TITLE}</h1>
              <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-brand-ink/80">{BLOG_DESCRIPTION}</p>
              {page > 1 && (
                <p className="mt-2 text-sm text-brand-ink/60">
                  Page {page} of {pages}
                </p>
              )}
            </header>

            <ol>
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-brand-ink/10 last:border-b-0">
                  <Link href={blogPostHref(post)} className="group block py-5">
                    <p className="mono-label text-brand-ink/60">
                      {audienceLabel(post.audience)} · <time dateTime={post.published}>{formatBlogDate(post.published)}</time>
                    </p>
                    <h2 className="display-serif mt-2 text-[1.35rem] font-semibold leading-snug text-brand-ink group-hover:underline decoration-brand-red underline-offset-4">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-[16px] leading-relaxed text-brand-ink/80">{post.summary}</p>
                    <p className="mt-2 text-sm text-brand-ink/60">
                      {post.readingMinutes} min · {post.eyebrow}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

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
