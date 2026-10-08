'use client';

import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowNode, FlowEdge, NodeShape } from '@/modules/interpreter/converters/flowchartConverter';
import { flowchartCanvasTheme, flowchartNodeTypes, MINIMAP_COLORS } from '@/modules/flowchart/shapes';
import { layoutFlowchart } from './flowchartLayout';


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
    <div style={flowchartCanvasTheme}>
      <ReactFlow
        key={key}
        defaultNodes={laid.nodes}
        defaultEdges={laid.edges}
        nodeTypes={flowchartNodeTypes}
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
          nodeColor={(n) => MINIMAP_COLORS[(n.type ?? 'process') as NodeShape] ?? 'var(--color-dark-text)'}
          maskColor="rgba(0,0,0,0.55)"
          style={{ background: 'var(--color-surface)' }}
        />
      </ReactFlow>
    </div>
  );
};

export default FlowchartView;
