import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { SITE_NAME } from '@/shared/lib/seo';
import { BLOG_DESCRIPTION, BLOG_PATH, BLOG_TITLE, blogPage, blogPageCount, blogPageHref } from '@/modules/content/blog';
import BlogIndex from '../../BlogIndex';

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

/** Page 1 lives at /blog; this route serves 2..n. */
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, blogPageCount() - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = Number((await params).page);
  return {
    title: { absolute: `${BLOG_TITLE} — page ${page} | ${SITE_NAME}` },
    description: BLOG_DESCRIPTION,
    alternates: { canonical: blogPageHref(page) },
  };
}

export default async function BlogListPage({ params }: Props) {
  const page = Number((await params).page);
  if (page === 1) permanentRedirect(BLOG_PATH);
  if (!blogPage(page)) notFound();
  return <BlogIndex page={page} />;
}
