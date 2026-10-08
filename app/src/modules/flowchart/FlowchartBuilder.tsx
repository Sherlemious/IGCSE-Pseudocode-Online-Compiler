'use client';

// Editable flowchart canvas. Controlled: the owner holds the FlowchartDoc and
// gets every change through onChange; undo/redo history lives here.
//
// Modes:
//   free     — draw anything (the /flowchart page, "draw the flowchart" questions)
//   template — "complete the flowchart": structure is locked, only blank boxes
//              take a label
//   view     — read-only diagram (pan/zoom only)

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  useReactFlow,
  getNodesBounds,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toCanvas } from 'html-to-image';
import { ArrowLeftRight, Download, LayoutGrid, Maximize, Redo2, Trash2, Undo2 } from 'lucide-react';
import type { NodeShape } from '@/modules/interpreter/converters/flowchartConverter';
import type { FlowchartDoc, FlowchartDocEdge, FlowchartDocNode, HandleSide } from '@/modules/interpreter/converters/flowchartDoc';
import type { FlowchartIssue } from '@/modules/interpreter/converters/flowchartToPseudocode';
import { EDGE_STYLE, nodeSize } from '@/modules/compiler/flowchartLayout';
import { downloadBlob } from '@/modules/compiler/exportImage';
import { captureEvent } from '@/modules/interpreter/analytics';
import { BRAND } from '@/shared/brand';
import { SITE_URL } from '@/shared/lib/seo';
import { flowchartCanvasTheme, flowchartNodeTypes, MINIMAP_COLORS, SHAPE_INFO, type ShapeData } from './shapes';
import { tidyDoc, withPositions } from './docLayout';

export type BuilderMode = 'free' | 'template' | 'view';

export interface FlowchartBuilderProps {
  doc: FlowchartDoc;
  onChange: (doc: FlowchartDoc) => void;
  mode?: BuilderMode;
  /** Problems to ring on the canvas (from flowchartToPseudocode or a run). */
  issues?: FlowchartIssue[];
  /** Box the debugger is paused on. */
  activeNodeId?: string | null;
  /** Select and centre this box (e.g. a clicked problem); bump `nonce` to repeat. */
  focusRequest?: { nodeId: string; nonce: number } | null;
  /** Telemetry `surface` (`builder` | `practice` | `learn`). */
  surface: string;
  /** Export PNG file name (without extension); omit to hide the button. */
  exportName?: string;
  ariaLabel?: string;
}

const HISTORY_LIMIT = 100;
const ROOM = 60; // gap between a box and one added after it

type Selection = { kind: 'node' | 'edge'; id: string } | null;

const SINGLE_EXIT: readonly NodeShape[] = ['process', 'io', 'subroutine', 'terminator'];

function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Next branch label for a new arrow out of a decision. */
function nextBranchLabel(doc: FlowchartDoc, source: string): string | undefined {
  const labels = doc.edges.filter((e) => e.source === source).map((e) => (e.label ?? '').toLowerCase());
  if (!labels.includes('yes')) return 'Yes';
  if (!labels.includes('no')) return 'No';
  return undefined;
}

function ShapeIcon({ shape }: { shape: NodeShape }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 };
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden>
      {shape === 'terminator' && <rect x="1" y="2" width="20" height="10" rx="5" {...common} />}
      {shape === 'process' && <rect x="2" y="2" width="18" height="10" rx="1" {...common} />}
      {shape === 'io' && <polygon points="5,2 21,2 17,12 1,12" {...common} />}
      {shape === 'decision' && <polygon points="11,1 21,7 11,13 1,7" {...common} />}
      {shape === 'subroutine' && (
        <>
          <rect x="1" y="2" width="20" height="10" rx="1" {...common} />
          <line x1="4" y1="2" x2="4" y2="12" {...common} />
          <line x1="18" y1="2" x2="18" y2="12" {...common} />
        </>
      )}
    </svg>
  );
}

