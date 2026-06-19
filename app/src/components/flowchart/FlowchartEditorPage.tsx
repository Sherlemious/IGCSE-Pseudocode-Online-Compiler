'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Edge } from '@xyflow/react';
import {
  Play,
  Square,
  Bug,
  SkipForward,
  FastForward,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Share2,
} from 'lucide-react';
import FlowchartEditor, {
  type EditorNode,
  seedGraph,
  toGraph,
  defaultEdgeOptions,
} from './FlowchartEditor';
import OutputDisplay, { type OutputTab } from '../compiler/outputDisplay';
import highlightPseudocode from '../common/highlightPseudocode';
import { useInterpreter } from '../../interpreter/useInterpreter';
import { flowchartToPseudocode, type FlowToCodeResult } from '../../interpreter/converters/flowchartToPseudocode';
import { FLOWCHART_AUTOSAVE_KEY, SPLIT_FLOWCHART_KEY, AUTOSAVE_DELAY, loadSplitPercent } from '../../utils/constants';

interface PackedGraph {
  nodes: EditorNode[];
  edges: Edge[];
}

// Keep only the fields worth persisting (drop React Flow's transient render state).
function packGraph(nodes: EditorNode[], edges: Edge[]): PackedGraph {
  return {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label })),
  };
}

function loadInitialGraph(): PackedGraph {
  try {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('fc');
    if (shared) {
      window.history.replaceState({}, '', window.location.pathname);
      return restyle(JSON.parse(decodeURIComponent(atob(shared))));
    }
  } catch { /* ignore bad share link */ }
  try {
    const saved = localStorage.getItem(FLOWCHART_AUTOSAVE_KEY);
    if (saved) return restyle(JSON.parse(saved));
  } catch { /* ignore */ }
  return seedGraph();
}

// Re-apply edge styling to a deserialized graph (transient style isn't persisted).
function restyle(g: PackedGraph): PackedGraph {
  return { nodes: g.nodes, edges: g.edges.map((e) => ({ ...defaultEdgeOptions, ...e })) };
}

const EMPTY_CONVERSION: FlowToCodeResult = { code: '', errors: [], lineToNode: {} };

