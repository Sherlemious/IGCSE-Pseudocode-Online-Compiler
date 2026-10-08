import {
  fillBlanks,
  isTemplate,
  parseFlowchartDoc,
  type FlowchartDoc,
} from '@/modules/interpreter/converters/flowchartDoc';

/**
 * The flowchart to grade for a FLOWCHART question.
 *
 * "Complete the flowchart" (the question's flowchart has blank boxes): only the
 * blanks' labels are taken from the submission — `answers` keyed by node id, or
 * the blank boxes of a submitted doc — and filled into the server's own
 * template, so the locked structure can't be redrawn. Otherwise the submitted
 * doc is graded as drawn.
 */
export function resolveFlowchartAnswer(
  questionFlowchart: unknown,
  body: { flowchart?: unknown; answers?: unknown },
): { doc: FlowchartDoc } | { error: string } {
  const template = parseFlowchartDoc(questionFlowchart);
  if (template && isTemplate(template)) {
    let answers: Record<string, unknown> | null = null;
    if (body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)) {
      answers = body.answers as Record<string, unknown>;
    } else {
      const submitted = parseFlowchartDoc(body.flowchart);
      if (submitted) answers = Object.fromEntries(submitted.nodes.map((n) => [n.id, n.label]));
    }
    if (!answers) return { error: 'Fill in the blank boxes, then check.' };
    return { doc: fillBlanks(template, answers) };
  }
  const doc = parseFlowchartDoc(body.flowchart);
  if (!doc) return { error: 'Draw your flowchart, then check.' };
  return { doc };
}
