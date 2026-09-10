/**
 * Paste cleanup for code pasted out of AI assistants (ChatGPT, Gemini, …).
 *
 * PostHog shows a large cluster of parse failures whose offending lines are
 * Markdown code fences (```), the prose around them, and "#"/numbered-list
 * explanation text — i.e. students pasting a whole chat reply into the editor.
 * When a paste contains fenced code blocks we keep only the code inside the
 * fences and drop the surrounding chatter, so the paste just runs.
 *
 * Pure and side-effect free so it can be unit-tested without a DOM.
 */

export interface PasteCleanup {
  /** The text to actually insert (fenced code only, when fences were found). */
  text: string;
  /** Whether `text` differs from the raw paste. */
  changed: boolean;
  /** Non-code prose outside the fences was removed. */
  strippedProse: boolean;
  /** The paste looks authored by an AI assistant (drives the easter egg). */
  looksAi: boolean;
  /** Number of fenced code blocks found. */
  blockCount: number;
}

// ```lang\n …code… \n``` — capture the code between the fence lines. Non-greedy
// so consecutive blocks are matched separately; `[\s\S]` so it spans newlines.
const FENCE_BLOCK = /```[^\n]*\r?\n([\s\S]*?)```/g;
// Any remaining fence marker (e.g. an unpaired opening/closing ```).
const STRAY_FENCE = /```[^\n]*/g;

// Turns of phrase an assistant wraps code in — a strong "this came from a bot" tell.
const AI_PHRASES = [
  /\bhere(?:'s| is| you go)\b/i,
  /\b(?:sure|certainly|absolutely|of course)[,!]/i,
  /\blet me (?:know|help)\b/i,
  /\bthis (?:code|program|pseudocode|function|example)\b/i,
  /\bi hope this helps\b/i,
  /\bhope (?:this|that) helps\b/i,
  /\bfeel free to\b/i,
  /\b(?:explanation|breakdown|step-by-step)\b/i,
  /\bin this (?:example|code|program)\b/i,
  /\bnote that\b/i,
  /\bas an ai\b/i,
  /\bkeeps? the same (?:structure|variable names)\b/i,
];

const NONE = (text: string): PasteCleanup => ({
  text,
  changed: false,
  strippedProse: false,
  looksAi: false,
  blockCount: 0,
});

/** Extract fenced code from an AI-style paste; returns the raw text untouched if there is nothing to clean. */
export function cleanPaste(pasted: string): PasteCleanup {
  if (!pasted.includes('```')) return NONE(pasted);

  const blocks: string[] = [];
  FENCE_BLOCK.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FENCE_BLOCK.exec(pasted)) !== null) blocks.push(m[1]);

  // A lone/unclosed fence has no complete block — leave the paste alone (the
  // run-time normalizer blanks stray fence lines on its own).
  if (blocks.length === 0) return NONE(pasted);

  const code = blocks.map((b) => b.replace(/\s+$/, '')).join('\n\n').replace(/^\n+/, '');

  // Whatever is left once the fenced blocks and stray markers are removed.
  const outside = pasted.replace(FENCE_BLOCK, '').replace(STRAY_FENCE, '').trim();
  const strippedProse = outside.length > 0;

  const looksAi =
    strippedProse &&
    (AI_PHRASES.some((re) => re.test(outside)) ||
      // …or the prose reads like a real sentence wrapped around the code.
      (/[.?!]/.test(outside) && outside.split(/\s+/).length >= 6));

  return { text: code, changed: code !== pasted, strippedProse, looksAi, blockCount: blocks.length };
}
