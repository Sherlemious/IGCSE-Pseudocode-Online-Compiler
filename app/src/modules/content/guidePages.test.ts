import { describe, expect, it } from 'vitest';
import { GUIDE_PAGES, getGuidePage, guideHref } from './guidePages';
import { parse } from '@/modules/interpreter/parser';
import { Interpreter } from '@/modules/interpreter/core/interpreter';
import { ServerVirtualFileSystem } from '@/modules/interpreter/core/serverFilesystem';

async function runCode(source: string) {
  const { tree, errors } = parse(source);
  expect(errors, errors.map((error) => error.message).join('\n')).toEqual([]);
  expect(tree).toBeTruthy();
  const outputs: string[] = [];
  const interpreter = new Interpreter(
    {
      onOutput: (text) => outputs.push(text),
      onInputRequest: () => {},
      onInputComplete: () => {},
      onComplete: () => {},
      onError: () => {},
    },
    new AbortController().signal,
    new ServerVirtualFileSystem(),
  );
  await interpreter.execute(tree!);
  return outputs;
}

describe('guide pages', () => {
  it('gives every searched topic its own title and slug', () => {
    const slugs = GUIDE_PAGES.map((page) => page.slug);
    const titles = GUIDE_PAGES.map((page) => page.title);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);

    const guide9618 = getGuidePage('9618');
    expect(guide9618?.title.startsWith('9618 Pseudocode Guide')).toBe(true);
    expect(guide9618?.docsHref).toBe('/docs#alevel');

    expect(getGuidePage('div-in-pseudocode')?.title.startsWith('What DIV Does')).toBe(true);
    expect(getGuidePage('round-in-pseudocode')?.h1).toMatch(/Round/i);
    expect(getGuidePage('declare-a-constant')?.title).toMatch(/Constant/i);
    expect(getGuidePage('not-equal-to')?.title).toMatch(/Not Equal/);
    expect(getGuidePage('byref-in-pseudocode')?.docsHref).toBe('/docs#alevel-byref');
  });

  it('runs every sample and matches the printed output', async () => {
    for (const page of GUIDE_PAGES) {
      for (const block of page.blocks) {
        if (block.type !== 'code') continue;
        const outputs = await runCode(block.code);
        if (block.output !== undefined) {
          expect(outputs, page.slug).toEqual(block.output.split('\n'));
        }
      }
    }
  });

  it('explains the mechanism, with a Python equivalent and a note past the syllabus', () => {
    for (const page of GUIDE_PAGES) {
      const kickers = page.blocks
        .filter((block) => block.type === 'h2')
        .map((block) => (block.type === 'h2' ? block.kicker : undefined));
      expect(kickers, page.slug).toEqual(['How it works', 'In Python', 'Beyond the exam']);
      expect(page.blocks.some((block) => block.type === 'python'), page.slug).toBe(true);
      expect(page.blocks.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(40);
      expect(guideHref(page.slug)).toBe(`/guide/${page.slug}`);
      for (const slug of page.related) {
        expect(getGuidePage(slug), `${page.slug} → ${slug}`).toBeDefined();
      }
    }
  });
});