const FlowchartEditorPage: React.FC = () => {
  // Initial graph is read once (client-only) to avoid hydration mismatch.
  const [initial, setInitial] = useState<PackedGraph | null>(null);
  useEffect(() => { setInitial(loadInitialGraph()); }, []);

  const graphRef = useRef<{ nodes: EditorNode[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [outputTab, setOutputTab] = useState<OutputTab>('terminal');
  const [showCode, setShowCode] = useState(false);
  const [generated, setGenerated] = useState<FlowToCodeResult>(EMPTY_CONVERSION);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const interp = useInterpreter();

  const onGraphChange = useCallback((nodes: EditorNode[], edges: Edge[]) => {
    graphRef.current = { nodes, edges };
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(FLOWCHART_AUTOSAVE_KEY, JSON.stringify(packGraph(nodes, edges))); } catch { /* ignore */ }
    }, AUTOSAVE_DELAY);
  }, []);
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  /** Convert the current canvas; on success returns the result, else toasts + highlights the bad node. */
  const convertNow = useCallback((): FlowToCodeResult => {
    const { nodes, edges } = graphRef.current;
    const g = toGraph(nodes, edges);
    const result = flowchartToPseudocode(g.nodes, g.edges);
    setGenerated(result);
    if (result.errors.length > 0) {
      const err = result.errors[0];
      toast.error(err.message);
    }
    return result;
  }, []);

  const handleRun = useCallback((debug: boolean) => {
    const result = convertNow();
    if (result.errors.length > 0) return;
    if (!result.code.trim()) {
      toast.info('Draw a flowchart first — connect a START terminator to some steps.');
      return;
    }
    setOutputTab('terminal');
    if (debug) interp.debugRun(result.code);
    else interp.run(result.code);
  }, [convertNow, interp]);

  const toggleCode = useCallback(() => setShowCode((prev) => !prev), []);
  // Refresh the generated pseudocode whenever the panel is open.
  useEffect(() => { if (showCode) convertNow(); }, [showCode, convertNow]);

  // Pull the student back to the terminal when the program asks for input.
  const tabRef = useRef(outputTab);
  useEffect(() => { tabRef.current = outputTab; }, [outputTab]);
  useEffect(() => {
    if (interp.waitingForInput && tabRef.current !== 'terminal') setOutputTab('terminal');
  }, [interp.waitingForInput]);

  // Highlight the node behind the currently-executing / failing line.
  const activeNodeId = useMemo(() => {
    const line = interp.errorLine ?? interp.debugLine;
    return line != null ? generated.lineToNode[line] ?? null : null;
  }, [interp.errorLine, interp.debugLine, generated]);

  const openInCompiler = useCallback(() => {
    const result = generated.code ? generated : convertNow();
    if (!result.code.trim() || result.errors.length > 0) return;
    const url = `/?code=${btoa(encodeURIComponent(result.code))}`;
    window.open(url, '_blank');
  }, [generated, convertNow]);

  const copyCode = useCallback(() => {
    const result = generated.code ? generated : convertNow();
    if (!result.code) return;
    navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [generated, convertNow]);

  const handleShare = useCallback(() => {
    const { nodes, edges } = graphRef.current;
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(packGraph(nodes, edges))));
      const url = `${window.location.origin}/flowchart?fc=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      });
    } catch { toast.error('Could not create a share link.'); }
  }, []);

  // ── Resizable split (persisted) ──────────────────────────────────────────────
  const [splitPercent, setSplitPercent] = useState(58);
  const splitPercentRef = useRef(58);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  useEffect(() => {
    const v = loadSplitPercent(SPLIT_FLOWCHART_KEY, 58, 30, 75);
    splitPercentRef.current = v;
    setSplitPercent(v);
  }, []);
  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = 'touches' in ev ? ev.touches[0] : ev;
      const horizontal = window.innerWidth >= 1024;
      const pct = horizontal
        ? ((pos.clientX - rect.left) / rect.width) * 100
        : ((pos.clientY - rect.top) / rect.height) * 100;
      const clamped = Math.max(30, Math.min(75, pct));
      splitPercentRef.current = clamped;
      setSplitPercent(clamped);
    };
    const onEnd = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.body.style.userSelect = '';
      try { localStorage.setItem(SPLIT_FLOWCHART_KEY, String(splitPercentRef.current)); } catch { /* ignore */ }
    };
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
  }, []);

  const btn = 'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background text-light-text overflow-hidden">
      {/* Toolbar */}
      <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-0.5">
          {interp.isStepping && (
            <>
              <button onClick={interp.step} className={`${btn} text-info hover:bg-info/10`} title="Step">
                <SkipForward className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Step</span>
              </button>
              <button onClick={interp.continueExecution} className={`${btn} text-success hover:bg-success/10`} title="Continue">
                <FastForward className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Continue</span>
              </button>
            </>
          )}
          {interp.isRunning ? (
            <button onClick={interp.stop} className={`${btn} text-error hover:bg-error/10`} title="Stop">
              <Square className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <>
              <button onClick={() => handleRun(true)} className={`${btn} text-warning hover:bg-warning/10`} title="Debug (step through)">
                <Bug className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Debug</span>
              </button>
              <button onClick={() => handleRun(false)} className={`${btn} text-success hover:bg-success/10`} title="Run flowchart">
                <Play className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Run</span>
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={toggleCode} className={`${btn} ${showCode ? 'text-primary bg-primary/10' : 'text-dark-text hover:text-light-text hover:bg-background/50'}`} title="View generated pseudocode">
            <Code2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Pseudocode</span>
          </button>
          <button onClick={handleShare} className={`${btn} text-dark-text hover:text-light-text hover:bg-background/50`} title="Copy share link">
            {shareStatus === 'copied' ? <Check className="h-3.5 w-3.5 text-success" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div ref={containerRef} className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Editor + generated-code drawer */}
        <div className="min-h-0 flex flex-col overflow-hidden" style={{ flex: `0 0 ${splitPercent}%` }}>
          {initial && <FlowchartEditor initial={initial} onChange={onGraphChange} activeNodeId={activeNodeId} />}
          {showCode && (
            <div className="h-44 shrink-0 border-t border-border bg-surface/40 flex flex-col">
              <div className="h-8 shrink-0 flex items-center justify-between px-3 border-b border-border">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-dark-text/60">Generated Pseudocode</span>
                <div className="flex items-center gap-1">
                  <button onClick={copyCode} className="opacity-60 hover:opacity-100 p-1 rounded hover:bg-background" title="Copy">
                    {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={openInCompiler} className="opacity-60 hover:opacity-100 p-1 rounded hover:bg-background" title="Open in the main compiler">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-auto p-3 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
                {generated.errors.length > 0 ? (
                  <div className="text-xs text-error/90">{generated.errors[0].message}</div>
                ) : generated.code ? (
                  <pre className="text-xs leading-relaxed" style={{ fontFamily: 'var(--editor-font-family)' }}>
                    {highlightPseudocode(generated.code)}
                  </pre>
                ) : (
                  <div className="text-xs text-dark-text/50 italic">Draw a flowchart to see the pseudocode.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drag handle */}
        <div
          className="shrink-0 bg-border hover:bg-primary transition-colors lg:w-1 lg:cursor-col-resize lg:h-auto w-auto h-1 cursor-row-resize"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        />

        {/* Output */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <OutputDisplay
            entries={interp.entries}
            isRunning={interp.isRunning}
            waitingForInput={interp.waitingForInput}
            onInputSubmit={interp.provideInput}
            onClear={interp.clearEntries}
            isStepping={interp.isStepping}
            debugVariables={interp.debugVariables}
            traceRows={interp.traceRows}
            maxTraceRows={interp.maxTraceRows}
            activeTab={outputTab}
            onTabChange={setOutputTab}
            tabs={['terminal', 'trace']}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditorPage;
