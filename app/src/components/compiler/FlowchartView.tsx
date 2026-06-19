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
import type { FlowNode, FlowEdge } from '../../interpreter/converters/flowchartConverter';
import { layoutFlowchart, type FlowNodeData } from './flowchartLayout';

// ─── Custom node shapes (IGCSE flowchart symbols, themed with app tokens) ─────

const handleStyle: CSSProperties = { width: 6, height: 6, opacity: 0, border: 'none' };

const labelStyle: CSSProperties = {
  fontFamily: 'var(--editor-font-family)',
  fontSize: 12,
  lineHeight: 1.2,
  color: 'var(--color-light-text)',
  textAlign: 'center',
  wordBreak: 'break-word',
  overflow: 'hidden',
};

function withHandles(children: React.ReactNode) {
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={false} style={handleStyle} />
      {children}
      <Handle type="source" position={Position.Bottom} isConnectable={false} style={handleStyle} />
    </>
  );
}

/** Rectangular shapes (process / terminator / subroutine) — a single bordered box. */
function boxNode(extra: CSSProperties, labelExtra: CSSProperties = {}) {
  return function BoxNode({ data }: NodeProps) {
    const d = data as FlowNodeData;
    return (
      <div
        style={{
          width: d.w,
          height: d.h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 14px',
          boxSizing: 'border-box',
          ...extra,
        }}
      >
        {withHandles(<span style={{ ...labelStyle, ...labelExtra }}>{d.label}</span>)}
      </div>
    );
  };
}

/** Clipped shapes (decision diamond / I/O parallelogram) — accent rim + surface fill. */
function clippedNode(clip: string, accent: string, padX: number) {
  return function ClippedNode({ data }: NodeProps) {
    const d = data as FlowNodeData;
    return (
      <div style={{ position: 'relative', width: d.w, height: d.h, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
        {withHandles(
          <>
            <div style={{ position: 'absolute', inset: 0, background: accent, clipPath: clip }} />
            <div
              style={{
                position: 'absolute',
                inset: 2,
                background: 'var(--color-surface)',
                clipPath: clip,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `0 ${padX}px`,
                boxSizing: 'border-box',
              }}
            >
              <span style={labelStyle}>{d.label}</span>
            </div>
          </>,
        )}
      </div>
    );
  };
}

const DIAMOND = 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';
const PARALLELOGRAM = 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)';

const nodeTypes: NodeTypes = {
  process: boxNode({
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 6,
  }),
  terminator: boxNode(
    {
      background: 'var(--color-primary)',
      borderRadius: 9999,
    },
    { color: 'var(--color-background)', fontWeight: 700 },
  ),
  subroutine: boxNode({
    background: 'var(--color-surface)',
    borderTop: '1px solid var(--color-primary)',
    borderBottom: '1px solid var(--color-primary)',
    borderLeft: '4px double var(--color-primary)',
    borderRight: '4px double var(--color-primary)',
    borderRadius: 3,
  }),
  decision: clippedNode(DIAMOND, 'var(--color-warning)', 28),
  io: clippedNode(PARALLELOGRAM, 'var(--color-info)', 24),
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

const MINIMAP_COLORS: Record<string, string> = {
  terminator: 'var(--color-primary)',
  decision: 'var(--color-warning)',
  io: 'var(--color-info)',
  subroutine: 'var(--color-primary)',
  process: 'var(--color-dark-text)',
};

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
          nodeColor={(n) => MINIMAP_COLORS[n.type ?? 'process'] ?? 'var(--color-dark-text)'}
          maskColor="rgba(0,0,0,0.55)"
          style={{ background: 'var(--color-surface)' }}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowchartView;
