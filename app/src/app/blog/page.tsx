import type { Metadata } from 'next';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo';
import { BLOG_DESCRIPTION, BLOG_PATH, BLOG_TITLE } from '@/modules/content/blog';
import BlogIndex from './BlogIndex';

export const metadata: Metadata = {
  title: { absolute: `${BLOG_TITLE}: common IGCSE mistakes & exam tips | ${SITE_NAME}` },
  description: BLOG_DESCRIPTION,
  alternates: { canonical: BLOG_PATH },
  openGraph: {
    title: `${BLOG_TITLE} — ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}${BLOG_PATH}`,
    type: 'website',
    images: [SHARE_IMAGE],
  },
};

export default function BlogPage() {
  return <BlogIndex page={1} />;
}
