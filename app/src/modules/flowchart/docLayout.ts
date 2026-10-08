import { layoutPositions } from '@/modules/compiler/flowchartLayout';
import type { FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';

/** True when every box already has a canvas position. */
export function hasPositions(doc: FlowchartDoc): boolean {
  return doc.nodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number');
}

/** Lay the whole doc out top-to-bottom with dagre (the builder's Tidy button). */
export function tidyDoc(doc: FlowchartDoc): FlowchartDoc {
  const pos = layoutPositions(doc.nodes, doc.edges);
  return {
    ...doc,
    nodes: doc.nodes.map((n) => ({ ...n, ...(pos.get(n.id) ?? { x: 0, y: 0 }) })),
  };
}

/** Positions for a doc that came without them (imported code, seeded questions). */
export function withPositions(doc: FlowchartDoc): FlowchartDoc {
  return hasPositions(doc) ? doc : tidyDoc(doc);
}
