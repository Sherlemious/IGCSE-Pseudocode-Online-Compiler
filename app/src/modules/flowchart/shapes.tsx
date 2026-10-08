'use client';

// IGCSE flowchart symbols as React Flow nodes, themed with the app tokens.
// One set of components serves the read-only diagram (compiler FlowchartView,
// question diagrams) and the editable builder: `data.editable` turns on
// connectable handles on all four sides, `data.status` rings an error or the
// box the debugger is on, and `data.blank` marks a box the student fills in.

import React, { type CSSProperties } from 'react';
import { Handle, Position, type NodeProps, type NodeTypes } from '@xyflow/react';
import type { NodeShape } from '@/modules/interpreter/converters/flowchartConverter';

export interface ShapeData extends Record<string, unknown> {
  label: string;
  w: number;
  h: number;
  /** Builder: handles on every side can start or end an arrow. */
  editable?: boolean;
  /** Ring for a problem on this box, or the box the debugger is paused on. */
  status?: 'error' | 'active' | null;
  /** Template blank the student fills in. */
  blank?: boolean;
}

const hiddenHandle: CSSProperties = { width: 6, height: 6, opacity: 0, border: 'none' };
const editHandle: CSSProperties = {
  zIndex: 2,
  width: 9,
  height: 9,
  background: 'var(--color-surface)',
  border: '1.5px solid var(--color-primary)',
};

const labelStyle: CSSProperties = {
  fontFamily: 'var(--editor-font-family)',
  fontSize: 12,
  lineHeight: 1.25,
  color: 'var(--color-light-text)',
  textAlign: 'center',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
};

function Handles({ editable }: { editable?: boolean }) {
  if (!editable) {
    return (
      <>
        <Handle type="target" position={Position.Top} isConnectable={false} style={hiddenHandle} />
        <Handle type="source" position={Position.Bottom} isConnectable={false} style={hiddenHandle} />
      </>
    );
  }
  // Builder runs in loose connection mode, so any handle can start or end an arrow.
  // Edges without a handle id fall back to the first source (bottom) and target (top).
  return (
    <>
      <Handle id="t" type="target" position={Position.Top} style={editHandle} className="flowchart-handle" />
      <Handle id="b" type="source" position={Position.Bottom} style={editHandle} className="flowchart-handle" />
      <Handle id="r" type="source" position={Position.Right} style={editHandle} className="flowchart-handle" />
      <Handle id="l" type="source" position={Position.Left} style={editHandle} className="flowchart-handle" />
    </>
  );
}

function ringStyle(d: ShapeData, selected: boolean): CSSProperties {
  if (d.status === 'error') return { boxShadow: '0 0 0 2px var(--color-error)' };
  if (d.status === 'active') return { boxShadow: '0 0 0 3px var(--color-primary), 0 0 14px var(--color-primary)' };
  if (selected) return { boxShadow: '0 0 0 2px var(--color-info)' };
  return {};
}

/** Clip-path shapes can't show a box-shadow ring, so the ring is a drop-shadow filter. */
function ringFilter(d: ShapeData, selected: boolean): string {
  const base = 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))';
  if (d.status === 'error') return `${base} drop-shadow(0 0 2px var(--color-error)) drop-shadow(0 0 2px var(--color-error))`;
  if (d.status === 'active') return `${base} drop-shadow(0 0 6px var(--color-primary)) drop-shadow(0 0 2px var(--color-primary))`;
  if (selected) return `${base} drop-shadow(0 0 2px var(--color-info)) drop-shadow(0 0 1px var(--color-info))`;
  return base;
}

function Label({ d, extra }: { d: ShapeData; extra?: CSSProperties }) {
  if (d.blank && !d.label.trim()) {
    return <span style={{ ...labelStyle, ...extra, opacity: 0.55, fontStyle: 'italic' }}>Fill in</span>;
  }
  return <span style={{ ...labelStyle, ...extra }}>{d.label}</span>;
}

/** Rectangular shapes (process / terminator / subroutine) — a single bordered box. */
function boxNode(extra: CSSProperties, labelExtra: CSSProperties = {}) {
  return function BoxNode({ data, selected }: NodeProps) {
    const d = data as ShapeData;
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
          ...(d.blank ? { border: '1.5px dashed var(--color-warning)' } : {}),
          ...ringStyle(d, !!selected),
        }}
      >
        <Handles editable={d.editable} />
        <Label d={d} extra={labelExtra} />
      </div>
    );
  };
}

/** Clipped shapes (decision diamond / I/O parallelogram) — accent rim + surface fill. */
function clippedNode(clip: string, accent: string, padX: number) {
  return function ClippedNode({ data, selected }: NodeProps) {
    const d = data as ShapeData;
    return (
      <div style={{ position: 'relative', width: d.w, height: d.h, filter: ringFilter(d, !!selected) }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: d.blank ? 'var(--color-warning)' : accent,
            clipPath: clip,
          }}
        />
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
          <Label d={d} />
        </div>
        {/* After the clipped layers so the dots sit on top and catch the pointer. */}
        <Handles editable={d.editable} />
      </div>
    );
  };
}

const DIAMOND = 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';
const PARALLELOGRAM = 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)';

export const flowchartNodeTypes: NodeTypes = {
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

export const MINIMAP_COLORS: Record<NodeShape, string> = {
  terminator: 'var(--color-primary)',
  decision: 'var(--color-warning)',
  io: 'var(--color-info)',
  subroutine: 'var(--color-primary)',
  process: 'var(--color-dark-text)',
};

/** React Flow CSS-variable overrides so its chrome matches the theme. */
export const flowchartCanvasTheme = {
  height: '100%',
  width: '100%',
  '--xy-edge-stroke': 'var(--color-primary)',
  '--xy-controls-button-background-color': 'var(--color-surface)',
  '--xy-controls-button-background-color-hover': 'var(--color-primary)',
  '--xy-controls-button-color': 'var(--color-light-text)',
  '--xy-controls-button-color-hover': 'var(--color-background)',
  '--xy-controls-button-border-color': 'var(--color-border)',
} as unknown as CSSProperties;

/** Palette metadata, in the order the builder lists the shapes. */
export const SHAPE_INFO: { shape: NodeShape; name: string; hint: string; defaultLabel: string }[] = [
  { shape: 'terminator', name: 'Start / Stop', hint: 'Where the flowchart begins and ends', defaultLabel: 'STOP' },
  { shape: 'process', name: 'Process', hint: 'A calculation or assignment, e.g. Total ← Total + Mark', defaultLabel: '' },
  { shape: 'io', name: 'Input / Output', hint: 'INPUT or OUTPUT', defaultLabel: 'OUTPUT ' },
  { shape: 'decision', name: 'Decision', hint: 'A Yes/No question, e.g. Mark > 50?', defaultLabel: '' },
  { shape: 'subroutine', name: 'Subroutine', hint: 'CALL a procedure', defaultLabel: 'CALL ' },
];
