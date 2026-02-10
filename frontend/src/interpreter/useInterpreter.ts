import { useState, useRef, useCallback } from 'react';
import { Interpreter, parse, PseudocodeError } from './index';
import type { OutputEntry, DebugVariable } from './core/types';

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

  const interpreterRef = useRef<Interpreter | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startExecution = useCallback(
    async (sourceCode: string, stepMode: boolean) => {
      // Clean up any previous run
      if (abortRef.current) {
        abortRef.current.abort();
      }

      setEntries([]);
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
        setEntries(
          errors.map((e) => ({
            kind: 'error' as const,
            text: `Line ${e.line ?? '?'}:${e.column ?? '?'} — ${e.message}`,
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
            setEntries((prev) => [...prev, { kind: 'output', text }]);
          },
          onInputRequest(variableName: string) {
            setWaitingForInput(true);
            setEntries((prev) => [...prev, { kind: 'input', variableName, value: '', submitted: false }]);
          },
          onInputComplete() {
            setWaitingForInput(false);
          },
          onComplete() {
            setIsRunning(false);
            setWaitingForInput(false);
            setIsStepping(false);
            setDebugLine(null);
          },
          onError(error: PseudocodeError) {
            if (error.line != null) setErrorLine(error.line);
            setEntries((prev) => [
              ...prev,
              {
                kind: 'error',
                text: error.line
                  ? `Runtime error at line ${error.line}: ${error.message}`
                  : `Runtime error: ${error.message}`,
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
        },
        abortController.signal
      );

      interpreter.setStepMode(stepMode);
      interpreter.setBreakpoints(breakpoints);
      interpreterRef.current = interpreter;

      try {
        await interpreter.execute(tree);
      } catch (e) {
        if (e instanceof PseudocodeError) {
          if (e.line != null) setErrorLine(e.line);
          setEntries((prev) => [
            ...prev,
            {
              kind: 'error',
              text: e.line ? `Runtime error at line ${e.line}: ${e.message}` : `Runtime error: ${e.message}`,
            },
          ]);
        } else if (e instanceof Error && e.message !== 'Execution cancelled') {
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
          if (next[i].kind === 'input' && !next[i].submitted) {
            next[i] = { ...next[i], value, submitted: true };
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
    setIsRunning(false);
    setWaitingForInput(false);
    setIsStepping(false);
    setDebugLine(null);
    setDebugVariables([]);
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
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
