type RelatedCandidate = { id: string; topic: string | null };

/**
 * Up to `limit` other questions to link from a question page: same topic first
 * (catalog order, starting after this one), then the next questions in the
 * catalog. Every question is linked from its neighbours, so a crawler that lands
 * on any one can reach the whole bank (Oct 2026: most were "discovered, not indexed").
 */
export function relatedQuestions<T extends RelatedCandidate>(catalog: readonly T[], currentId: string, limit = 6): T[] {
  const index = catalog.findIndex((q) => q.id === currentId);
  if (index < 0) return catalog.slice(0, limit);
  const current = catalog[index]!;
  const rotated = [...catalog.slice(index + 1), ...catalog.slice(0, index)];
  const sameTopic = current.topic ? rotated.filter((q) => q.topic === current.topic) : [];
  const picked = sameTopic.slice(0, Math.ceil(limit / 2));
  for (const q of rotated) {
    if (picked.length >= limit) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return picked;
}
