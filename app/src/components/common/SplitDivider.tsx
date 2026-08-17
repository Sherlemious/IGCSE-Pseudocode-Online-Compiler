'use client';

import React, { useState, useCallback } from 'react';

interface SplitDividerProps {
  /**
   * Resize axis: 'col' drags left/right (vertical seam), 'row' drags up/down
   * (horizontal seam). 'responsive' is row below lg and col at lg+, matching
   * the compiler's stacked→side-by-side layout switch.
   */
  orientation: 'col' | 'row' | 'responsive';
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
  onDoubleClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel: string;
  /** Current split position (0–100) for screen readers. */
  ariaValueNow?: number;
}

/**
 * The seam between two resizable panes. Visually a hairline with a centred
 * grip pill; the whole 8px strip (plus a little slop) is draggable. Stays
 * highlighted for the duration of a drag, not just while hovered.
 */
const SplitDivider: React.FC<SplitDividerProps> = ({
  orientation,
  onDragStart,
  onDoubleClick,
  onKeyDown,
  ariaLabel,
  ariaValueNow,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setDragging(true);
      const clear = () => {
        setDragging(false);
        document.removeEventListener('mouseup', clear);
        document.removeEventListener('touchend', clear);
        document.removeEventListener('touchcancel', clear);
      };
      document.addEventListener('mouseup', clear);
      document.addEventListener('touchend', clear);
      // Collapsing a pane can unmount this divider mid-drag, which fires
      // touchcancel rather than touchend — clear on both so state doesn't stick.
      document.addEventListener('touchcancel', clear);
      onDragStart(e);
    },
    [onDragStart]
  );

  const rootAxis = {
    col: 'w-2 cursor-col-resize',
    row: 'h-2 cursor-row-resize',
    responsive: 'h-2 cursor-row-resize lg:h-auto lg:w-2 lg:cursor-col-resize',
  }[orientation];

  const lineColor = dragging ? 'bg-primary' : 'bg-border group-hover:bg-primary/60';
  const gripColor = dragging ? 'bg-primary' : 'bg-dark-text/40 group-hover:bg-primary/80';

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-orientation={orientation === 'row' ? 'horizontal' : 'vertical'}
      aria-valuenow={ariaValueNow}
      data-dragging={dragging}
      className={`group relative shrink-0 select-none touch-none ${rootAxis}
        after:absolute after:-inset-1 after:content-['']`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    >
      {/* Hairline seam */}
      {orientation !== 'col' && (
        <div
          className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors ${lineColor}
            ${orientation === 'responsive' ? 'lg:hidden' : ''}`}
        />
      )}
      {orientation !== 'row' && (
        <div
          className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors ${lineColor}
            ${orientation === 'responsive' ? 'hidden lg:block' : ''}`}
        />
      )}

      {/* Grip pill */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors z-10 ${gripColor}
          ${orientation === 'col' ? 'w-[3px] h-9' : ''}
          ${orientation === 'row' ? 'h-[3px] w-9' : ''}
          ${orientation === 'responsive' ? 'h-[3px] w-9 lg:w-[3px] lg:h-9' : ''}`}
      />
    </div>
  );
};

export default SplitDivider;
