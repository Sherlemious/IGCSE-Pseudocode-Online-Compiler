'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  type NodeTypes,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Circle, Square, Diamond, RectangleHorizontal, Box, GitBranch, Repeat, RotateCcw, Trash2 } from 'lucide-react';
import type { NodeShape, FlowNode, FlowEdge } from '../../interpreter/converters/flowchartConverter';
import { ShapeBody, SHAPE_ACCENT } from './flowchartShapes';

// ─── Node model ───────────────────────────────────────────────────────────────

export interface EditorNodeData extends Record<string, unknown> {
  label: string;
  shape: NodeShape;
  w: number;
  h: number;
}
export type EditorNode = Node<EditorNodeData>;

const DEFAULT_SIZE: Record<NodeShape, { w: number; h: number }> = {
  terminator: { w: 130, h: 46 },
  process: { w: 175, h: 48 },
  io: { w: 185, h: 54 },
  decision: { w: 200, h: 92 },
  subroutine: { w: 185, h: 50 },
};

const DEFAULT_LABEL: Record<NodeShape, string> = {
  terminator: 'START',
  process: 'x ← 0',
  io: 'OUTPUT x',
  decision: 'condition',
  subroutine: 'CALL Name()',
};

let idCounter = 0;
const newId = () => `fc_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

export function makeNode(shape: NodeShape, position: { x: number; y: number }, label?: string): EditorNode {
  const size = DEFAULT_SIZE[shape];
  return { id: newId(), type: shape, position, data: { label: label ?? DEFAULT_LABEL[shape], shape, w: size.w, h: size.h } };
}

/** A starter canvas: a START and a STOP terminator for the student to build between. */
export function seedGraph(): { nodes: EditorNode[]; edges: Edge[] } {
  return {
    nodes: [makeNode('terminator', { x: 260, y: 30 }, 'START'), makeNode('terminator', { x: 260, y: 380 }, 'STOP')],
    edges: [],
  };
}

/** Adapt the React Flow graph to the abstract graph the converters use. */
export function toGraph(nodes: EditorNode[], edges: Edge[]): { nodes: FlowNode[]; edges: FlowEdge[] } {
  return {
    nodes: nodes.map((n) => ({ id: n.id, shape: n.data.shape, label: n.data.label })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label == null ? undefined : String(e.label) })),
  };
}

// ─── Active-node highlight (debug / error) ────────────────────────────────────

const ActiveNodeContext = createContext<string | null>(null);
// Lets the in-node label editor mutate the same state source the canvas is controlled by.
const SetNodesContext = createContext<React.Dispatch<React.SetStateAction<EditorNode[]>> | null>(null);

// ─── Editable node component ──────────────────────────────────────────────────

const handleStyle: CSSProperties = {
  width: 9,
  height: 9,
  background: 'var(--color-primary)',
  border: '1.5px solid var(--color-surface)',
};

function EditableNode({ id, data }: NodeProps<EditorNode>) {
  const setNodes = useContext(SetNodesContext);
  const activeId = useContext(ActiveNodeContext);
  const isActive = activeId === id;
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(data.label);

  const commit = useCallback(() => {
    setEditing(false);
    setNodes?.((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: val.trim() || n.data.label } } : n)));
  }, [id, val, setNodes]);

  const slot = editing ? (
    <input
      autoFocus
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        else if (e.key === 'Escape') { setVal(data.label); setEditing(false); }
        e.stopPropagation();
      }}
      className="nodrag nopan"
      style={{
        width: '92%',
        background: 'var(--color-background)',
        color: 'var(--color-light-text)',
        border: '1px solid var(--color-primary)',
        borderRadius: 4,
        font: '12px var(--editor-font-family)',
        textAlign: 'center',
        outline: 'none',
        padding: '1px 4px',
      }}
    />
  ) : undefined;

  return (
    <div
      onDoubleClick={() => { setVal(data.label); setEditing(true); }}
      title="Double-click to edit"
      style={{ borderRadius: 10, boxShadow: isActive ? '0 0 0 3px var(--color-success)' : undefined }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <ShapeBody shape={data.shape} w={data.w} h={data.h} label={data.label} slot={slot} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  terminator: EditableNode,
  process: EditableNode,
  io: EditableNode,
  decision: EditableNode,
  subroutine: EditableNode,
};

export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: 'var(--color-primary)' },
  style: { stroke: 'var(--color-primary)', strokeWidth: 1.5 },
  labelStyle: { fill: 'var(--color-light-text)', fontSize: 11, fontWeight: 600 },
  labelBgStyle: { fill: 'var(--color-surface)' },
  labelBgPadding: [4, 2],
  labelBgBorderRadius: 4,
};

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

// ─── Palette ──────────────────────────────────────────────────────────────────

const SHAPE_ITEMS: { shape: NodeShape; label: string; Icon: typeof Square }[] = [
  { shape: 'terminator', label: 'Terminator', Icon: Circle },
  { shape: 'process', label: 'Process', Icon: Square },
  { shape: 'io', label: 'Input / Output', Icon: RectangleHorizontal },
  { shape: 'decision', label: 'Decision', Icon: Diamond },
  { shape: 'subroutine', label: 'Subroutine', Icon: Box },
];

const SCAFFOLD_ITEMS: { kind: 'if' | 'while' | 'repeat'; label: string; Icon: typeof Square }[] = [
  { kind: 'if', label: 'IF block', Icon: GitBranch },
  { kind: 'while', label: 'WHILE loop', Icon: RotateCcw },
  { kind: 'repeat', label: 'REPEAT loop', Icon: Repeat },
];

function Palette({
  onAddShape,
  onAddScaffold,
  onClear,
}: {
  onAddShape: (shape: NodeShape) => void;
  onAddScaffold: (kind: 'if' | 'while' | 'repeat') => void;
  onClear: () => void;
}) {
  const btn =
    'w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded text-dark-text hover:text-light-text hover:bg-background/60 transition-colors';
  return (
    <div className="w-40 shrink-0 border-r border-border bg-surface/50 flex flex-col overflow-y-auto">
      <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-text/50">Shapes</div>
      {SHAPE_ITEMS.map(({ shape, label, Icon }) => (
        <button key={shape} className={btn} onClick={() => onAddShape(shape)} title={`Add ${label}`}>
          <Icon size={13} style={{ color: SHAPE_ACCENT[shape] }} />
          {label}
        </button>
      ))}
      <div className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-text/50">Scaffolds</div>
      {SCAFFOLD_ITEMS.map(({ kind, label, Icon }) => (
        <button key={kind} className={btn} onClick={() => onAddScaffold(kind)} title={`Insert a wired ${label}`}>
          <Icon size={13} className="text-primary" />
          {label}
        </button>
      ))}
      <div className="mt-auto p-2 border-t border-border space-y-2">
        <button className={`${btn} text-error/80 hover:text-error hover:bg-error/10`} onClick={onClear} title="Clear the canvas">
          <Trash2 size={13} />
          Clear
        </button>
        <p className="text-[10px] leading-snug text-dark-text/50">
          Double-click a box to edit it. Drag from the dots to connect. Click an arrow to flip Yes/No. Select + Delete to remove.
        </p>
      </div>
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export interface FlowchartEditorProps {
  initial: { nodes: EditorNode[]; edges: Edge[] };
  onChange?: (nodes: EditorNode[], edges: Edge[]) => void;
  activeNodeId?: string | null;
}

function EditorInner({ initial, onChange, activeNodeId }: FlowchartEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<EditorNode>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const { screenToFlowPosition } = useReactFlow<EditorNode>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { onChange?.(nodes, edges); }, [nodes, edges, onChange]);

  const dropPoint = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    const sx = rect ? rect.left + rect.width / 2 : window.innerWidth / 3;
    const sy = rect ? rect.top + rect.height / 3 : 160;
    const jitter = () => (Math.random() - 0.5) * 40;
    return screenToFlowPosition({ x: sx + jitter(), y: sy + jitter() });
  }, [screenToFlowPosition]);

  const onAddShape = useCallback((shape: NodeShape) => {
    setNodes((ns) => [...ns, makeNode(shape, dropPoint())]);
  }, [setNodes, dropPoint]);

  const onAddScaffold = useCallback((kind: 'if' | 'while' | 'repeat') => {
    const base = dropPoint();
    const { nodes: ns, edges: es } = buildScaffold(kind, base);
    setNodes((cur) => [...cur, ...ns]);
    setEdges((cur) => [...cur, ...es]);
  }, [setNodes, setEdges, dropPoint]);

  const onClear = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Clear the whole canvas?')) return;
    const seed = seedGraph();
    setNodes(seed.nodes);
    setEdges(seed.edges);
  }, [setNodes, setEdges]);

  const onConnect = useCallback((c: Connection) => {
    setEdges((eds) => {
      const src = nodes.find((n) => n.id === c.source);
      let label: string | undefined;
      if (src && src.data.shape === 'decision') {
        const has = (re: RegExp) => eds.some((e) => e.source === c.source && re.test(String(e.label ?? '')));
        label = has(/yes/i) ? 'No' : 'Yes';
      }
      return addEdge({ ...c, label }, eds);
    });
  }, [nodes, setEdges]);

  // Click an edge to cycle its branch label (helps fix a mislabelled Yes/No).
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    const next: Record<string, string | undefined> = { Yes: 'No', No: undefined, '': 'Yes' };
    setEdges((eds) => eds.map((e) => (e.id === edge.id ? { ...e, label: next[String(e.label ?? '')] ?? 'Yes' } : e)));
  }, [setEdges]);

  return (
    <div className="flex-1 min-h-0 flex">
      <Palette onAddShape={onAddShape} onAddScaffold={onAddScaffold} onClear={onClear} />
      <div ref={wrapperRef} className="flex-1 min-h-0" style={rfTheme}>
        <ActiveNodeContext.Provider value={activeNodeId ?? null}>
        <SetNodesContext.Provider value={setNodes}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            deleteKeyCode={['Delete']}
            fitView
            minZoom={0.2}
            maxZoom={2}
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
        </SetNodesContext.Provider>
        </ActiveNodeContext.Provider>
      </div>
    </div>
  );
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = (props) => (
  <ReactFlowProvider>
    <EditorInner {...props} />
  </ReactFlowProvider>
);

export default FlowchartEditor;

// ─── Scaffolds (pre-wired structured blocks) ──────────────────────────────────

function buildScaffold(kind: 'if' | 'while' | 'repeat', base: { x: number; y: number }): { nodes: EditorNode[]; edges: Edge[] } {
  const at = (dx: number, dy: number) => ({ x: base.x + dx, y: base.y + dy });
  const edge = (source: string, target: string, label?: string): Edge => ({ id: newId(), source, target, label });

  if (kind === 'if') {
    const d = makeNode('decision', at(0, 0), 'condition');
    const t = makeNode('process', at(-130, 130), 'statement');
    const f = makeNode('process', at(130, 130), 'statement');
    return { nodes: [d, t, f], edges: [edge(d.id, t.id, 'Yes'), edge(d.id, f.id, 'No')] };
  }
  if (kind === 'while') {
    const d = makeNode('decision', at(0, 0), 'condition');
    const b = makeNode('process', at(-30, 140), 'statement');
    return { nodes: [d, b], edges: [edge(d.id, b.id, 'Yes'), edge(b.id, d.id)] };
  }
  // repeat
  const b = makeNode('process', at(0, 0), 'statement');
  const d = makeNode('decision', at(0, 140), 'condition');
  return { nodes: [b, d], edges: [edge(b.id, d.id), edge(d.id, b.id, 'No')] };
}
