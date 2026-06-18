// Positions the abstract flowchart graph with dagre and adapts it to React Flow.
// Kept separate from the converter so the converter stays pure/testable and dagre
// only loads inside the (lazily imported) FlowchartView.

import dagre from '@dagrejs/dagre';
import { MarkerType, Position, type Node, type Edge } from '@xyflow/react';
import type { FlowNode, FlowEdge, NodeShape } from '../../interpreter/converters/flowchartConverter';

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  w: number;
  h: number;
}

const CHAR_W = 7.3; // approx px per char at the node font size

/** Estimated box size per shape — diamonds need extra room since text sits in the middle. */
function nodeSize(n: FlowNode): { w: number; h: number } {
  const len = n.label.length;
  switch (n.shape) {
    case 'decision':
      return { w: clamp(len * 8 + 70, 150, 340), h: 84 };
    case 'terminator':
      return { w: clamp(len * CHAR_W + 48, 110, 300), h: 46 };
    case 'io':
      return { w: clamp(len * CHAR_W + 48, 110, 300), h: 50 };
    case 'subroutine':
      return { w: clamp(len * CHAR_W + 44, 110, 300), h: 50 };
    default:
      return { w: clamp(len * CHAR_W + 36, 100, 300), h: 46 };
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export interface LaidOut {
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
}

export function layoutFlowchart(nodes: FlowNode[], edges: FlowEdge[]): LaidOut {
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

  const rfNodes: Node<FlowNodeData>[] = nodes.map((n) => {
    const p = g.node(n.id);
    const s = sizes.get(n.id)!;
    const cx = p?.x ?? 0;
    const cy = p?.y ?? 0;
    return {
      id: n.id,
      type: shapeType(n.shape),
      position: { x: cx - s.w / 2, y: cy - s.h / 2 },
      data: { label: n.label, w: s.w, h: s.h },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true,
    };
  });

  const rfEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: 'var(--color-primary)' },
    style: { stroke: 'var(--color-primary)', strokeWidth: 1.5 },
    labelStyle: { fill: 'var(--color-light-text)', fontSize: 11, fontWeight: 600 },
    labelBgStyle: { fill: 'var(--color-surface)' },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
  }));

  return { nodes: rfNodes, edges: rfEdges };
}

/** React Flow node-type key registered in FlowchartView's nodeTypes map. */
function shapeType(shape: NodeShape): string {
  return shape; // 1:1 with the registered custom node components
}
