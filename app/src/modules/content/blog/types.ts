/**
 * Blog posts are plain data, like the tutorial: the page renders the blocks,
 * and `blog.test.ts` runs every code example through the parser so a "right"
 * example can never ship broken (or a "wrong" one accidentally valid).
 *
 * Inline text supports `code`, **bold** and [links](/path).
 */
export type BlogBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | {
      kind: 'code';
      code: string;
      /** `wrong` must fail to parse (or set `failsAtRuntime`); `right` must parse and run. */
      variant?: 'wrong' | 'right';
      /** Terminal output shown under the code. */
      output?: string;
      /** The mistake only shows when the program runs (e.g. bad INPUT). */
      failsAtRuntime?: boolean;
      caption?: string;
    }
  | { kind: 'stats'; items: { value: string; label: string }[] }
  | { kind: 'callout'; title?: string; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] };

export interface BlogPost {
  slug: string;
  title: string;
  /** Meta description (≤ 155 chars). */
  description: string;
  /** Short label above the title, e.g. "Paper 2 · Common mistakes". */
  eyebrow: string;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  updated?: string;
  readingMinutes: number;
  keywords: string[];
  /** One or two sentences for the index card. */
  summary: string;
  blocks: BlogBlock[];
}
