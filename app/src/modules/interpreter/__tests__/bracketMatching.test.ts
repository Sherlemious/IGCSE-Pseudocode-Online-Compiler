import { describe, expect, it } from 'vitest';
import { EditorState } from '@codemirror/state';
import { matchBrackets, bracketMatching } from '@codemirror/language';
import { pseudocodeLanguage } from '../pseudocode-lang';

/**
 * @codemirror/language 6.12.2 could return a bracket match reaching one past the
 * end of the document. While the student was composing (mobile keyboards, IME,
 * Chrome suggestions) bracketMatching kept that decoration and mapped it through
 * the next change, which threw "Position N+1 is out of range for changeset of
 * length N" and broke the editor. Fixed upstream in 6.12.3; this pins it.
 */
describe('bracket matching stays inside the document', () => {
  const docs = ['OUTPUT (1 + 2)', 'X <- (', 'Arr[1', '(', ')', 'OUTPUT LENGTH("ab")', 'IF (A > B) THEN\n  OUTPUT A\nENDIF (', 'x[1]['];

  for (const doc of docs) {
    it(JSON.stringify(doc), () => {
      const state = EditorState.create({ doc, extensions: [pseudocodeLanguage(), bracketMatching()] });
      for (let pos = 0; pos <= doc.length; pos++) {
        for (const dir of [-1, 1] as const) {
          const m = matchBrackets(state, pos, dir);
          if (!m) continue;
          for (const r of [m.start, m.end]) {
            if (!r) continue;
            expect(r.from, `pos ${pos} dir ${dir}`).toBeGreaterThanOrEqual(0);
            expect(r.to, `pos ${pos} dir ${dir}`).toBeLessThanOrEqual(doc.length);
          }
        }
      }
    });
  }
});
