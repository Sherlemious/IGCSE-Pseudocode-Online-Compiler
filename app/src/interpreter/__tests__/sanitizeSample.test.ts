import { describe, it, expect } from 'vitest';
import { sanitizeForSampling } from '../sanitizeSample';

describe('sanitizeForSampling', () => {
  it('blanks string literal contents but keeps structure', () => {
    expect(sanitizeForSampling('OUTPUT "Hello, Bob"')).toBe('OUTPUT "..."');
  });

  it('blanks char literal contents', () => {
    expect(sanitizeForSampling("Letter <- 'A'")).toBe("Letter <- 'x'");
  });

  it('drops line-comment text', () => {
    expect(sanitizeForSampling('x <- 1 // my name is Bob')).toBe('x <- 1 //');
  });

  it('does not treat // inside a string as a comment', () => {
    expect(sanitizeForSampling('OUTPUT "http://example.com"')).toBe('OUTPUT "..."');
  });

  it('does not treat a quote inside a comment as a string', () => {
    expect(sanitizeForSampling("// it's Sarah's file")).toBe('//');
  });

  it('handles an unterminated string without leaking the tail', () => {
    expect(sanitizeForSampling('OUTPUT "oops no close')).toBe('OUTPUT "..."');
  });

  it('preserves identifiers, keywords, numbers and line count', () => {
    const src = 'DECLARE Count : INTEGER\nCount <- 5\nOUTPUT "value is ", Count';
    const out = sanitizeForSampling(src);
    expect(out.split('\n')).toHaveLength(3);
    expect(out).toContain('DECLARE Count : INTEGER');
    expect(out).toContain('Count <- 5');
    expect(out).toContain('OUTPUT "...", Count');
  });

  it('is idempotent', () => {
    const src = 'OUTPUT "secret"  // note\nName <- \'Z\'';
    const once = sanitizeForSampling(src);
    expect(sanitizeForSampling(once)).toBe(once);
  });

  it('leaves no personal text from mixed literals and comments', () => {
    const src = 'INPUT Name\nOUTPUT "Hello " & Name  // greet Bob Smith\nGrade <- \'A\'';
    const out = sanitizeForSampling(src);
    expect(out).not.toMatch(/Bob|Smith|Hello/);
    expect(out).toContain('INPUT Name'); // identifiers are structural, kept
  });
});
