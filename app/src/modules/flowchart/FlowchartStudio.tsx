'use client';

// The /flowchart page: draw a flowchart, run or step through it, and see the
// pseudocode it stands for.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bug,
  Check,
  Code2,
  Copy,
  ExternalLink,
  FastForward,
  FilePlus2,
  FileUp,
  Play,
  SkipForward,
  Square,
  Terminal,
} from 'lucide-react';
import { captureEvent } from '@/modules/interpreter/analytics';
import { parseFlowchartDoc, starterFlowchart, type FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import { editorCodeHref } from '@/modules/compiler/editorShare';
import { AUTOSAVE_DELAY } from '@/shared/lib/persist';
import Modal, { ConfirmDialog } from '@/shared/ui/Modal';
import FlowchartBuilder from './FlowchartBuilder';
import FlowchartTerminal from './FlowchartTerminal';
import { FLOWCHART_EXAMPLES } from './examples';
import { FLOWCHART_IMPORT_KEY } from './constants';
import { flowchartFromCode } from './importCode';
import { useFlowchartRun } from './useFlowchartRun';

const STORAGE_KEY = 'flowchart_builder_doc';

type Tab = 'code' | 'terminal' | 'problems';

function readSaved(): FlowchartDoc | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseFlowchartDoc(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export default function FlowchartStudio() {
  const [doc, setDoc] = useState<FlowchartDoc>(starterFlowchart);
  const [loaded, setLoaded] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [tab, setTab] = useState<Tab>('code');
  const [focusRequest, setFocusRequest] = useState<{ nodeId: string; nonce: number } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // Drawing problems ring their boxes only once the student has tried to run:
  // a half-drawn flowchart shouldn't be covered in red while it's being drawn.
  const [checked, setChecked] = useState(false);

  const runner = useFlowchartRun(doc, { feature: 'flowchart', surface: 'builder' });
  const {
    program,
    issues,
    activeNodeId,
    entries,
    isRunning,
    isStepping,
    waitingForInput,
    debugLine,
    provideInput,
    stop,
    step,
    continueExecution,
    dismissErrorInfo,
    runFlowchart,
    debugFlowchart,
  } = runner;

  /** Replace the whole drawing (example, import, new): fresh canvas and undo history. */
  const load = useCallback((next: FlowchartDoc) => {
    setDoc(next);
    setCanvasKey((k) => k + 1);
    setChecked(false);
  }, []);

  // Restore: a hand-off from the playground wins over the autosaved drawing.
  // Once only — the hand-off is consumed, so a second (strict-mode) pass would
  // otherwise replace it with the autosave.
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    let from = 'direct';
    let imported = false;
    try {
      from = new URLSearchParams(window.location.search).get('from') ?? from;
      const code = sessionStorage.getItem(FLOWCHART_IMPORT_KEY);
      if (code) {
        sessionStorage.removeItem(FLOWCHART_IMPORT_KEY);
        const { doc: fromCode } = flowchartFromCode(code);
        if (fromCode) {
          load(fromCode);
          imported = true;
          captureEvent('flowchart_converted', { direction: 'from_code', source: from });
        }
      }
    } catch {
      // storage unavailable — start blank
    }
    const saved = imported ? null : readSaved();
    if (saved) load(saved);
    setLoaded(true);
    captureEvent('flowchart_opened', { from, restored: !!saved, imported });
  }, [load]);

  // Autosave (after the first restore, so a blank canvas never overwrites a saved one).
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      } catch {
        // quota / private mode
      }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(t);
  }, [doc, loaded]);

  // A runtime error belongs to the drawing it came from.
  const lastCode = useRef(program.code);
  useEffect(() => {
    if (lastCode.current !== program.code) {
      lastCode.current = program.code;
      dismissErrorInfo();
    }
  }, [program.code, dismissErrorInfo]);

  const focusFirstIssue = useCallback(() => {
    const first = program.errors.find((i) => i.nodeId);
    if (first?.nodeId) setFocusRequest({ nodeId: first.nodeId, nonce: Date.now() });
  }, [program.errors]);

  const handleRun = useCallback(
    (debug: boolean) => {
      const ok = debug ? debugFlowchart() : runFlowchart();
      setChecked(true);
      if (ok) setTab('terminal');
      else {
        setTab('problems');
        focusFirstIssue();
      }
    },
    [runFlowchart, debugFlowchart, focusFirstIssue],
  );

  const copyCode = useCallback(() => {
    void navigator.clipboard?.writeText(program.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
    captureEvent('flowchart_converted', { direction: 'to_code', action: 'copy' });
  }, [program.code]);

  const codeLines = program.code ? program.code.replace(/\n$/, '').split('\n') : [];
  const btn =
    'inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0';
  const ghost = `${btn} border border-border text-dark-text hover:text-light-text hover:border-primary/40`;

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0 flex items-center gap-1.5 px-2 sm:px-3 py-2 border-b border-border bg-surface overflow-x-auto scrollbar-none">
        {!isRunning ? (
          <>
            <button type="button" onClick={() => handleRun(false)} className={`${btn} bg-primary text-on-primary hover:opacity-90`}>
              <Play size={13} />
              Run
            </button>
            <button type="button" onClick={() => handleRun(true)} className={ghost} title="Step through one box at a time">
              <Bug size={13} />
              <span className="hidden sm:inline">Step through</span>
            </button>
          </>
        ) : (
          <>
            {isStepping && (
              <>
                <button type="button" onClick={step} disabled={waitingForInput} className={`${btn} bg-primary text-on-primary`}>
                  <SkipForward size={13} />
                  Next box
                </button>
                <button type="button" onClick={continueExecution} disabled={waitingForInput} className={ghost}>
                  <FastForward size={13} />
                  <span className="hidden sm:inline">Run to end</span>
                </button>
              </>
            )}
            <button type="button" onClick={stop} className={`${ghost} hover:!text-error`}>
              <Square size={13} />
              Stop
            </button>
          </>
        )}

        <span className="mx-1 h-5 w-px bg-border shrink-0" />

        <select
          aria-label="Start from an example"
          value=""
          onChange={(e) => {
            const ex = FLOWCHART_EXAMPLES.find((x) => x.id === e.target.value);
            if (!ex) return;
            const { doc: next } = flowchartFromCode(ex.code);
            if (next) load(next);
            captureEvent('flowchart_example_loaded', { example: ex.id });
          }}
          className="min-h-9 shrink-0 rounded-md border border-border bg-background px-2 text-xs text-dark-text hover:text-light-text"
        >
          <option value="">Examples…</option>
          {FLOWCHART_EXAMPLES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setImportOpen(true)} className={ghost} title="Draw a flowchart from pseudocode">
          <FileUp size={13} />
          <span className="hidden sm:inline">From code</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (doc.nodes.length > 2) setNewOpen(true);
            else load(starterFlowchart());
          }}
          className={ghost}
          title="New flowchart"
        >
          <FilePlus2 size={13} />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <section className="flex-1 min-h-[55%] lg:min-h-0 min-w-0 flex flex-col" aria-label="Flowchart canvas">
          <FlowchartBuilder
            key={canvasKey}
            doc={doc}
            onChange={setDoc}
            issues={checked || !program.errors.length ? issues : []}
            activeNodeId={activeNodeId}
            focusRequest={focusRequest}
            surface="builder"
            exportName="flowchart"
          />
        </section>

        <aside className="h-[42%] lg:h-auto lg:w-[380px] shrink-0 min-h-0 flex flex-col border-t lg:border-t-0 lg:border-l border-border bg-surface">
          <div className="shrink-0 flex items-center gap-1 px-2 py-1.5 border-b border-border" role="tablist">
            {(
              [
                ['code', 'Pseudocode', <Code2 key="i" size={13} />],
                ['terminal', 'Output', <Terminal key="i" size={13} />],
                ['problems', `Problems${program.errors.length ? ` (${program.errors.length})` : ''}`, <AlertTriangle key="i" size={13} />],
              ] as const
            ).map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  tab === id
                    ? 'bg-background text-light-text font-medium'
                    : id === 'problems' && program.errors.length
                      ? 'text-warning hover:bg-background/50'
                      : 'text-dark-text hover:text-light-text hover:bg-background/50'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
            {tab === 'code' && program.code && !program.errors.length && (
              <div className="ml-auto flex items-center gap-0.5">
                <button type="button" onClick={copyCode} className="p-1.5 rounded text-dark-text hover:text-light-text hover:bg-background" title="Copy pseudocode">
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                </button>
                <a
                  href={editorCodeHref(program.code)}
                  onClick={() => captureEvent('flowchart_converted', { direction: 'to_code', action: 'open_editor' })}
                  className="p-1.5 rounded text-dark-text hover:text-light-text hover:bg-background"
                  title="Open this pseudocode in the editor"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-auto scrollbar-pretty bg-background">
            {tab === 'code' &&
              (program.errors.length ? (
                <p className="p-3 text-xs text-dark-text">
                  The flowchart can&apos;t be written as pseudocode yet.{' '}
                  <button type="button" onClick={() => setTab('problems')} className="text-warning underline">
                    See the problems
                  </button>
                  .
                </p>
              ) : codeLines.length && codeLines.some((l) => l.trim()) ? (
                <pre className="py-2 font-mono text-xs leading-5 text-light-text">
                  {codeLines.map((line, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const id = program.lineToNode[i];
                        if (id) setFocusRequest({ nodeId: id, nonce: Date.now() });
                      }}
                      className={`flex cursor-pointer hover:bg-surface ${isStepping && debugLine === i + 1 ? 'bg-primary/20' : ''}`}
                    >
                      <span className="w-9 shrink-0 pr-2 text-right text-dark-text/50 select-none">{i + 1}</span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  ))}
                </pre>
              ) : (
                <p className="p-3 text-xs text-dark-text/70">
                  Add boxes between START and STOP and the pseudocode appears here as you draw.
                </p>
              ))}
            {tab === 'terminal' && (
              <FlowchartTerminal entries={entries} isRunning={isRunning} waitingForInput={waitingForInput} onInput={provideInput} />
            )}
            {tab === 'problems' &&
              (issues.length ? (
                <ul className="p-2 space-y-1">
                  {issues.map((issue, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        disabled={!issue.nodeId}
                        onClick={() => issue.nodeId && setFocusRequest({ nodeId: issue.nodeId, nonce: Date.now() })}
                        className="w-full text-left flex gap-2 rounded-md px-2 py-1.5 text-xs text-light-text hover:bg-surface disabled:hover:bg-transparent"
                      >
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-warning" />
                        <span className="whitespace-pre-wrap break-words">{issue.message}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-3 text-xs text-success">No problems: the flowchart is ready to run.</p>
              ))}
          </div>
        </aside>
      </div>

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(next) => {
          load(next);
          setImportOpen(false);
          captureEvent('flowchart_converted', { direction: 'from_code', source: 'paste' });
        }}
      />
      <ConfirmDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onConfirm={() => load(starterFlowchart())}
        icon={<FilePlus2 size={14} className="text-warning shrink-0" />}
        title="Start a new flowchart?"
        message="This flowchart will be cleared."
        confirmLabel="Start new"
      />
    </div>
  );
}

function ImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (doc: FlowchartDoc) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Draw a flowchart from pseudocode"
      icon={<FileUp size={14} className="text-primary shrink-0" />}
      widthClass="max-w-lg"
    >
      <p className="text-xs text-dark-text mb-2">Paste a program. It replaces the current flowchart.</p>
      <textarea
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setError(null);
        }}
        rows={10}
        spellCheck={false}
        autoFocus
        aria-label="Pseudocode"
        className="w-full rounded-md border border-border bg-background p-2 font-mono text-xs text-light-text outline-none focus:border-primary"
      />
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="min-h-9 px-3 rounded-md text-xs text-dark-text hover:text-light-text">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            const result = flowchartFromCode(code);
            if (result.doc) onImport(result.doc);
            else setError(result.error);
          }}
          className="min-h-9 px-3 rounded-md bg-primary text-on-primary text-xs font-semibold hover:opacity-90"
        >
          Draw it
        </button>
      </div>
    </Modal>
  );
}
