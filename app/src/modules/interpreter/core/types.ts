export type OutputEntry =
  | { kind: 'output'; text: string }
  | { kind: 'input'; variableName: string; prompt?: string; value: string; submitted: boolean }
  | { kind: 'error'; text: string };

export interface DebugVariable {
  name: string;
  value: string;
  type: string;
  constant: boolean;
}

/** Maximum number of rows a trace ("dry run") will record before stopping. */
export const MAX_TRACE_ROWS = 1000;

/** A single recorded step in a trace ("dry run") table. */
export interface TraceRow {
  /** 1-based execution order. */
  step: number;
  /** Source line of the statement that executed. */
  line: number;
  /** Variable state immediately after the statement executed. */
  variables: DebugVariable[];
  /** Output emitted by this statement (if any). */
  output: string[];
}

export interface InterpreterCallbacks {
  onOutput(text: string): void;
  onInputRequest(variableName: string, prompt?: string): void;
  onInputComplete(): void;
  onComplete(): void;
  onError(error: PseudocodeError): void;
  /** Called before each statement in step mode. */
  onBeforeStep?(line: number, variables: DebugVariable[]): void;
  /** Called when a breakpoint is hit during normal execution. */
  onBreakpoint?(line: number, variables: DebugVariable[]): void;
  /** Called after each statement executes in trace mode (for the trace table). */
  onTrace?(line: number, variables: DebugVariable[]): void;
}

export class PseudocodeError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number
  ) {
    super(message);
    this.name = 'PseudocodeError';
  }
}

export class RuntimeError extends PseudocodeError {
  constructor(message: string, line?: number, column?: number) {
    super(message, line, column);
    this.name = 'RuntimeError';
  }
}

export class ExecutionCancelledError extends PseudocodeError {
  constructor() {
    super('Execution cancelled');
    this.name = 'ExecutionCancelledError';
  }
}
