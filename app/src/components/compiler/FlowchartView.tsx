'use client';

import React, { useMemo, type CSSProperties } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowNode, FlowEdge, NodeShape } from '../../interpreter/converters/flowchartConverter';
import { layoutFlowchart, type FlowNodeData } from './flowchartLayout';
import { ShapeBody, SHAPE_ACCENT } from '../flowchart/flowchartShapes';

// ─── Custom node shapes (read-only; handles are non-connectable here) ─────────

const handleStyle: CSSProperties = { width: 6, height: 6, opacity: 0, border: 'none' };

function viewNode(shape: NodeShape) {
  return function ViewNode({ data }: NodeProps) {
    const d = data as FlowNodeData;
    return (
      <>
        <Handle type="target" position={Position.Top} isConnectable={false} style={handleStyle} />
        <ShapeBody shape={shape} w={d.w} h={d.h} label={d.label} />
        <Handle type="source" position={Position.Bottom} isConnectable={false} style={handleStyle} />
      </>
    );
  };
}

const nodeTypes: NodeTypes = {
  process: viewNode('process'),
  terminator: viewNode('terminator'),
  subroutine: viewNode('subroutine'),
  decision: viewNode('decision'),
  io: viewNode('io'),
};

// React Flow CSS-variable overrides so its chrome matches the dark theme.
const rfTheme = {
  height: '100%',
  width: '100%',
  '--xy-edge-stroke': 'var(--color-primary)',
  '--xy-controls-button-background-color': 'var(--color-surface)',
  '--xy-controls-button-background-color-hover': 'var(--color-primary)',
  '--xy-controls-button-color': 'var(--color-light-text)',
  '--xy-controls-button-color-hover': 'var(--color-background)',
  '--xy-controls-button-border-color': 'var(--color-border)',
} as unknown as CSSProperties;

/** Cheap stable key so the canvas remounts (and re-fits) only when the graph changes. */
function graphKey(nodes: FlowNode[]): string {
  let h = 0;
  for (const n of nodes) {
    const s = n.id + n.shape + n.label;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return `${nodes.length}:${h}`;
}

interface FlowchartViewProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

const FlowchartView: React.FC<FlowchartViewProps> = ({ nodes, edges }) => {
  const laid = useMemo(() => layoutFlowchart(nodes, edges), [nodes, edges]);
  const key = useMemo(() => graphKey(nodes), [nodes]);

  return (
    <div style={rfTheme}>
      <ReactFlow
        key={key}
        defaultNodes={laid.nodes}
        defaultEdges={laid.edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--color-border)" gap={20} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => SHAPE_ACCENT[(n.type as NodeShape) ?? 'process'] ?? 'var(--color-dark-text)'}
          maskColor="rgba(0,0,0,0.55)"
          style={{ background: 'var(--color-surface)' }}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowchartView;
