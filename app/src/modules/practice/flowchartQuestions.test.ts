import { describe, expect, it } from 'vitest';
import { flowchartQuestions } from '../../../prisma/flowchartQuestions';
import { convertToFlowchart } from '@/modules/interpreter/converters/flowchartConverter';
import {
  blankAnswers,
  docFromConversion,
  fillBlanks,
  isTemplate,
  parseFlowchartDoc,
} from '@/modules/interpreter/converters/flowchartDoc';
import { flowchartToPseudocode } from '@/modules/interpreter/converters/flowchartToPseudocode';
import { gradeTestCases } from './autograder';
import { resolveFlowchartAnswer } from './flowchartAnswer';

// Each flowchart question must be answerable the way a student answers it:
// the model flowchart (drawn, or the template with its blanks filled in) goes
// through the grade route's resolver and converter and passes every test.

type Q = (typeof flowchartQuestions)[number] & { answerFormat?: 'FLOWCHART'; flowchart?: unknown };

const tests = (q: Q) => q.testCases.map((tc) => ({ inputs: tc.inputs, expectedOutput: tc.expectedOutput, initialFiles: null }));

describe('flowchart practice questions', () => {
  it.each((flowchartQuestions as Q[]).map((q) => [q.title, q] as const))('%s', async (_title, q) => {
    const full = docFromConversion(convertToFlowchart(q.solution, { fullLabels: true }));

    if (q.answerFormat !== 'FLOWCHART') {
      // Flowchart → pseudocode: the diagram must be a valid doc.
      expect(parseFlowchartDoc(q.flowchart)).not.toBeNull();
      return;
    }

    let body: { flowchart?: unknown; answers?: unknown } = { flowchart: full };
    const template = parseFlowchartDoc(q.flowchart);
    if (q.flowchart != null) {
      expect(template && isTemplate(template)).toBe(true);
      const answers = blankAnswers(full, template!);
      // The blanks really are blank: the template alone must not pass.
      const empty = flowchartToPseudocode(fillBlanks(template!, {}));
      expect(empty.errors.length).toBeGreaterThan(0);
      body = { answers };
    }

    const resolved = resolveFlowchartAnswer(q.flowchart ?? null, body);
    if ('error' in resolved) throw new Error(resolved.error);
    const program = flowchartToPseudocode(resolved.doc);
    expect(program.errors).toEqual([]);
    const results = await gradeTestCases(program.code, tests(q));
    expect(results.filter((r) => !r.passed), program.code).toEqual([]);
  });
});
