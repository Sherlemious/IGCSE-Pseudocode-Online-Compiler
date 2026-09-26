import { describe, expect, it } from 'vitest';
import { parse } from '@/modules/interpreter';
import { gradeSubmission } from '@/modules/practice/autograder';
import { IGCSE_PAPER_2 } from '@/modules/learn/curriculum';
import { findLesson } from '@/modules/learn/path';
import toc from '@/modules/docs/toc';
import { BLOG_POSTS, blogPage, blogPageCount } from './index';

/** Answers fed to any INPUT; `16.5` is what the "wrong INPUT type" example needs. */
const INPUTS = ['16.5', '16.5', '16.5'];

function docsAnchors(): Set<string> {
  return new Set(toc.flatMap((entry) => [entry.id, ...(entry.children ?? []).map((child) => child.id)]));
}

describe('blog posts', () => {
  it('have unique, routable slugs and short descriptions', () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const post of BLOG_POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.slug).not.toBe('page');
      expect(post.description.length, post.slug).toBeLessThanOrEqual(155);
      expect(post.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('paginates', () => {
    expect(blogPage(1)?.length).toBeGreaterThan(0);
    expect(blogPage(blogPageCount() + 1)).toBeNull();
    expect(blogPage(0)).toBeNull();
  });

  for (const post of BLOG_POSTS) {
    describe(post.slug, () => {
      post.blocks.forEach((block, i) => {
        if (block.kind !== 'code') return;
        const first = block.code.split('\n')[0];
        if (block.variant === 'right' || block.variant === undefined) {
          it(`example ${i} runs (${first})`, async () => {
            expect(parse(block.code).errors).toEqual([]);
            const result = await gradeSubmission(block.code, INPUTS.map(() => '60'), block.output ?? '');
            expect(result.error, result.error?.message).toBeUndefined();
            if (block.output !== undefined) expect(result.passed, result.actualOutput).toBe(true);
          });
        } else if (block.failsAtRuntime) {
          it(`wrong example ${i} parses but fails when run (${first})`, async () => {
            expect(parse(block.code).errors).toEqual([]);
            const result = await gradeSubmission(block.code, INPUTS, '');
            expect(result.error?.kind).toBe('runtime');
          });
        } else {
          it(`wrong example ${i} does not parse (${first})`, () => {
            expect(parse(block.code).errors.length).toBeGreaterThan(0);
          });
        }
      });

      it('links only to pages that exist', () => {
        const anchors = docsAnchors();
        const text = post.blocks
          .flatMap((b) =>
            b.kind === 'p' || b.kind === 'callout'
              ? [b.text]
              : b.kind === 'list'
                ? b.items
                : b.kind === 'table'
                  ? b.rows.flat()
                  : [],
          )
          .join('\n');
        for (const [, href] of text.matchAll(/\]\(([^)]+)\)/g)) {
          if (href.startsWith('/docs#')) expect(anchors.has(href.slice(6)), href).toBe(true);
          const lesson = href.match(/^\/learn\/([^/]+)\/([^/#?]+)$/);
          if (lesson) expect(findLesson(IGCSE_PAPER_2, lesson[1], lesson[2]), href).not.toBeNull();
          expect(href.startsWith('/') || href.startsWith('https://'), href).toBe(true);
        }
      });
    });
  }
});
