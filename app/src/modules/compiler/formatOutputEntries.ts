import type { OutputEntry } from '@/modules/interpreter/core/types';

/** Convert terminal entries into the same plain-text representation users copy. */
export function formatOutputEntries(entries: OutputEntry[]): string {
  return entries
    .map((entry) => {
      if (entry.kind === 'output') return entry.text;
      if (entry.kind === 'error') return `[ERROR] ${entry.text}`;
      if (entry.kind === 'input' && entry.submitted) {
        return `[INPUT] ${entry.variableName}: ${entry.value}`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}
