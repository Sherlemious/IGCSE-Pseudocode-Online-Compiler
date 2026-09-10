import { describe, it, expect } from 'vitest';
import { cleanPaste } from '../pasteCleanup';

describe('cleanPaste', () => {
  it('extracts the code and drops the chatter from a ChatGPT-style paste', () => {
    const pasted = [
      'Sure! Here is the pseudocode for your task:',
      '',
      '```pseudocode',
      'DECLARE Count : INTEGER',
      'Count <- 0',
      '```',
      '',
      'This keeps the same variable names throughout. I hope this helps!',
    ].join('\n');
    const r = cleanPaste(pasted);
    expect(r.changed).toBe(true);
    expect(r.strippedProse).toBe(true);
    expect(r.looksAi).toBe(true);
    expect(r.blockCount).toBe(1);
    expect(r.text).toBe('DECLARE Count : INTEGER\nCount <- 0');
  });

  it('leaves ordinary code (no fences) untouched', () => {
    const code = 'DECLARE X : INTEGER\nX <- 5\nOUTPUT X';
    const r = cleanPaste(code);
    expect(r.changed).toBe(false);
    expect(r.text).toBe(code);
    expect(r.looksAi).toBe(false);
  });

  it('strips a bare fenced block without flagging it as AI', () => {
    const r = cleanPaste('```\nOUTPUT "hi"\n```');
    expect(r.changed).toBe(true);
    expect(r.text).toBe('OUTPUT "hi"');
    expect(r.strippedProse).toBe(false);
    expect(r.looksAi).toBe(false);
  });

  it('joins multiple fenced blocks', () => {
    const r = cleanPaste('```\nA <- 1\n```\nand then\n```\nB <- 2\n```');
    expect(r.blockCount).toBe(2);
    expect(r.text).toBe('A <- 1\n\nB <- 2');
  });

  it('leaves an unclosed fence alone (the run-time normalizer handles it)', () => {
    const r = cleanPaste('```pseudocode\nDECLARE X : INTEGER');
    expect(r.changed).toBe(false);
    expect(r.blockCount).toBe(0);
  });
});
