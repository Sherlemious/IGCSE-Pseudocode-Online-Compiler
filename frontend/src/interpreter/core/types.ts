export type OutputEntry =
  | { kind: 'output'; text: string }
  | { kind: 'input'; variableName: string; value: string; submitted: boolean }
  | { kind: 'error'; text: string };

export interface InterpreterCallbacks {
  onOutput(text: string): void;
  onInputRequest(variableName: string): void;
  onInputComplete(): void;
  onComplete(): void;
  onError(error: PseudocodeError): void;
}

export class PseudocodeError extends Error {
  constructor(
    message: string,
    public line?: number,
    public column?: number,
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
