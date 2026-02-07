import { useState, useRef, useCallback } from 'react';
import { Interpreter, parse, PseudocodeError } from './index';
import type { OutputEntry } from './core/types';

export function useInterpreter() {
  const [entries, setEntries] = useState<OutputEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);

  const interpreterRef = useRef<Interpreter | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (sourceCode: string) => {
    // Clean up any previous run
    if (abortRef.current) {
      abortRef.current.abort();
    }

    setEntries([]);
    setIsRunning(true);
    setWaitingForInput(false);

    const abortController = new AbortController();
    abortRef.current = abortController;

    // Parse
    const { tree, errors } = parse(sourceCode);

    if (errors.length > 0) {
      setEntries(
        errors.map((e) => ({
          kind: 'error' as const,
          text: `Line ${e.line ?? '?'}:${e.column ?? '?'} — ${e.message}`,
        })),
      );
      setIsRunning(false);
      return;
    }

    if (!tree) {
      setEntries([{ kind: 'error', text: 'Failed to parse pseudocode' }]);
      setIsRunning(false);
      return;
    }

    const interpreter = new Interpreter(
      {
        onOutput(text: string) {
          setEntries((prev) => [...prev, { kind: 'output', text }]);
        },
        onInputRequest(variableName: string) {
          setWaitingForInput(true);
          setEntries((prev) => [
            ...prev,
            { kind: 'input', variableName, value: '', submitted: false },
          ]);
        },
        onInputComplete() {
          setWaitingForInput(false);
        },
        onComplete() {
          setIsRunning(false);
          setWaitingForInput(false);
        },
        onError(error: PseudocodeError) {
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
      },
      abortController.signal,
    );

    interpreterRef.current = interpreter;

    try {
      await interpreter.execute(tree);
    } catch (e) {
      if (e instanceof PseudocodeError) {
        setEntries((prev) => [
          ...prev,
          {
            kind: 'error',
            text: e.line
              ? `Runtime error at line ${e.line}: ${e.message}`
              : `Runtime error: ${e.message}`,
          },
        ]);
      } else if (e instanceof Error && e.message !== 'Execution cancelled') {
        setEntries((prev) => [
          ...prev,
          { kind: 'error', text: `Error: ${e.message}` },
        ]);
      }
      setIsRunning(false);
      setWaitingForInput(false);
    }
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
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, isRunning, waitingForInput, run, provideInput, stop, clearEntries };
}
