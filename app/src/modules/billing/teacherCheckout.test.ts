import { describe, expect, it } from 'vitest';
import { teacherYearlyCheckoutHref } from './teacherCheckout';

describe('teacherYearlyCheckoutHref', () => {
  it('opens yearly Small class checkout from the class', () => {
    expect(teacherYearlyCheckoutHref('class_progress')).toBe(
      '/pricing?view=teacher&checkout=small&interval=year&from=class_progress',
    );
  });
});
