import { describe, expect, it } from 'vitest';
import { diagnoseOutput } from './outputDiagnosis';

describe('diagnoseOutput', () => {
  it('names an empty run', () => {
    expect(diagnoseOutput('42', '').sentence).toBe('This test printed nothing.');
    expect(diagnoseOutput('42', '   \n').detail).toBe('empty');
  });

  it('names an extra line and a missing line', () => {
    expect(diagnoseOutput('5', '5\nDone')).toEqual({
      detail: 'extra_line',
      sentence: 'You printed an extra line.',
    });
    expect(diagnoseOutput('5\n4\n3', '5').sentence).toBe('2 lines are missing.');
  });

  it('names a spacing difference when the characters otherwise match', () => {
    expect(diagnoseOutput('Score: 42', 'Score:42').sentence).toBe('A space is missing.');
    expect(diagnoseOutput('Score:42', 'Score: 42').sentence).toBe('You printed an extra space.');
    expect(diagnoseOutput('Total 5', 'Total  5').sentence).toBe('You printed an extra space.');
    expect(diagnoseOutput('a b', 'a\tb').sentence).toBe('The spacing is different.');
  });

  it('names an extra word before it falls through to digits', () => {
    expect(diagnoseOutput('Pencil: 3', 'Pencil: 3 pence').sentence).toBe('You printed an extra word.');
  });

  it('names digits that match inside different text', () => {
    expect(diagnoseOutput('Total: 15', '15').sentence).toBe(
      'The digits match, the text around them does not.',
    );
  });

  it('still says the output does not match when nothing more specific fits', () => {
    expect(diagnoseOutput('Yes', 'No').detail).toBe('mismatch');
  });
});
