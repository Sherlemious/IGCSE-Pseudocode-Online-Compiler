import { convertToFlowchart } from '@/modules/interpreter/converters/flowchartConverter';
import { docFromConversion, type FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import { withPositions } from './docLayout';

/** Pseudocode → an editable, laid-out flowchart; `error` when the code doesn't parse. */
export function flowchartFromCode(code: string): { doc: FlowchartDoc | null; error: string | null } {
  const conv = convertToFlowchart(code, { fullLabels: true });
  if (conv.errors.length) {
    const e = conv.errors[0];
    return { doc: null, error: `Fix the code first: line ${e.line ?? '?'} doesn't parse.` };
  }
  if (!conv.nodes.length) return { doc: null, error: 'There is no code to draw.' };
  return { doc: withPositions(docFromConversion(conv)), error: null };
}
