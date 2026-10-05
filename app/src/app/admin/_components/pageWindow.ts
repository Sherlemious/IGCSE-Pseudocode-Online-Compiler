/** Page numbers with ellipsis gaps once the list is longer than a short run. */
export function pageWindow(page: number, pageCount: number): Array<number | 'gap'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const wanted = [1, pageCount, page - 1, page, page + 1].filter(
    (n) => n >= 1 && n <= pageCount,
  );
  const sorted = [...new Set(wanted)].sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('gap');
    out.push(sorted[i]);
  }
  return out;
}