function BuilderCanvas({
  doc: rawDoc,
  onChange,
  mode = 'free',
  issues = [],
  activeNodeId = null,
  focusRequest = null,
  surface,
  exportName,
  ariaLabel = 'Flowchart',
}: FlowchartBuilderProps) {
  const rf = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [measured, setMeasured] = useState<Record<string, { width: number; height: number }>>({});
  const past = useRef<FlowchartDoc[]>([]);
  const future = useRef<FlowchartDoc[]>([]);
  const [, setHistoryTick] = useState(0);
  const dragging = useRef(false);
  const [focusLabelNonce, setFocusLabelNonce] = useState(0);

  const doc = useMemo(() => withPositions(rawDoc), [rawDoc]);
  const docRef = useRef(doc);
  docRef.current = doc;

  // Persist positions for docs that arrived without them, so dragging works from the start.
  useEffect(() => {
    if (doc !== rawDoc) onChange(doc);
  }, [doc, rawDoc, onChange]);

  const free = mode === 'free';
  const nodeById = useMemo(() => new Map(doc.nodes.map((n) => [n.id, n])), [doc.nodes]);

  // ─── History ───────────────────────────────────────────────────────────────

  const remember = useCallback(() => {
    past.current.push(docRef.current);
    if (past.current.length > HISTORY_LIMIT) past.current.shift();
    future.current = [];
    setHistoryTick((t) => t + 1);
  }, []);

  /** Apply a change; `record` adds an undo step first. */
  const commit = useCallback(
    (next: FlowchartDoc, record = true) => {
      if (record) remember();
      onChange(next);
    },
    [onChange, remember],
  );

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(docRef.current);
    setHistoryTick((t) => t + 1);
    onChange(prev);
  }, [onChange]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(docRef.current);
    setHistoryTick((t) => t + 1);
    onChange(next);
  }, [onChange]);

  // ─── React Flow view of the doc ─────────────────────────────────────────────

  const errorNodes = useMemo(() => new Set(issues.map((i) => i.nodeId).filter(Boolean)), [issues]);
  const errorEdges = useMemo(() => new Set(issues.map((i) => i.edgeId).filter(Boolean)), [issues]);

  const nodes: Node<ShapeData>[] = useMemo(
    () =>
      doc.nodes.map((n) => {
        const size = nodeSize(n);
        const m = measured[n.id];
        return {
          id: n.id,
          type: n.shape,
          position: { x: n.x ?? 0, y: n.y ?? 0 },
          data: {
            label: n.label,
            w: size.w,
            h: size.h,
            editable: free,
            blank: n.blank,
            status: errorNodes.has(n.id) ? 'error' : activeNodeId === n.id ? 'active' : null,
          },
          ...(m ? { measured: m } : {}),
          selected: selection?.kind === 'node' && selection.id === n.id,
          draggable: mode !== 'view' && !n.locked,
          deletable: free && !n.locked,
          connectable: free,
          selectable: mode !== 'view',
        };
      }),
    [doc.nodes, measured, free, mode, errorNodes, activeNodeId, selection],
  );

  const edges: Edge[] = useMemo(
    () =>
      doc.edges.map((e) => {
        const selected = selection?.kind === 'edge' && selection.id === e.id;
        const color = errorEdges.has(e.id) ? 'var(--color-error)' : selected ? 'var(--color-info)' : 'var(--color-primary)';
        return {
          ...EDGE_STYLE,
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle ?? null,
          targetHandle: e.targetHandle ?? null,
          label: e.label,
          selected,
          deletable: free,
          selectable: free,
          style: { stroke: color, strokeWidth: selected || errorEdges.has(e.id) ? 2.5 : 1.5 },
          markerEnd: { ...EDGE_STYLE.markerEnd, color },
          interactionWidth: 24,
        };
      }),
    [doc.edges, selection, errorEdges, free],
  );

  // ─── Edits ─────────────────────────────────────────────────────────────────

  const deleteNodes = useCallback(
    (ids: Set<string>) => {
      const d = docRef.current;
      const removable = new Set([...ids].filter((id) => !nodeById.get(id)?.locked));
      if (!removable.size) return;
      commit({
        ...d,
        nodes: d.nodes.filter((n) => !removable.has(n.id)),
        edges: d.edges.filter((e) => !removable.has(e.source) && !removable.has(e.target)),
      });
      setSelection(null);
    },
    [commit, nodeById],
  );

  const deleteEdges = useCallback(
    (ids: Set<string>) => {
      const d = docRef.current;
      commit({ ...d, edges: d.edges.filter((e) => !ids.has(e.id)) });
      setSelection(null);
    },
    [commit],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ShapeData>>[]) => {
      let positions: Map<string, { x: number; y: number }> | null = null;
      const removed = new Set<string>();
      let dims: Record<string, { width: number; height: number }> | null = null;
      let dragEnded = false;
      for (const c of changes) {
        if (c.type === 'position' && c.position) {
          if (c.dragging && !dragging.current) {
            dragging.current = true;
            remember();
          }
          if (!c.dragging) dragEnded = true;
          (positions ??= new Map()).set(c.id, c.position);
        } else if (c.type === 'position' && c.dragging === false) {
          dragEnded = true;
        } else if (c.type === 'remove') {
          removed.add(c.id);
        } else if (c.type === 'select') {
          if (c.selected) setSelection({ kind: 'node', id: c.id });
          else setSelection((s) => (s?.kind === 'node' && s.id === c.id ? null : s));
        } else if (c.type === 'dimensions' && c.dimensions) {
          (dims ??= {})[c.id] = { width: c.dimensions.width, height: c.dimensions.height };
        }
      }
      if (dragEnded) dragging.current = false;
      if (dims) {
        const update = dims;
        setMeasured((m) => ({ ...m, ...update }));
      }
      if (positions) {
        const pos = positions;
        const d = docRef.current;
        onChange({
          ...d,
          nodes: d.nodes.map((n) => (pos.has(n.id) ? { ...n, x: pos.get(n.id)!.x, y: pos.get(n.id)!.y } : n)),
        });
      }
      if (removed.size && free) deleteNodes(removed);
    },
    [onChange, remember, deleteNodes, free],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const removed = new Set<string>();
      for (const c of changes) {
        if (c.type === 'remove') removed.add(c.id);
        else if (c.type === 'select') {
          if (c.selected) setSelection({ kind: 'edge', id: c.id });
          else setSelection((s) => (s?.kind === 'edge' && s.id === c.id ? null : s));
        }
      }
      if (removed.size && free) deleteEdges(removed);
    },
    [deleteEdges, free],
  );

  const connect = useCallback(
    (d: FlowchartDoc, source: string, target: string, sourceHandle?: HandleSide, targetHandle?: HandleSide) => {
      const from = d.nodes.find((n) => n.id === source);
      if (!from || source === target) return d;
      if (d.edges.some((e) => e.source === source && e.target === target)) return d;
      let edges = d.edges;
      // A box with one way out: drawing a new arrow moves the old one.
      if (SINGLE_EXIT.includes(from.shape)) edges = edges.filter((e) => e.source !== source);
      const edge: FlowchartDocEdge = { id: newId('e'), source, target };
      if (from.shape === 'decision') {
        const label = nextBranchLabel({ ...d, edges }, source);
        if (label) edge.label = label;
      }
      if (sourceHandle) edge.sourceHandle = sourceHandle;
      if (targetHandle) edge.targetHandle = targetHandle;
      return { ...d, edges: [...edges, edge] };
    },
    [],
  );

  const onConnect = useCallback(
    (c: Connection) => {
      if (!free || !c.source || !c.target) return;
      const next = connect(
        docRef.current,
        c.source,
        c.target,
        (c.sourceHandle ?? undefined) as HandleSide | undefined,
        (c.targetHandle ?? undefined) as HandleSide | undefined,
      );
      if (next !== docRef.current) commit(next);
    },
    [free, connect, commit],
  );

  const addShape = useCallback(
    (shape: NodeShape) => {
      const d = docRef.current;
      const info = SHAPE_INFO.find((s) => s.shape === shape)!;
      let label = info.defaultLabel;
      if (shape === 'terminator' && !d.nodes.some((n) => n.shape === 'terminator' && /^(START|BEGIN)\b/i.test(n.label.trim()))) {
        label = 'START';
      }
      const id = newId('n');
      const size = nodeSize({ shape, label });
      const selected = selection?.kind === 'node' ? d.nodes.find((n) => n.id === selection.id) : undefined;
      // New boxes go after the selected one, unless that is an end box.
      const sel =
        selected &&
        !(selected.shape === 'terminator' && !/^(START|BEGIN|PROCEDURE|FUNCTION)\b/i.test(selected.label.trim()))
          ? selected
          : undefined;

      let x: number;
      let y: number;
      let next: FlowchartDoc;
      const node: FlowchartDocNode = { id, shape, label };
      if (sel) {
        const selSize = nodeSize(sel);
        const outs = d.edges.filter((e) => e.source === sel.id);
        const toRight = sel.shape === 'decision' && outs.length === 1;
        x = toRight ? (sel.x ?? 0) + selSize.w + ROOM : (sel.x ?? 0) + selSize.w / 2 - size.w / 2;
        y = toRight ? (sel.y ?? 0) + selSize.h / 2 - size.h / 2 : (sel.y ?? 0) + selSize.h + ROOM;
        next = { ...d, nodes: [...d.nodes, { ...node, x, y }] };
        if (sel.shape === 'decision') {
          if (outs.length < 2) next = connect(next, sel.id, id, toRight ? 'r' : 'b');
        } else {
          // Insert between the selected box and whatever it pointed at. A new
          // decision starts with no arrows out: its next two boxes become Yes and No.
          const old = outs[0];
          next = connect(next, sel.id, id);
          if (old) {
            if (shape !== 'decision') next = connect(next, id, old.target, undefined, old.targetHandle);
            // Make room: push everything at or below the new box down.
            next = {
              ...next,
              nodes: next.nodes.map((n) =>
                n.id !== id && n.id !== sel.id && (n.y ?? 0) >= y - 1 ? { ...n, y: (n.y ?? 0) + size.h + ROOM } : n,
              ),
            };
          }
        }
      } else {
        const rect = wrapperRef.current?.getBoundingClientRect();
        const center = rect
          ? rf.screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
          : { x: 0, y: 0 };
        x = center.x - size.w / 2;
        y = center.y - size.h / 2;
        next = { ...d, nodes: [...d.nodes, { ...node, x, y }] };
      }
      commit(next);
      setSelection({ kind: 'node', id });
      setFocusLabelNonce((n) => n + 1);
      captureEvent('flowchart_node_added', { shape, surface });
    },
    [selection, connect, commit, rf, surface],
  );

  const setLabel = useCallback(
    (id: string, label: string) => {
      const d = docRef.current;
      onChange({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, label } : n)) });
    },
    [onChange],
  );

  const setEdgeLabel = useCallback(
    (id: string, label: string) => {
      const d = docRef.current;
      commit({ ...d, edges: d.edges.map((e) => (e.id === id ? { ...e, label: label || undefined } : e)) });
    },
    [commit],
  );

  const swapBranches = useCallback(
    (id: string) => {
      const d = docRef.current;
      const swap = (l?: string) => (l?.toLowerCase() === 'yes' ? 'No' : l?.toLowerCase() === 'no' ? 'Yes' : l);
      commit({ ...d, edges: d.edges.map((e) => (e.source === id ? { ...e, label: swap(e.label) } : e)) });
    },
    [commit],
  );

  const tidy = useCallback(() => {
    commit(tidyDoc(docRef.current));
    requestAnimationFrame(() => rf.fitView({ padding: 0.2, duration: 250 }));
  }, [commit, rf]);

  const exportPng = useCallback(async () => {
    const wrapper = wrapperRef.current;
    const viewport = wrapper?.querySelector<HTMLElement>('.react-flow__viewport');
    if (!wrapper || !viewport || !exportName) return;
    const blob = await renderFlowchartPng(wrapper, viewport, getNodesBounds(rf.getNodes()));
    if (blob) {
      downloadBlob(blob, `${exportName}.png`);
      captureEvent('flowchart_exported', { surface, node_count: docRef.current.nodes.length });
    }
  }, [exportName, rf, surface]);

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (focusLabelNonce) requestAnimationFrame(() => labelRef.current?.focus());
  }, [focusLabelNonce]);

  useEffect(() => {
    if (!focusRequest) return;
    const n = docRef.current.nodes.find((x) => x.id === focusRequest.nodeId);
    if (!n) return;
    setSelection({ kind: 'node', id: n.id });
    const s = nodeSize(n);
    rf.setCenter((n.x ?? 0) + s.w / 2, (n.y ?? 0) + s.h / 2, { zoom: Math.max(rf.getZoom(), 1), duration: 300 });
  }, [focusRequest, rf]);

  // Keep the debugger's box in view while stepping.
  useEffect(() => {
    if (!activeNodeId) return;
    const n = docRef.current.nodes.find((x) => x.id === activeNodeId);
    if (!n) return;
    const s = nodeSize(n);
    rf.setCenter((n.x ?? 0) + s.w / 2, (n.y ?? 0) + s.h / 2, { zoom: rf.getZoom(), duration: 200 });
  }, [activeNodeId, rf]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('textarea, input')) return;
      if (!(e.ctrlKey || e.metaKey) || mode === 'view') return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo, mode],
  );

  // ─── Inspector ─────────────────────────────────────────────────────────────

  const selNode = selection?.kind === 'node' ? nodeById.get(selection.id) : undefined;
  const selEdge = selection?.kind === 'edge' ? doc.edges.find((e) => e.id === selection.id) : undefined;
  const selIssue = selNode
    ? issues.find((i) => i.nodeId === selNode.id)
    : selEdge
      ? issues.find((i) => i.edgeId === selEdge.id)
      : undefined;
  const labelEditable = !!selNode && mode !== 'view' && (free ? !selNode.locked : !!selNode.blank);
  const selInfo = selNode ? SHAPE_INFO.find((s) => s.shape === selNode.shape) : undefined;
  const btn =
    'inline-flex items-center gap-1 min-h-8 px-2 rounded-md text-xs text-dark-text hover:text-light-text hover:bg-background disabled:opacity-40 disabled:pointer-events-none';

  return (
    <div
      ref={wrapperRef}
      className="relative flex flex-col h-full min-h-0 w-full bg-background"
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      role="application"
    >
      {mode !== 'view' && (
        <div className="shrink-0 flex items-center gap-0.5 px-1.5 py-1 border-b border-border bg-surface overflow-x-auto scrollbar-none">
          {free &&
            SHAPE_INFO.map((s) => (
              <button
                key={s.shape}
                type="button"
                onClick={() => addShape(s.shape)}
                className={`${btn} shrink-0`}
                title={`Add ${s.name}: ${s.hint}${selNode ? ' (added after the selected box)' : ''}`}
                data-shape={s.shape}
              >
                <ShapeIcon shape={s.shape} />
                <span className="hidden md:inline">{s.name}</span>
              </button>
            ))}
          {free && <span className="mx-1 h-5 w-px bg-border shrink-0" />}
          <button type="button" onClick={undo} disabled={!past.current.length} className={`${btn} shrink-0`} title="Undo (Ctrl+Z)">
            <Undo2 size={14} />
          </button>
          <button type="button" onClick={redo} disabled={!future.current.length} className={`${btn} shrink-0`} title="Redo (Ctrl+Y)">
            <Redo2 size={14} />
          </button>
          {free && (
            <button type="button" onClick={tidy} className={`${btn} shrink-0`} title="Tidy: lay the flowchart out top to bottom">
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Tidy</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => rf.fitView({ padding: 0.2, duration: 250 })}
            className={`${btn} shrink-0`}
            title="Fit to screen"
          >
            <Maximize size={14} />
          </button>
          {exportName && (
            <button type="button" onClick={() => void exportPng()} className={`${btn} shrink-0`} title="Download as PNG">
              <Download size={14} />
              <span className="hidden sm:inline">PNG</span>
            </button>
          )}
        </div>
      )}

      <div className="relative flex-1 min-h-0" style={flowchartCanvasTheme}>
        <ReactFlow<Node<ShapeData>, Edge>
          nodes={nodes}
          edges={edges}
          nodeTypes={flowchartNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={() => setSelection(null)}
          onNodeDoubleClick={() => setFocusLabelNonce((n) => n + 1)}
          connectionMode={ConnectionMode.Loose}
          nodesConnectable={free}
          nodesDraggable={mode !== 'view'}
          elementsSelectable={mode !== 'view'}
          deleteKeyCode={free ? ['Backspace', 'Delete'] : null}
          multiSelectionKeyCode={null}
          selectionKeyCode={null}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.1 }}
          minZoom={0.15}
          maxZoom={2}
          snapToGrid
          snapGrid={[10, 10]}
          proOptions={{ hideAttribution: true }}
          connectionLineStyle={{ stroke: 'var(--color-info)', strokeWidth: 2 }}
        >
          <Background color="var(--color-border)" gap={20} size={1} />
          <Controls showInteractive={false} showFitView={mode === 'view'} />
          {mode !== 'view' && (
          <MiniMap
            pannable
            zoomable
            className="!hidden md:!block"
            nodeColor={(n) => MINIMAP_COLORS[(n.type ?? 'process') as NodeShape] ?? 'var(--color-dark-text)'}
            maskColor="rgba(0,0,0,0.55)"
            style={{ background: 'var(--color-surface)' }}
          />
          )}
        </ReactFlow>
      </div>

      {mode !== 'view' && (
        <div className="shrink-0 border-t border-border bg-surface px-2.5 py-2 text-xs min-h-[3.25rem]">
          {selNode ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-light-text">{selInfo?.name}</span>
                <span className="truncate text-dark-text/70">{selInfo?.hint}</span>
                <div className="ml-auto flex items-center gap-0.5 shrink-0">
                  {free && selNode.shape === 'decision' && (
                    <button type="button" onClick={() => swapBranches(selNode.id)} className={btn} title="Swap the Yes and No arrows">
                      <ArrowLeftRight size={13} />
                      <span className="hidden sm:inline">Swap Yes/No</span>
                    </button>
                  )}
                  {free && !selNode.locked && (
                    <button
                      type="button"
                      onClick={() => deleteNodes(new Set([selNode.id]))}
                      className={`${btn} hover:!text-error`}
                      title="Delete this box"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
              {labelEditable ? (
                <textarea
                  ref={labelRef}
                  value={selNode.label}
                  rows={Math.min(Math.max(selNode.label.split('\n').length, 1), 4)}
                  onFocus={remember}
                  onChange={(e) => setLabel(selNode.id, e.target.value)}
                  placeholder={
                    selNode.shape === 'decision'
                      ? 'Condition, e.g. Mark >= 50'
                      : selNode.shape === 'io'
                        ? 'INPUT Name   or   OUTPUT "Hello ", Name'
                        : selNode.shape === 'terminator'
                          ? 'START or STOP'
                          : 'e.g. Total ← Total + Mark'
                  }
                  aria-label="Box text"
                  spellCheck={false}
                  className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-light-text outline-none focus:border-primary"
                />
              ) : (
                <p className="font-mono text-light-text/80 whitespace-pre-wrap break-words">{selNode.label || '—'}</p>
              )}
              {selIssue && <p className="text-error whitespace-pre-wrap break-words">{selIssue.message}</p>}
            </div>
          ) : selEdge ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-semibold text-light-text mr-1">Arrow</span>
                {free && nodeById.get(selEdge.source)?.shape === 'decision' && (
                  <>
                    {['Yes', 'No'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setEdgeLabel(selEdge.id, l)}
                        className={`${btn} border ${selEdge.label === l ? 'border-primary text-primary' : 'border-border'}`}
                      >
                        {l}
                      </button>
                    ))}
                    <input
                      defaultValue={selEdge.label && !/^(yes|no)$/i.test(selEdge.label) ? selEdge.label : ''}
                      key={selEdge.id}
                      onBlur={(e) => e.target.value.trim() && setEdgeLabel(selEdge.id, e.target.value.trim())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                      }}
                      placeholder="CASE value"
                      aria-label="Arrow label"
                      className="w-28 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-light-text outline-none focus:border-primary"
                    />
                  </>
                )}
                {free && (
                  <button
                    type="button"
                    onClick={() => deleteEdges(new Set([selEdge.id]))}
                    className={`${btn} ml-auto hover:!text-error`}
                    title="Delete this arrow"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              {selIssue && <p className="text-error whitespace-pre-wrap break-words">{selIssue.message}</p>}
            </div>
          ) : (
            <p className="text-dark-text/70 leading-relaxed">
              {free
                ? 'Pick a shape to add it after the selected box. Drag from a dot on a box to draw an arrow. Click a box to type in it.'
                : 'Click a dashed box to fill it in.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PNG export ──────────────────────────────────────────────────────────────

const EXPORT_PAD = 48; // room around the drawing, so loop-back arrows and labels aren't cut off
const EXPORT_MARGIN = 28; // between the frame and the image edge
const EXPORT_FOOTER = 36;
const EXPORT_MAX = { width: 2400, height: 3200 };
const EXPORT_RATIO = 2;

/**
 * The drawing at its natural size (shrunk only if huge), framed on the app's
 * surface colour with a rounded accent border and a small credit line.
 */
async function renderFlowchartPng(
  wrapper: HTMLElement,
  viewport: HTMLElement,
  bounds: { x: number; y: number; width: number; height: number },
): Promise<Blob | null> {
  const css = getComputedStyle(wrapper);
  const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const background = token('--color-background', '#282C34');
  const surface = token('--color-surface', '#21252B');
  const accent = token('--color-primary', '#61AFEF');
  const muted = token('--color-dark-text', '#828997');

  const scale = Math.min(
    1,
    EXPORT_MAX.width / (bounds.width + EXPORT_PAD * 2),
    EXPORT_MAX.height / (bounds.height + EXPORT_PAD * 2),
  );
  const width = Math.round((bounds.width + EXPORT_PAD * 2) * scale);
  const height = Math.round((bounds.height + EXPORT_PAD * 2) * scale);
  const drawing = await toCanvas(viewport, {
    backgroundColor: background,
    width,
    height,
    pixelRatio: EXPORT_RATIO,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${(EXPORT_PAD - bounds.x) * scale}px, ${(EXPORT_PAD - bounds.y) * scale}px) scale(${scale})`,
    },
    filter: (el) => !(el instanceof HTMLElement && el.classList.contains('react-flow__handle')),
  });

  const outW = width + EXPORT_MARGIN * 2;
  const outH = height + EXPORT_MARGIN + EXPORT_FOOTER;
  const out = document.createElement('canvas');
  out.width = outW * EXPORT_RATIO;
  out.height = outH * EXPORT_RATIO;
  const ctx = out.getContext('2d');
  if (!ctx) return null;
  ctx.scale(EXPORT_RATIO, EXPORT_RATIO);
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, outW, outH);

  const frame = new Path2D();
  frame.roundRect(EXPORT_MARGIN, EXPORT_MARGIN, width, height, 14);
  ctx.save();
  ctx.clip(frame);
  ctx.drawImage(drawing, EXPORT_MARGIN, EXPORT_MARGIN, width, height);
  ctx.restore();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke(frame);
  ctx.globalAlpha = 1;

  const footerY = EXPORT_MARGIN + height + EXPORT_FOOTER / 2;
  ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = muted;
  ctx.textAlign = 'left';
  ctx.fillText(`${BRAND.shortName} · Flowchart`, EXPORT_MARGIN + 2, footerY);
  ctx.textAlign = 'right';
  ctx.fillText(new URL(SITE_URL).host, EXPORT_MARGIN + width - 2, footerY);

  return new Promise((resolve) => out.toBlob(resolve, 'image/png'));
}

export default function FlowchartBuilder(props: FlowchartBuilderProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvas {...props} />
    </ReactFlowProvider>
  );
}
