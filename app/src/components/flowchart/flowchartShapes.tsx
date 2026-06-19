// Shared visual styling for IGCSE flowchart symbols, used by both the read-only
// generated view (compiler/FlowchartView) and the interactive editor. Keeping the
// shape geometry in one place means the two always look identical.

import React, { type CSSProperties, type ReactNode } from 'react';
import type { NodeShape } from '../../interpreter/converters/flowchartConverter';

export const DIAMOND = 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';
export const PARALLELOGRAM = 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)';

export const labelStyle: CSSProperties = {
  fontFamily: 'var(--editor-font-family)',
  fontSize: 12,
  lineHeight: 1.2,
  color: 'var(--color-light-text)',
  textAlign: 'center',
  wordBreak: 'break-word',
  overflow: 'hidden',
};

const terminatorLabelStyle: CSSProperties = {
  ...labelStyle,
  color: 'var(--color-background)',
  fontWeight: 700,
};

/** Minimap dot colour per shape — also used as the accent for clipped shapes. */
export const SHAPE_ACCENT: Record<NodeShape, string> = {
  terminator: 'var(--color-primary)',
  decision: 'var(--color-warning)',
  io: 'var(--color-info)',
  subroutine: 'var(--color-primary)',
  process: 'var(--color-dark-text)',
};

function rectStyle(shape: NodeShape, w: number, h: number): CSSProperties {
  const base: CSSProperties = {
    width: w,
    height: h,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 14px',
    boxSizing: 'border-box',
  };
  if (shape === 'terminator') {
    return { ...base, background: 'var(--color-primary)', borderRadius: 9999 };
  }
  if (shape === 'subroutine') {
    return {
      ...base,
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-primary)',
      borderBottom: '1px solid var(--color-primary)',
      borderLeft: '4px double var(--color-primary)',
      borderRight: '4px double var(--color-primary)',
      borderRadius: 3,
    };
  }
  // process (default)
  return { ...base, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6 };
}

/**
 * The visual body of a node (no React Flow handles). `slot` overrides the centered
 * label — the editor passes an <input> here while editing.
 */
export function ShapeBody({
  shape,
  w,
  h,
  label,
  slot,
}: {
  shape: NodeShape;
  w: number;
  h: number;
  label: string;
  slot?: ReactNode;
}): React.JSX.Element {
  const content = slot ?? (
    <span style={shape === 'terminator' ? terminatorLabelStyle : labelStyle}>{label}</span>
  );

  if (shape === 'decision' || shape === 'io') {
    const clip = shape === 'decision' ? DIAMOND : PARALLELOGRAM;
    const padX = shape === 'decision' ? 28 : 24;
    return (
      <div style={{ position: 'relative', width: w, height: h, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
        <div style={{ position: 'absolute', inset: 0, background: SHAPE_ACCENT[shape], clipPath: clip }} />
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
          {content}
        </div>
      </div>
    );
  }

  return <div style={rectStyle(shape, w, h)}>{content}</div>;
}
