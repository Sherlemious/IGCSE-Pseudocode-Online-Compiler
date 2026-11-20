/** Opens yearly Small class checkout. One payment, the teacher plan students do not buy themselves. */
export function teacherYearlyCheckoutHref(from: string): string {
  const params = new URLSearchParams({
    view: 'teacher',
    checkout: 'small',
    interval: 'year',
    from,
  });
  return `/pricing?${params.toString()}`;
}
