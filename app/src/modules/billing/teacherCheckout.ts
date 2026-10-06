/** Opens yearly Starter checkout. One payment, the teacher plan students do not buy themselves. */
export function teacherYearlyCheckoutHref(from: string): string {
  const params = new URLSearchParams({
    view: 'teacher',
    checkout: 'starter',
    interval: 'year',
    from,
  });
  return `/pricing?${params.toString()}`;
}
