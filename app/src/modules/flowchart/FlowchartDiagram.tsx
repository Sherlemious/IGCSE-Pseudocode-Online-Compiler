'use client';

// A read-only flowchart (question diagrams, model answers). React Flow loads
// only when one is on the page.

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { parseFlowchartDoc, type FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import { flowchartFromCode } from './importCode';

const FlowchartBuilder = dynamic(() => import('./FlowchartBuilder'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface" />,
});

const noop = () => {};

type Props = {
  /** A FlowchartDoc (validated here), or pseudocode to draw. */
  doc?: unknown;
  code?: string;
  className?: string;
  ariaLabel?: string;
};

export default function FlowchartDiagram({ doc, code, className = 'h-80', ariaLabel = 'Flowchart' }: Props) {
  const parsed: FlowchartDoc | null = useMemo(() => {
    if (doc != null) return parseFlowchartDoc(doc);
    return null;
  }, [doc]);
  const fromCode = useFlowchartFromCode(code);
  const shown = parsed ?? fromCode;
  if (!shown) return null;
  return (
    <div className={`${className} rounded-lg border border-border overflow-hidden`}>
      <FlowchartBuilder doc={shown} onChange={noop} mode="view" surface="diagram" ariaLabel={ariaLabel} />
    </div>
  );
}

function useFlowchartFromCode(code: string | undefined): FlowchartDoc | null {
  return useMemo(() => (code?.trim() ? flowchartFromCode(code).doc : null), [code]);
}
