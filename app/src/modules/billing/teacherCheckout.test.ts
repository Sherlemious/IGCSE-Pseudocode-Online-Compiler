import { describe, expect, it } from 'vitest';
import { teacherYearlyCheckoutHref } from './teacherCheckout';

describe('teacherYearlyCheckoutHref', () => {
  it('opens yearly Starter checkout from the class', () => {
    expect(teacherYearlyCheckoutHref('class_progress')).toBe(
      '/pricing?view=teacher&checkout=starter&interval=year&from=class_progress',
    );
  });
});
