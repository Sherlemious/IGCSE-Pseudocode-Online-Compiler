import type { BlogPost } from './types';
import { commonMistakes } from './posts/commonMistakes';

export type { BlogBlock, BlogPost } from './types';

export const BLOG_PATH = '/blog';
export const BLOG_TITLE = 'Pseudocode blog';
export const BLOG_DESCRIPTION =
  'Common Cambridge IGCSE and O Level pseudocode mistakes, exam tips and worked examples — drawn from real student code in the compiler.';
export const BLOG_PAGE_SIZE = 9;

/** Newest first. `page` is reserved (it is the pagination route). */
export const BLOG_POSTS: readonly BlogPost[] = [commonMistakes].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function getBlogPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}

export function blogPageCount(): number {
  return Math.max(1, Math.ceil(BLOG_POSTS.length / BLOG_PAGE_SIZE));
}

/** Posts on a 1-based index page, or null when the page does not exist. */
export function blogPage(page: number): readonly BlogPost[] | null {
  if (!Number.isInteger(page) || page < 1 || page > blogPageCount()) return null;
  return BLOG_POSTS.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
}

export function blogPageHref(page: number): string {
  return page <= 1 ? BLOG_PATH : `${BLOG_PATH}/page/${page}`;
}

export function blogPostHref(post: Pick<BlogPost, 'slug'>): string {
  return `${BLOG_PATH}/${post.slug}`;
}

export function formatBlogDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
