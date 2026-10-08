'use client';

// Run and debug a flowchart through the ordinary interpreter: the doc is turned
// into pseudocode, `useInterpreter` runs that, and lines are mapped back to boxes
// (the debugger's current line → the active box, a runtime error → a red box).

import { useCallback, useMemo } from 'react';
import { useInterpreter } from '@/modules/interpreter/useInterpreter';
import type { FeatureContext } from '@/modules/interpreter/analytics';
import { captureEvent } from '@/modules/interpreter/analytics';
import type { FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import {
  flowchartToPseudocode,
  type FlowchartIssue,
  type FlowchartProgram,
} from '@/modules/interpreter/converters/flowchartToPseudocode';

/** The parts of a doc that change the program (not positions or arrow sides). */
function structureKey(doc: FlowchartDoc): string {
  return JSON.stringify({
    nodes: doc.nodes.map((n) => ({ id: n.id, shape: n.shape, label: n.label })),
    edges: doc.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label })),
  });
}

/** flowchartToPseudocode, recomputed only when the drawing (not the layout) changes. */
export function useFlowchartProgram(doc: FlowchartDoc): FlowchartProgram {
  const key = structureKey(doc);
  const structural = useMemo(() => ({ version: 1, ...JSON.parse(key) }) as FlowchartDoc, [key]);
  return useMemo(() => flowchartToPseudocode(structural), [structural]);
}

export function useFlowchartRun(
  doc: FlowchartDoc,
  context: { feature: FeatureContext; questionId?: string; surface: string },
) {
  const program = useFlowchartProgram(doc);
  const interp = useInterpreter({ feature: context.feature, questionId: context.questionId });
  const { run, debugRun, debugLine, isStepping, errorInfo } = interp;

  const nodeAt = useCallback(
    (line: number | null | undefined) => (line ? (program.lineToNode[line - 1] ?? null) : null),
    [program.lineToNode],
  );

  const activeNodeId = isStepping ? nodeAt(debugLine) : null;

  /** Drawing problems plus the last run's error, pinned to its box. */
  const issues: FlowchartIssue[] = useMemo(() => {
    if (program.errors.length) return program.errors;
    if (errorInfo) {
      const nodeId = nodeAt(errorInfo.line) ?? undefined;
      return [{ nodeId, message: errorInfo.message.split('\n')[0], category: errorInfo.category }];
    }
    return [];
  }, [program.errors, errorInfo, nodeAt]);

  const start = useCallback(
    (debug: boolean) => {
      captureEvent('flowchart_run', {
        surface: context.surface,
        debug,
        node_count: doc.nodes.length,
        outcome: program.errors.length ? 'drawing_error' : 'started',
        error_category: program.errors[0]?.category ?? null,
      });
      if (program.errors.length) return false;
      void (debug ? debugRun(program.code) : run(program.code));
      return true;
    },
    [context.surface, doc.nodes.length, program, run, debugRun],
  );

  return {
    ...interp,
    program,
    issues,
    activeNodeId,
    /** Returns false (and runs nothing) when the drawing has problems. */
    runFlowchart: useCallback(() => start(false), [start]),
    debugFlowchart: useCallback(() => start(true), [start]),
  };
}
