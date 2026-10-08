// The editable flowchart document: the builder's state, a flowchart question's
// template, and a student's flowchart answer all use this one shape.
//
// It is the converter's FlowNode/FlowEdge graph plus optional positions and
// template flags, so `convertToFlowchart(code)` output is already a valid doc.

import type { FlowEdge, FlowNode, FlowchartConversion, NodeShape } from './flowchartConverter';

export interface FlowchartDocNode extends FlowNode {
  /** Top-left canvas position. Missing → the client lays the doc out with dagre. */
  x?: number;
  y?: number;
  /** Template node: the student can't move, relabel or delete it. */
  locked?: boolean;
  /** Template blank: the student fills in the label and nothing else. */
  blank?: boolean;
}

/** Which side of a box an arrow leaves or enters (builder only; the converter ignores it). */
export type HandleSide = 't' | 'r' | 'b' | 'l';

export interface FlowchartDocEdge extends FlowEdge {
  sourceHandle?: HandleSide;
  targetHandle?: HandleSide;
}

export interface FlowchartDoc {
  version: 1;
  nodes: FlowchartDocNode[];
  edges: FlowchartDocEdge[];
}

export const FLOWCHART_LIMITS = {
  maxNodes: 200,
  maxEdges: 400,
  maxLabel: 400,
} as const;

const SHAPES: readonly NodeShape[] = ['terminator', 'process', 'io', 'decision', 'subroutine'];
const SIDES: readonly string[] = ['t', 'r', 'b', 'l'];

/** A blank canvas: START → STOP. A box added after START slots in between. */
export function starterFlowchart(): FlowchartDoc {
  return {
    version: 1,
    nodes: [
      { id: 'start', shape: 'terminator', label: 'START', x: 0, y: 0 },
      { id: 'stop', shape: 'terminator', label: 'STOP', x: 0, y: 240 },
    ],
    edges: [{ id: 'e-start', source: 'start', target: 'stop' }],
  };
}

export function docFromConversion(c: Pick<FlowchartConversion, 'nodes' | 'edges'>): FlowchartDoc {
  return {
    version: 1,
    nodes: c.nodes.map((n) => ({ id: n.id, shape: n.shape, label: n.label })),
    edges: c.edges.map((e) => ({ ...e })),
  };
}

/**
 * Validate an untrusted doc (request body, localStorage). Returns null when it is
 * not a flowchart doc or exceeds the size limits. Unknown fields are dropped.
 */
export function parseFlowchartDoc(value: unknown): FlowchartDoc | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as { nodes?: unknown; edges?: unknown };
  if (!Array.isArray(v.nodes) || !Array.isArray(v.edges)) return null;
  if (v.nodes.length > FLOWCHART_LIMITS.maxNodes || v.edges.length > FLOWCHART_LIMITS.maxEdges) return null;

  const nodes: FlowchartDocNode[] = [];
  const ids = new Set<string>();
  for (const raw of v.nodes) {
    if (!raw || typeof raw !== 'object') return null;
    const n = raw as Record<string, unknown>;
    if (typeof n.id !== 'string' || !n.id || n.id.length > 64 || ids.has(n.id)) return null;
    if (typeof n.shape !== 'string' || !SHAPES.includes(n.shape as NodeShape)) return null;
    if (typeof n.label !== 'string' || n.label.length > FLOWCHART_LIMITS.maxLabel) return null;
    ids.add(n.id);
    const node: FlowchartDocNode = { id: n.id, shape: n.shape as NodeShape, label: n.label };
    if (typeof n.x === 'number' && Number.isFinite(n.x)) node.x = n.x;
    if (typeof n.y === 'number' && Number.isFinite(n.y)) node.y = n.y;
    if (n.locked === true) node.locked = true;
    if (n.blank === true) node.blank = true;
    nodes.push(node);
  }

  const edges: FlowchartDocEdge[] = [];
  const edgeIds = new Set<string>();
  for (const raw of v.edges) {
    if (!raw || typeof raw !== 'object') return null;
    const e = raw as Record<string, unknown>;
    if (typeof e.id !== 'string' || !e.id || e.id.length > 64 || edgeIds.has(e.id)) return null;
    if (typeof e.source !== 'string' || typeof e.target !== 'string') return null;
    if (!ids.has(e.source) || !ids.has(e.target)) return null;
    if (e.label != null && (typeof e.label !== 'string' || e.label.length > 64)) return null;
    edgeIds.add(e.id);
    const edge: FlowchartDocEdge = { id: e.id, source: e.source, target: e.target };
    if (e.label) edge.label = e.label as string;
    if (typeof e.sourceHandle === 'string' && SIDES.includes(e.sourceHandle)) edge.sourceHandle = e.sourceHandle as HandleSide;
    if (typeof e.targetHandle === 'string' && SIDES.includes(e.targetHandle)) edge.targetHandle = e.targetHandle as HandleSide;
    edges.push(edge);
  }
  return { version: 1, nodes, edges };
}

/**
 * Turn a full flowchart into a "complete the flowchart" template: nodes whose
 * label is listed become empty blanks, every other node is locked. Throws when a
 * listed label isn't in the doc (catches seed typos).
 */
export function makeTemplate(doc: FlowchartDoc, blankLabels: string[]): FlowchartDoc {
  const wanted = new Set(blankLabels);
  const found = new Set<string>();
  const nodes = doc.nodes.map((n) => {
    if (wanted.has(n.label) && !found.has(n.label)) {
      found.add(n.label);
      return { ...n, label: '', blank: true, locked: undefined };
    }
    return { ...n, locked: true, blank: undefined };
  });
  const missing = blankLabels.filter((l) => !found.has(l));
  if (missing.length) throw new Error(`makeTemplate: no node labelled ${missing.map((m) => JSON.stringify(m)).join(', ')}`);
  return { version: 1, nodes, edges: doc.edges.map((e) => ({ ...e })) };
}

/** The labels a template's blanks need, keyed by node id, read off the full doc it came from. */
export function blankAnswers(full: FlowchartDoc, template: FlowchartDoc): Record<string, string> {
  const byId = new Map(full.nodes.map((n) => [n.id, n.label]));
  const answers: Record<string, string> = {};
  for (const n of template.nodes) if (n.blank) answers[n.id] = byId.get(n.id) ?? '';
  return answers;
}

/**
 * Fill a template's blanks from the student's answers. Only blank nodes change;
 * locked structure always comes from the template, so a submission can't redraw it.
 */
export function fillBlanks(template: FlowchartDoc, answers: Record<string, unknown>): FlowchartDoc {
  return {
    version: 1,
    nodes: template.nodes.map((n) => {
      if (!n.blank) return { ...n };
      const a = answers[n.id];
      const label = typeof a === 'string' ? a.slice(0, FLOWCHART_LIMITS.maxLabel) : '';
      return { ...n, label };
    }),
    edges: template.edges.map((e) => ({ ...e })),
  };
}

/** True when the doc has template nodes (a "complete the flowchart" question). */
export function isTemplate(doc: FlowchartDoc | null | undefined): boolean {
  return !!doc && doc.nodes.some((n) => n.blank);
}
