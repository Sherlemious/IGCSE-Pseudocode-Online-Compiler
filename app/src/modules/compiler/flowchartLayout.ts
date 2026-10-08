// Positions the abstract flowchart graph with dagre and adapts it to React Flow.
// Kept separate from the converter so the converter stays pure/testable and dagre
// only loads inside the (lazily imported) FlowchartView.

import dagre from '@dagrejs/dagre';
import { MarkerType, Position, type Node, type Edge } from '@xyflow/react';
import type { FlowNode, FlowEdge, NodeShape } from '@/modules/interpreter/converters/flowchartConverter';

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  w: number;
  h: number;
}

const CHAR_W = 7.3; // approx px per char at the node font size

const LINE_H = 15; // px per extra label line

/** Estimated box size per shape — diamonds need extra room since text sits in the middle. */
export function nodeSize(n: Pick<FlowNode, 'shape' | 'label'>): { w: number; h: number } {
  const lines = n.label.split('\n');
  const len = Math.max(...lines.map((l) => l.length));
  const extra = (Math.min(lines.length, 8) - 1) * LINE_H;
  switch (n.shape) {
    case 'decision':
      return { w: clamp(len * 8 + 70, 150, 340), h: 84 + extra * 2 };
    case 'terminator':
      return { w: clamp(len * CHAR_W + 48, 110, 300), h: 46 + extra };
    case 'io':
      return { w: clamp(len * CHAR_W + 48, 110, 300), h: 50 + extra };
    case 'subroutine':
      return { w: clamp(len * CHAR_W + 44, 110, 300), h: 50 + extra };
    default:
      return { w: clamp(len * CHAR_W + 36, 100, 300), h: 46 + extra };
  }
}

/** dagre positions (top-left corners) for a graph, keyed by node id. */
export function layoutPositions(
  nodes: Pick<FlowNode, 'id' | 'shape' | 'label'>[],
  edges: Pick<FlowEdge, 'source' | 'target'>[],
): Map<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 45, ranksep: 55, marginx: 24, marginy: 24 });
  g.setDefaultEdgeLabel(() => ({}));
  const sizes = new Map<string, { w: number; h: number }>();
  for (const n of nodes) {
    const s = nodeSize(n);
    sizes.set(n.id, s);
    g.setNode(n.id, { width: s.w, height: s.h });
  }
  for (const e of edges) g.setEdge(e.source, e.target);
  dagre.layout(g);
  const out = new Map<string, { x: number; y: number }>();
  for (const n of nodes) {
    const p = g.node(n.id);
    const s = sizes.get(n.id)!;
    out.set(n.id, { x: (p?.x ?? 0) - s.w / 2, y: (p?.y ?? 0) - s.h / 2 });
  }
  return out;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Shared look for flowchart arrows (read-only view and builder). */
export const EDGE_STYLE = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: 'var(--color-primary)' },
  style: { stroke: 'var(--color-primary)', strokeWidth: 1.5 },
  labelStyle: { fill: 'var(--color-light-text)', fontSize: 11, fontWeight: 600 },
  labelBgStyle: { fill: 'var(--color-surface)' },
  labelBgPadding: [4, 2] as [number, number],
  labelBgBorderRadius: 4,
} satisfies Partial<Edge>;

export interface LaidOut {
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
}

export function layoutFlowchart(nodes: FlowNode[], edges: FlowEdge[]): LaidOut {
  const positions = layoutPositions(nodes, edges);
  const rfNodes: Node<FlowNodeData>[] = nodes.map((n) => {
    const s = nodeSize(n);
    return {
      id: n.id,
      type: shapeType(n.shape),
      position: positions.get(n.id) ?? { x: 0, y: 0 },
      data: { label: n.label, w: s.w, h: s.h },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true,
    };
  });

  const rfEdges: Edge[] = edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label, ...EDGE_STYLE }));

  return { nodes: rfNodes, edges: rfEdges };
}

/** React Flow node-type key registered in FlowchartView's nodeTypes map. */
function shapeType(shape: NodeShape): string {
  return shape; // 1:1 with the registered custom node components
}
