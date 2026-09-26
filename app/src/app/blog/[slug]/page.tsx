import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IndexLinks from '@/shared/layout/IndexLinks';
import { AnswerLines, PaperGrain } from '@/shared/brand';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import {
  BLOG_PATH,
  BLOG_POSTS,
  BLOG_TITLE,
  blogPostHref,
  formatBlogDate,
  getBlogPost,
} from '@/modules/content/blog';
import PostBody from '../PostBody';
import { BlogLink, BlogTracker } from '../BlogAnalytics';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  const url = `${SITE_URL}${blogPostHref(post)}`;
  return {
    title: { absolute: post.title },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: blogPostHref(post) },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

const ctaPrimary =
  'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors';
const ctaSecondary =
  'inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-light-text hover:border-primary/40 hover:text-primary transition-colors';

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}${blogPostHref(post)}`;
  const more = BLOG_POSTS.filter((other) => other.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: BLOG_TITLE, item: `${SITE_URL}${BLOG_PATH}` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        inLanguage: 'en',
        keywords: post.keywords.join(', '),
        image: SHARE_IMAGE.url,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        about: ['Cambridge IGCSE Computer Science 0478', 'Cambridge O Level Computer Science 2210', 'Pseudocode'],
      },
    ],
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-background bg-dot-grid scrollbar-pretty">
      <BlogTracker slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-dark-text">
          <Link href={BLOG_PATH} className="hover:text-primary transition-colors">
            ← {BLOG_TITLE}
          </Link>
        </nav>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 sm:p-8 shadow-intense">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 w-[3px] border-x border-brand-red/45"
          />
          <header className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-8 overflow-hidden px-6 pt-6 pb-6 sm:px-8 sm:pt-8 border-b border-border">
            <PaperGrain className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-soft-light" />
            <AnswerLines className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
            <div className="relative">
              <p className="mono-label text-primary mb-3">{post.eyebrow}</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-light-text">{post.title}</h1>
              <p className="mt-3 text-xs text-dark-text">
                <time dateTime={post.published}>{formatBlogDate(post.published)}</time>
                {' · '}
                {post.readingMinutes} min read
              </p>
            </div>
          </header>

          <PostBody blocks={post.blocks} slug={post.slug} />

          <div className="mt-10 rounded-xl border border-border bg-background/60 p-5">
            <p className="text-sm font-semibold text-light-text">Check your own code</p>
            <p className="mt-1 text-sm text-dark-text leading-relaxed">
              Run it in the compiler: every one of these mistakes gets a plain-English explanation, and many get a
              one-click fix.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <BlogLink href="/" slug={post.slug} source="footer" className={ctaPrimary}>
                Open the compiler
              </BlogLink>
              <BlogLink href="/learn?from=blog" slug={post.slug} source="footer" className={ctaSecondary}>
                Start the Paper 2 Path
              </BlogLink>
            </div>
          </div>

          {more.length > 0 && (
            <section aria-label="More posts" className="mt-10">
              <h2 className="mono-label text-dark-text mb-3">More from the blog</h2>
              <ul className="space-y-2">
                {more.map((other) => (
                  <li key={other.slug}>
                    <BlogLink
                      href={blogPostHref(other)}
                      slug={post.slug}
                      source="more"
                      className="text-sm text-primary hover:underline"
                    >
                      {other.title}
                    </BlogLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <IndexLinks current={BLOG_PATH} />
        </div>
      </article>
    </div>
  );
}
