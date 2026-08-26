import { useState, useRef, useCallback } from 'react';
import { Interpreter, parse, PseudocodeError } from './index';
import type { OutputEntry, DebugVariable, TraceRow } from './core/types';
import { MAX_TRACE_ROWS } from './core/types';
import {
  humanizeParseError,
  humanizeRuntimeError,
  categorizeParseError,
  categorizeRuntimeError,
} from './errorMessages';
import {
  getErrorHelpersVariant,
  captureRun,
  captureInterpreterError,
  captureHintShown,
  captureHintResolved,
  type RunContext,
  type ErrorHelpersVariant,
  type RunOutcome,
} from './analytics';
import { normalizeSource } from './normalize';

export function useInterpreter(runContext?: RunContext) {
  // Latest run-context, read by capture callbacks without re-creating them.
  const runContextRef = useRef(runContext);
  runContextRef.current = runContext;
  const [entries, setEntries] = useState<OutputEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);

  // Debug state
  const [isStepping, setIsStepping] = useState(false);
  const [debugLine, setDebugLine] = useState<number | null>(null);
  const [debugVariables, setDebugVariables] = useState<DebugVariable[]>([]);
  // Step history — lets the user scrub back through statements already stepped
  // through (display-only; execution stays parked at the furthest point).
  const [debugCursor, setDebugCursor] = useState(-1); // index into the history
  const [debugStepCount, setDebugStepCount] = useState(0); // history length
  // Terminal-output boundary for the step being reviewed: how many entries were
  // visible at that pause. null = show everything (live edge / not stepping).
  const [debugVisibleLen, setDebugVisibleLen] = useState<number | null>(null);

  // Breakpoints
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());

  // Error line marker
  const [errorLine, setErrorLine] = useState<number | null>(null);

  // Trace ("dry run") table state
  const [traceRows, setTraceRows] = useState<TraceRow[]>([]);

  const interpreterRef = useRef<Interpreter | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const outputBuffer = useRef<string[]>([]);
  const flushTimeout = useRef<number | null>(null);
  // Running count of terminal entries, kept in sync synchronously at every
  // append site. `entries.length` isn't reliable at pause time because output
  // is rAF-buffered; this ref lets us record an accurate boundary per step.
  const entriesLenRef = useRef(0);

  // Step-history buffer. Refs are the source of truth for step/stepBack logic
  // (read synchronously, immune to React batching / StrictMode double-invokes);
  // the mirrored state above drives rendering. `outputLen` is the entry count
  // that was visible at each pause, so step-back can hide later output.
  const debugHistoryRef = useRef<{ line: number; variables: DebugVariable[]; outputLen: number }[]>([]);
  const debugCursorRef = useRef(-1);

  const resetDebugHistory = useCallback(() => {
    debugHistoryRef.current = [];
    debugCursorRef.current = -1;
    setDebugCursor(-1);
    setDebugStepCount(0);
    setDebugLine(null);
    setDebugVariables([]);
    setDebugVisibleLen(null);
  }, []);

  // Record a fresh pause point (from onBeforeStep / onBreakpoint) and move the
  // cursor to the live edge. line + variables always come from the same snapshot.
  const pushDebugSnapshot = useCallback(
    (line: number, variables: DebugVariable[], outputLen: number) => {
      debugHistoryRef.current.push({ line, variables, outputLen });
      debugCursorRef.current = debugHistoryRef.current.length - 1;
      setDebugLine(line);
      setDebugVariables(variables);
      setDebugCursor(debugCursorRef.current);
      setDebugStepCount(debugHistoryRef.current.length);
      setDebugVisibleLen(outputLen);
    },
    []
  );

  // Trace buffers — accumulated off-React and flushed via rAF to avoid a state
  // update per executed statement. `traceOutputBuffer` collects output emitted
  // since the last recorded row so it can be attached to that row.
  const traceModeRef = useRef(false);
  const traceBuffer = useRef<TraceRow[]>([]);
  const traceOutputBuffer = useRef<string[]>([]);
  const traceFlushTimeout = useRef<number | null>(null);
  const traceStepRef = useRef(0); // monotonic step counter (survives rAF flushes)

  const flushTrace = useCallback(() => {
    if (traceBuffer.current.length > 0) {
      const rows = traceBuffer.current;
      traceBuffer.current = [];
      setTraceRows((prev) => [...prev, ...rows]);
    }
    traceFlushTimeout.current = null;
  }, []);

  const flushOutput = useCallback(() => {
    if (outputBuffer.current.length > 0) {
      const newEntries = outputBuffer.current.map((text) => ({ kind: 'output' as const, text }));
      entriesLenRef.current += newEntries.length;
      setEntries((prev) => [...prev, ...newEntries]);
      outputBuffer.current = [];
    }
    flushTimeout.current = null;
  }, []);

  const flushOutputSync = useCallback(() => {
    if (outputBuffer.current.length > 0) {
      if (flushTimeout.current !== null) {
        cancelAnimationFrame(flushTimeout.current);
        flushTimeout.current = null;
      }
      flushOutput();
    }
  }, [flushOutput]);

  const flushTraceSync = useCallback(() => {
    if (traceBuffer.current.length > 0) {
      if (traceFlushTimeout.current !== null) {
        cancelAnimationFrame(traceFlushTimeout.current);
        traceFlushTimeout.current = null;
      }
      flushTrace();
    }
  }, [flushTrace]);

  // ── Run-level analytics tracking ──────────────────────────────────────────
  interface RunMeta {
    startedAt: number;
    usedInput: boolean;
    reported: boolean;
    runtimeErrorRecorded: boolean;
    primaryHint: string | null;
    variant: ErrorHelpersVariant;
    mode: 'run' | 'debug';
    codeLines: number;
    charCount: number;
    normalized: boolean;
  }
  const runMetaRef = useRef<RunMeta | null>(null);
  // Category of the primary error shown on the previous errored run, so a later
  // successful run can be attributed to that hint (hint_resolved).
  const lastHintRef = useRef<string | null>(null);

  // Fire code_run exactly once per execution, at whatever terminal state it
  // reaches. The `reported` guard makes it safe to call from several paths
  // (onComplete, onError, the catch block, stop()) — first outcome wins.
  const reportRun = useCallback((outcome: RunOutcome) => {
    const m = runMetaRef.current;
    if (!m || m.reported) return;
    m.reported = true;
    captureRun(
      outcome,
      {
        codeLines: m.codeLines,
        charCount: m.charCount,
        durationMs: performance.now() - m.startedAt,
        usedInput: m.usedInput,
        mode: m.mode,
        normalized: m.normalized,
      },
      runContextRef.current,
      m.variant,
    );
    if (outcome === 'success' && lastHintRef.current) {
      captureHintResolved(lastHintRef.current, runContextRef.current, m.variant);
      lastHintRef.current = null;
    } else if (outcome === 'parse_error' || outcome === 'runtime_error') {
      lastHintRef.current = m.primaryHint;
    }
  }, []);

  // Capture one interpreter_error (enriched with category + offending line) and,
  // for the first error of a run, the matching hint_shown.
  const recordError = useCallback(
    (
      errorType: 'parse' | 'runtime',
      message: string,
      line: number | null | undefined,
      sourceLines: string[],
    ) => {
      const m = runMetaRef.current;
      const variant = m?.variant ?? 'v1';
      if (errorType === 'runtime') {
        if (m?.runtimeErrorRecorded) return; // dedupe onError + catch double-report
        if (m) m.runtimeErrorRecorded = true;
      }
      const category =
        errorType === 'parse'
          ? categorizeParseError(message, line != null ? sourceLines[line - 1] : undefined)
          : categorizeRuntimeError(message);
      const offendingLine = line != null ? sourceLines[line - 1]?.trim() : undefined;
      captureInterpreterError(
        errorType,
        { message, line, codeLines: sourceLines.length, category, offendingLine },
        runContextRef.current,
        variant,
      );
      if (m && m.primaryHint === null) {
        m.primaryHint = category;
        captureHintShown(category, runContextRef.current, variant);
      }
    },
    [],
  );

  const startExecution = useCallback(
    async (sourceCode: string, stepMode: boolean) => {
      // Clean up any previous run
      if (abortRef.current) {
        abortRef.current.abort();
      }
      if (flushTimeout.current !== null) {
        cancelAnimationFrame(flushTimeout.current);
        flushTimeout.current = null;
      }
      if (traceFlushTimeout.current !== null) {
        cancelAnimationFrame(traceFlushTimeout.current);
        traceFlushTimeout.current = null;
      }
      outputBuffer.current = [];
      entriesLenRef.current = 0;
      traceBuffer.current = [];
      traceOutputBuffer.current = [];
      traceStepRef.current = 0;
      // Trace is always collected now (no separate "Trace" action) — both Run
      // and Debug build the dry-run table, IDE-style. It's still capped at
      // MAX_TRACE_ROWS, so the per-statement snapshot overhead stays bounded.
      traceModeRef.current = true;

      setEntries([]);
      setTraceRows([]);
      setIsRunning(true);
      setWaitingForInput(false);
      setIsStepping(stepMode);
      resetDebugHistory();
      setErrorLine(null);

      const abortController = new AbortController();
      abortRef.current = abortController;

      // Resolve the A/B variant and, for v2, clean paste artefacts (smart quotes,
      // invisible chars) before the parser ever sees them. Replacements are
      // line-length-preserving, so error line numbers stay aligned.
      const variant = getErrorHelpersVariant();
      const normalized =
        variant === 'v2' ? normalizeSource(sourceCode) : { code: sourceCode, changed: false, fixes: [] };
      const source = normalized.code;
      runMetaRef.current = {
        startedAt: performance.now(),
        usedInput: false,
        reported: false,
        runtimeErrorRecorded: false,
        primaryHint: null,
        variant,
        mode: stepMode ? 'debug' : 'run',
        codeLines: source.split('\n').length,
        charCount: source.length,
        normalized: normalized.changed,
      };

      // Parse
      const { tree, errors } = parse(source);

      if (errors.length > 0) {
        const sourceLines = source.split('\n');
        errors.forEach((e) => recordError('parse', e.message, e.line, sourceLines));
        setEntries(
          errors.map((e) => ({
            kind: 'error' as const,
            text: `Line ${e.line ?? '?'} — ${humanizeParseError(e.message, e.line != null ? sourceLines[e.line - 1] : undefined, variant)}`,
          }))
        );
        entriesLenRef.current = errors.length;
        // Mark first error line
        const firstLine = errors.find((e) => e.line != null)?.line;
        if (firstLine != null) setErrorLine(firstLine);
        reportRun('parse_error');
        setIsRunning(false);
        setIsStepping(false);
        return;
      }

      if (!tree) {
        setEntries([{ kind: 'error', text: 'Failed to parse pseudocode' }]);
        entriesLenRef.current = 1;
        reportRun('parse_error');
        setIsRunning(false);
        setIsStepping(false);
        return;
      }

      const interpreter = new Interpreter(
        {
          onOutput(text: string) {
            outputBuffer.current.push(text);
            if (flushTimeout.current === null) {
              flushTimeout.current = requestAnimationFrame(flushOutput);
            }
            // In trace mode, also stage output to attach to the next trace row.
            if (traceModeRef.current) {
              traceOutputBuffer.current.push(text);
            }
          },
          onInputRequest(variableName: string, prompt?: string) {
            // Flush any pending output before requesting input
            flushOutputSync();
            if (runMetaRef.current) runMetaRef.current.usedInput = true;
            entriesLenRef.current += 1;
            setWaitingForInput(true);
            setEntries((prev) => [...prev, { kind: 'input', variableName, prompt, value: '', submitted: false }]);
          },
          onInputComplete() {
            setWaitingForInput(false);
          },
          onComplete() {
            // Flush any remaining output / trace rows
            flushOutputSync();
            flushTraceSync();
            reportRun('success');
            setIsRunning(false);
            setWaitingForInput(false);
            setIsStepping(false);
            resetDebugHistory();
          },
          onError(error: PseudocodeError) {
            flushOutputSync();
            flushTraceSync();
            recordError('runtime', error.message, error.line, source.split('\n'));
            if (error.line != null) setErrorLine(error.line);
            entriesLenRef.current += 1;
            setEntries((prev) => [
              ...prev,
              {
                kind: 'error',
                text: error.line
                  ? `Line ${error.line} — ${humanizeRuntimeError(error.message)}`
                  : humanizeRuntimeError(error.message),
              },
            ]);
            reportRun('runtime_error');
          },
          onBeforeStep(line: number, variables: DebugVariable[]) {
            // Materialize buffered output so the recorded boundary is accurate.
            flushOutputSync();
            pushDebugSnapshot(line, variables, entriesLenRef.current);
          },
          onBreakpoint(line: number, variables: DebugVariable[]) {
            // When breakpoint is hit, enter step mode
            flushOutputSync();
            setIsStepping(true);
            pushDebugSnapshot(line, variables, entriesLenRef.current);
          },
          onTrace(line: number, variables: DebugVariable[]) {
            const output = traceOutputBuffer.current;
            traceOutputBuffer.current = [];
            traceStepRef.current += 1;
            traceBuffer.current.push({
              step: traceStepRef.current,
              line,
              variables,
              output,
            });
            if (traceFlushTimeout.current === null) {
              traceFlushTimeout.current = requestAnimationFrame(flushTrace);
            }
          },
        },
        abortController.signal
      );

      interpreter.setStepMode(stepMode);
      interpreter.setTraceMode(true);
      interpreter.setBreakpoints(breakpoints);
      interpreterRef.current = interpreter;

      try {
        await interpreter.execute(tree);
      } catch (e) {
        flushOutputSync();
        flushTraceSync();

        if (e instanceof PseudocodeError) {
          recordError('runtime', e.message, e.line, source.split('\n'));
          if (e.line != null) setErrorLine(e.line);
          entriesLenRef.current += 1;
          setEntries((prev) => [
            ...prev,
            {
              kind: 'error',
              text: e.line
                ? `Line ${e.line} — ${humanizeRuntimeError(e.message)}`
                : humanizeRuntimeError(e.message),
            },
          ]);
          reportRun('runtime_error');
        } else if (e instanceof Error && e.message === 'Execution cancelled') {
          reportRun('aborted');
        } else if (e instanceof Error) {
          recordError('runtime', e.message, null, source.split('\n'));
          entriesLenRef.current += 1;
          setEntries((prev) => [...prev, { kind: 'error', text: `Error: ${e.message}` }]);
          reportRun('runtime_error');
        }
        setIsRunning(false);
        setWaitingForInput(false);
        setIsStepping(false);
        resetDebugHistory();
      }
    },
    [breakpoints, resetDebugHistory, pushDebugSnapshot, reportRun, recordError]
  );

  const run = useCallback(
    async (sourceCode: string) => {
      await startExecution(sourceCode, false);
    },
    [startExecution]
  );

  const debugRun = useCallback(
    async (sourceCode: string) => {
      await startExecution(sourceCode, true);
    },
    [startExecution]
  );

  const step = useCallback(() => {
    const history = debugHistoryRef.current;
    if (debugCursorRef.current < history.length - 1) {
      // Reviewing earlier steps — advance the display only, no execution.
      const next = debugCursorRef.current + 1;
      debugCursorRef.current = next;
      const snap = history[next];
      setDebugLine(snap.line);
      setDebugVariables(snap.variables);
      setDebugCursor(next);
      setDebugVisibleLen(snap.outputLen);
    } else {
      // At the live edge — actually advance execution to the next statement.
      interpreterRef.current?.step();
    }
  }, []);

  const stepBack = useCallback(() => {
    if (debugCursorRef.current <= 0) return;
    const prev = debugCursorRef.current - 1;
    debugCursorRef.current = prev;
    const snap = debugHistoryRef.current[prev];
    setDebugLine(snap.line);
    setDebugVariables(snap.variables);
    setDebugCursor(prev);
    setDebugVisibleLen(snap.outputLen);
  }, []);

  const continueExecution = useCallback(() => {
    setIsStepping(false);
    resetDebugHistory();
    interpreterRef.current?.setStepMode(false);
  }, [resetDebugHistory]);

  const provideInput = useCallback((value: string) => {
    if (interpreterRef.current) {
      // Mark the last input entry as submitted
      setEntries((prev) => {
        const next = [...prev];
        for (let i = next.length - 1; i >= 0; i--) {
          const entry = next[i];
          if (entry.kind === 'input' && !entry.submitted) {
            next[i] = { ...entry, value, submitted: true };
            break;
          }
        }
        return next;
      });
      interpreterRef.current.provideInput(value);
    }
  }, []);

  const stop = useCallback(() => {
    // Attribute the run as user-aborted. Safe if a terminal state already fired
    // (reportRun is guarded) or if the abort's rejection reaches the catch first.
    reportRun('aborted');
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (flushTimeout.current !== null) {
      cancelAnimationFrame(flushTimeout.current);
      flushTimeout.current = null;
    }
    // Keep whatever trace rows were recorded so far visible, but flush the buffer.
    flushTraceSync();
    traceModeRef.current = false;
    outputBuffer.current = [];
    setIsRunning(false);
    setWaitingForInput(false);
    setIsStepping(false);
    resetDebugHistory();
  }, [flushTraceSync, resetDebugHistory, reportRun]);

  const clearEntries = useCallback(() => {
    if (flushTimeout.current !== null) {
      cancelAnimationFrame(flushTimeout.current);
      flushTimeout.current = null;
    }
    if (traceFlushTimeout.current !== null) {
      cancelAnimationFrame(traceFlushTimeout.current);
      traceFlushTimeout.current = null;
    }
    outputBuffer.current = [];
    entriesLenRef.current = 0;
    traceBuffer.current = [];
    setEntries([]);
    setTraceRows([]);
  }, []);

  const toggleBreakpoint = useCallback((line: number) => {
    setBreakpoints((prev) => {
      const next = new Set(prev);
      if (next.has(line)) {
        next.delete(line);
      } else {
        next.add(line);
      }
      return next;
    });
  }, []);

  const clearBreakpoints = useCallback(() => {
    setBreakpoints(new Set());
  }, []);

  // While reviewing an earlier step (cursor behind the live edge), hide the
  // terminal output produced after that point so the console matches the step.
  // Never slice while awaiting INPUT — that would hide the pending input field.
  const reviewingHistory =
    isStepping && !waitingForInput && debugVisibleLen != null && debugCursor < debugStepCount - 1;
  const visibleEntries = reviewingHistory ? entries.slice(0, debugVisibleLen) : entries;

  return {
    entries: visibleEntries,
    isRunning,
    waitingForInput,
    // Debug
    isStepping,
    debugLine,
    debugVariables,
    debugCursor,
    debugStepCount,
    errorLine,
    // Breakpoints
    breakpoints,
    // Trace
    traceRows,
    maxTraceRows: MAX_TRACE_ROWS,
    // Actions
    run,
    debugRun,
    step,
    stepBack,
    continueExecution,
    provideInput,
    stop,
    clearEntries,
    toggleBreakpoint,
    clearBreakpoints,
  };
}
