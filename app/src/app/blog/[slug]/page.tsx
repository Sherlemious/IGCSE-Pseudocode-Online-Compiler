import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import IndexLinks from '@/shared/layout/IndexLinks';
import { PaperGrain } from '@/shared/brand';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import {
  BLOG_PATH,
  BLOG_POSTS,
  BLOG_TITLE,
  audienceLabel,
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
  'inline-flex items-center justify-center bg-brand-ink px-4 py-2.5 text-sm font-semibold text-brand-paper hover:bg-brand-ink/85 transition-colors';
const ctaSecondary =
  'inline-flex items-center justify-center border border-brand-ink/25 px-4 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-ink transition-colors';

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}${blogPostHref(post)}`;
  const more = BLOG_POSTS.filter((other) => other.slug !== post.slug).slice(0, 3);
  const contents = post.blocks.flatMap((block) => (block.kind === 'h2' ? [block] : []));

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
    <div className="flex-1 min-h-0 overflow-y-auto bg-background scrollbar-pretty">
      <BlogTracker slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-dark-text">
          <Link href={BLOG_PATH} className="hover:text-primary transition-colors">
            ← {BLOG_TITLE}
          </Link>
        </nav>

        <article className="relative bg-brand-paper text-brand-ink shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <PaperGrain className="pointer-events-none absolute inset-0 h-full w-full opacity-25 mix-blend-multiply" />
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-red" />

          <div className="relative px-5 py-8 sm:px-10 sm:py-10">
            <header className="mb-8 border-b border-brand-ink/15 pb-6">
              <p className="mono-label text-brand-ink/70">{post.eyebrow}</p>
              <h1 className="display-serif mt-3 text-[1.85rem] font-semibold leading-tight text-brand-ink sm:text-[2.15rem]">
                {post.title}
              </h1>
              <p className="mt-3 text-sm text-brand-ink/70">
                <time dateTime={post.published}>{formatBlogDate(post.published)}</time>
                {' · '}
                {post.readingMinutes} min read
                {' · '}
                {audienceLabel(post.audience)}
              </p>
            </header>

            {contents.length >= 2 && (
              <nav aria-label="On this page" className="mb-8 border-b border-brand-ink/15 pb-5">
                <p className="mono-label mb-2 text-brand-ink/60">On this page</p>
                <ol className="space-y-1.5">
                  {contents.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-[15px] leading-snug text-brand-ink underline decoration-brand-ink/30 underline-offset-[3px] hover:decoration-brand-red"
                      >
                        {section.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <PostBody blocks={post.blocks} slug={post.slug} />

            <div className="mt-12 border-t border-brand-ink/15 pt-6">
              <p className="display-serif text-xl font-semibold text-brand-ink">
                {post.audience === 'teacher' ? 'Use it with a class' : 'Check your own code'}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-brand-ink/80">
                {post.audience === 'teacher'
                  ? 'Open Classes to share a join link, or write a question and assign it. Students get a mark as they submit.'
                  : 'Run it in the compiler. A mistake is explained in plain English, and many of them have a one-click fix.'}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <BlogLink
                  href={post.audience === 'teacher' ? '/classes' : '/'}
                  slug={post.slug}
                  source="footer"
                  className={ctaPrimary}
                >
                  {post.audience === 'teacher' ? 'Open Classes' : 'Open the compiler'}
                </BlogLink>
                <BlogLink
                  href={post.audience === 'teacher' ? '/questions/new' : '/learn?from=blog'}
                  slug={post.slug}
                  source="footer"
                  className={ctaSecondary}
                >
                  {post.audience === 'teacher' ? 'Write a question' : 'Start the Paper 2 Path'}
                </BlogLink>
              </div>
            </div>

            {more.length > 0 && (
              <section aria-label="More posts" className="mt-10">
                <h2 className="mono-label mb-3 text-brand-ink/60">More from the blog</h2>
                <ul className="space-y-2">
                  {more.map((other) => (
                    <li key={other.slug}>
                      <BlogLink
                        href={blogPostHref(other)}
                        slug={post.slug}
                        source="more"
                        className="text-[15px] text-brand-ink underline decoration-brand-ink/30 underline-offset-[3px] hover:decoration-brand-red"
                      >
                        {other.title}
                      </BlogLink>
                      <span className="ml-2 text-xs text-brand-ink/55">{audienceLabel(other.audience)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>

        <IndexLinks current={BLOG_PATH} />
      </div>
    </div>
  );
}
