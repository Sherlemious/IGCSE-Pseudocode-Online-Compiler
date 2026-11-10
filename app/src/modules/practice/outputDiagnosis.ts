/** One sentence for a visible test whose output does not match. Taken from the two strings. */

export type OutputMismatchDetail =
  | 'empty'
  | 'extra_line'
  | 'missing_line'
  | 'spacing'
  | 'extra_word'
  | 'digits'
  | 'mismatch';

export interface OutputMismatch {
  detail: OutputMismatchDetail;
  sentence: string;
}

function linesOf(text: string): string[] {
  return text.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
}

function wordsOf(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Say what is wrong, in one sentence, before the Expected / Your Output boxes.
 * Hidden tests never reach this: the caller only has the two strings for a visible test.
 */
export function diagnoseOutput(expected: string, actual: string): OutputMismatch {
  if (actual.trim() === '') {
    return { detail: 'empty', sentence: 'This test printed nothing.' };
  }

  const exp = linesOf(expected);
  const got = linesOf(actual);

  if (got.length > exp.length) {
    const extra = got.length - exp.length;
    return {
      detail: 'extra_line',
      sentence: extra === 1 ? 'You printed an extra line.' : `You printed ${extra} extra lines.`,
    };
  }
  if (got.length < exp.length) {
    const missing = exp.length - got.length;
    return {
      detail: 'missing_line',
      sentence: missing === 1 ? 'A line is missing.' : `${missing} lines are missing.`,
    };
  }

  const squash = (rows: string[]) => rows.map((row) => row.replace(/\s+/g, '')).join('\n');
  if (squash(exp) === squash(got)) {
    const spaces = (rows: string[]) => rows.join('').replace(/\S/g, '').length;
    const diff = spaces(got) - spaces(exp);
    const sentence =
      diff < 0 ? 'A space is missing.' : diff > 0 ? 'You printed an extra space.' : 'The spacing is different.';
    return { detail: 'spacing', sentence };
  }

  const expWords = wordsOf(expected);
  const gotWords = wordsOf(actual);
  if (
    expWords.length > 0 &&
    gotWords.length > expWords.length &&
    expWords.every((word, i) => gotWords[i] === word)
  ) {
    const extra = gotWords.length - expWords.length;
    return {
      detail: 'extra_word',
      sentence: extra === 1 ? 'You printed an extra word.' : 'You printed extra words.',
    };
  }

  const digits = (text: string) => text.replace(/\D/g, '');
  const expDigits = digits(expected);
  if (expDigits.length > 0 && expDigits === digits(actual)) {
    return { detail: 'digits', sentence: 'The digits match, the text around them does not.' };
  }

  return { detail: 'mismatch', sentence: 'The output does not match.' };
}
