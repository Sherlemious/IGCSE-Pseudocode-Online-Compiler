import { useState, useRef, useCallback } from 'react';
import posthog from 'posthog-js';
import { Interpreter, parse, PseudocodeError } from './index';
import type { OutputEntry, DebugVariable, TraceRow } from './core/types';
import { MAX_TRACE_ROWS } from './core/types';
import { humanizeParseError, humanizeRuntimeError } from './errorMessages';

function captureError(
  errorType: 'parse' | 'runtime',
  message: string,
  line: number | null | undefined,
  codeLines: number,
) {
  try {
    posthog.capture('interpreter_error', {
      error_type: errorType,
      error_message: message,
      line: line ?? null,
      code_lines: codeLines,
    });
  } catch { /* non-critical */ }
}

export function useInterpreter() {
  const [entries, setEntries] = useState<OutputEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);

  // Debug state
  const [isStepping, setIsStepping] = useState(false);
  const [debugLine, setDebugLine] = useState<number | null>(null);
  const [debugVariables, setDebugVariables] = useState<DebugVariable[]>([]);

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
      setDebugLine(null);
      setDebugVariables([]);
      setErrorLine(null);

      const abortController = new AbortController();
      abortRef.current = abortController;

      // Parse
      const { tree, errors } = parse(sourceCode);

      if (errors.length > 0) {
        const sourceLines = sourceCode.split('\n');
        const codeLines = sourceLines.length;
        errors.forEach((e) => captureError('parse', e.message, e.line, codeLines));
        setEntries(
          errors.map((e) => ({
            kind: 'error' as const,
            text: `Line ${e.line ?? '?'} — ${humanizeParseError(e.message, e.line != null ? sourceLines[e.line - 1] : undefined)}`,
          }))
        );
        // Mark first error line
        const firstLine = errors.find((e) => e.line != null)?.line;
        if (firstLine != null) setErrorLine(firstLine);
        setIsRunning(false);
        setIsStepping(false);
        return;
      }

      if (!tree) {
        setEntries([{ kind: 'error', text: 'Failed to parse pseudocode' }]);
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
            setIsRunning(false);
            setWaitingForInput(false);
            setIsStepping(false);
            setDebugLine(null);
          },
          onError(error: PseudocodeError) {
            flushOutputSync();
            flushTraceSync();
            captureError('runtime', error.message, error.line, sourceCode.split('\n').length);
            if (error.line != null) setErrorLine(error.line);
            setEntries((prev) => [
              ...prev,
              {
                kind: 'error',
                text: error.line
                  ? `Line ${error.line} — ${humanizeRuntimeError(error.message)}`
                  : humanizeRuntimeError(error.message),
              },
            ]);
          },
          onBeforeStep(line: number, variables: DebugVariable[]) {
            setDebugLine(line);
            setDebugVariables(variables);
          },
          onBreakpoint(line: number, variables: DebugVariable[]) {
            // When breakpoint is hit, enter step mode
            setIsStepping(true);
            setDebugLine(line);
            setDebugVariables(variables);
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
          captureError('runtime', e.message, e.line, sourceCode.split('\n').length);
          if (e.line != null) setErrorLine(e.line);
          setEntries((prev) => [
            ...prev,
            {
              kind: 'error',
              text: e.line
                ? `Line ${e.line} — ${humanizeRuntimeError(e.message)}`
                : humanizeRuntimeError(e.message),
            },
          ]);
        } else if (e instanceof Error && e.message !== 'Execution cancelled') {
          captureError('runtime', e.message, null, sourceCode.split('\n').length);
          setEntries((prev) => [...prev, { kind: 'error', text: `Error: ${e.message}` }]);
        }
        setIsRunning(false);
        setWaitingForInput(false);
        setIsStepping(false);
        setDebugLine(null);
      }
    },
    [breakpoints]
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
    interpreterRef.current?.step();
  }, []);

  const continueExecution = useCallback(() => {
    setIsStepping(false);
    setDebugLine(null);
    setDebugVariables([]);
    interpreterRef.current?.setStepMode(false);
  }, []);

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
    setDebugLine(null);
    setDebugVariables([]);
  }, [flushTraceSync]);

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

  return {
    entries,
    isRunning,
    waitingForInput,
    // Debug
    isStepping,
    debugLine,
    debugVariables,
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
    continueExecution,
    provideInput,
    stop,
    clearEntries,
    toggleBreakpoint,
    clearBreakpoints,
  };
}
