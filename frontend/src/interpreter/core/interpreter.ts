import {
  ProgramContext,
  StatementContext,
  DeclareStatementContext,
  ConstantStatementContext,
  AssignmentStatementContext,
  InputStatementContext,
  OutputStatementContext,
  ExprListContext,
  IfStatementContext,
  CaseStatementContext,
  ForStatementContext,
  WhileStatementContext,
  RepeatStatementContext,
  ProcedureDeclarationContext,
  FunctionDeclarationContext,
  CallStatementContext,
  ReturnStatementContext,
  OpenFileStatementContext,
  ReadFileStatementContext,
  WriteFileStatementContext,
  CloseFileStatementContext,
  BlockContext,
  ExprContext,
  NotExprContext,
  UnaryMinusExprContext,
  PowerExprContext,
  MulDivExprContext,
  AddSubExprContext,
  ConcatExprContext,
  ComparisonExprContext,
  AndExprContext,
  OrExprContext,
  AtomExprContext,
  ParenAtomContext,
  FunctionCallAtomContext,
  ArrayAccess1DAtomContext,
  ArrayAccess2DAtomContext,
  DivFunctionAtomContext,
  ModFunctionAtomContext,
  IdentifierAtomContext,
  IntegerAtomContext,
  RealAtomContext,
  StringAtomContext,
  CharAtomContext,
  TrueAtomContext,
  FalseAtomContext,
} from '../generated/PseudocodeParser';

import { PseudocodeLexer } from '../generated/PseudocodeLexer';

import { Environment } from './environment';
import { PseudocodeArray } from './arrays';
import {
  RuntimeValue,
  mkInteger,
  mkReal,
  mkString,
  mkChar,
  mkBoolean,
  mkNone,
  toNumber,
  toBoolean,
  toString,
  isNumeric,
  smartParse,
} from './values';
import { getBuiltin, registerFileBuiltins } from './builtins';
import { VirtualFileSystem } from './filesystem';
import { InterpreterCallbacks, RuntimeError, ExecutionCancelledError, DebugVariable } from './types';

class ReturnSignal {
  constructor(public value: RuntimeValue) {}
}

interface CallableDefinition {
  params: { name: string; type: string }[];
  body: BlockContext;
  returnType?: string;
}

export class Interpreter {
  private env: Environment;
  private callbacks: InterpreterCallbacks;
  private signal: AbortSignal;
  private procedures = new Map<string, CallableDefinition>();
  private functions = new Map<string, CallableDefinition>();
  private inputResolver: ((value: string) => void) | null = null;
  private iterationCount = 0;
  private fileSystem = new VirtualFileSystem();
  private _stepMode = false;
  private stepResolver: (() => void) | null = null;
  private _breakpoints = new Set<number>();

  constructor(callbacks: InterpreterCallbacks, signal: AbortSignal) {
    this.env = new Environment();
    this.callbacks = callbacks;
    this.signal = signal;
    registerFileBuiltins((filename) => this.fileSystem.eof(filename));
  }

  private checkCancelled(): void {
    if (this.signal.aborted) throw new ExecutionCancelledError();
  }

  private async yieldControl(): Promise<void> {
    this.iterationCount++;
    if (this.iterationCount % 1000 === 0) {
      this.checkCancelled();
      await new Promise<void>((r) => setTimeout(r, 0));
    }
  }

  provideInput(value: string): void {
    if (this.inputResolver) {
      const resolve = this.inputResolver;
      this.inputResolver = null;
      resolve(value);
    }
  }

  setStepMode(enabled: boolean): void {
    this._stepMode = enabled;
    // If disabling step mode while paused, resume execution
    if (!enabled && this.stepResolver) {
      const resolve = this.stepResolver;
      this.stepResolver = null;
      resolve();
    }
  }

  setBreakpoints(breakpoints: Set<number>): void {
    this._breakpoints = new Set(breakpoints);
  }

  step(): void {
    if (this.stepResolver) {
      const resolve = this.stepResolver;
      this.stepResolver = null;
      resolve();
    }
  }

  private snapshotVariables(): DebugVariable[] {
    const vars: DebugVariable[] = [];
    for (const [name, entry] of this.env.getAllVariables()) {
      if (entry.value instanceof PseudocodeArray) {
        vars.push({ name, value: 'Array', type: 'ARRAY', constant: entry.constant });
      } else {
        vars.push({
          name,
          value: toString(entry.value),
          type: entry.value.type,
          constant: entry.constant,
        });
      }
    }
    vars.sort((a, b) => a.name.localeCompare(b.name));
    return vars;
  }

  private async beforeStatement(line: number): Promise<void> {
    this.checkCancelled();
    
    // Check if we hit a breakpoint (only when not already in step mode)
    if (!this._stepMode && this._breakpoints.has(line)) {
      const variables = this.snapshotVariables();
      this.callbacks.onBreakpoint?.(line, variables);
      this._stepMode = true; // Enter step mode
      await new Promise<void>((resolve) => {
        this.stepResolver = resolve;
      });
      this.checkCancelled();
      return;
    }
    
    // Normal step mode behavior
    if (!this._stepMode) return;
    const variables = this.snapshotVariables();
    this.callbacks.onBeforeStep?.(line, variables);
    await new Promise<void>((resolve) => {
      this.stepResolver = resolve;
    });
    this.checkCancelled();
  }

  private async requestInput(variableName: string): Promise<string> {
    this.checkCancelled();
    this.callbacks.onInputRequest(variableName);
    return new Promise<string>((resolve) => {
      this.inputResolver = resolve;
    });
  }

  async execute(tree: ProgramContext): Promise<void> {
    try {
      await this.visitProgram(tree);
      this.callbacks.onComplete();
    } catch (e) {
      if (e instanceof ExecutionCancelledError) {
        this.callbacks.onComplete();
      } else if (e instanceof ReturnSignal) {
        this.callbacks.onComplete();
      } else {
        throw e;
      }
    }
  }

  // ─── Program / Block ────────────────────────────────────────────

  private async visitProgram(ctx: ProgramContext): Promise<void> {
    const stmts = ctx.statement();
    for (const stmt of stmts) {
      await this.visitStatement(stmt);
    }
  }

  private async visitBlock(ctx: BlockContext): Promise<void> {
    const stmts = ctx.statement();
    for (const stmt of stmts) {
      await this.visitStatement(stmt);
    }
  }

  private async visitStatement(ctx: StatementContext): Promise<void> {
    this.checkCancelled();
    const line = ctx.start?.line;
    if (line !== undefined) {
      await this.beforeStatement(line);
    }
    if (ctx.declareStatement()) return this.visitDeclare(ctx.declareStatement()!);
    if (ctx.constantStatement()) return this.visitConstant(ctx.constantStatement()!);
    if (ctx.assignmentStatement()) return this.visitAssignment(ctx.assignmentStatement()!);
    if (ctx.inputStatement()) return this.visitInput(ctx.inputStatement()!);
    if (ctx.outputStatement()) return this.visitOutput(ctx.outputStatement()!);
    if (ctx.ifStatement()) return this.visitIf(ctx.ifStatement()!);
    if (ctx.caseStatement()) return this.visitCase(ctx.caseStatement()!);
    if (ctx.forStatement()) return this.visitFor(ctx.forStatement()!);
    if (ctx.whileStatement()) return this.visitWhile(ctx.whileStatement()!);
    if (ctx.repeatStatement()) return this.visitRepeat(ctx.repeatStatement()!);
    if (ctx.procedureDeclaration()) return this.visitProcedureDecl(ctx.procedureDeclaration()!);
    if (ctx.functionDeclaration()) return this.visitFunctionDecl(ctx.functionDeclaration()!);
    if (ctx.callStatement()) return this.visitCall(ctx.callStatement()!);
    if (ctx.returnStatement()) return this.visitReturn(ctx.returnStatement()!);
    if (ctx.openFileStatement()) return this.visitOpenFile(ctx.openFileStatement()!);
    if (ctx.readFileStatement()) return this.visitReadFile(ctx.readFileStatement()!);
    if (ctx.writeFileStatement()) return this.visitWriteFile(ctx.writeFileStatement()!);
    if (ctx.closeFileStatement()) return this.visitCloseFile(ctx.closeFileStatement()!);
  }

  // ─── DECLARE ────────────────────────────────────────────────────

  private async visitDeclare(ctx: DeclareStatementContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const exprs = ctx.expr();

    if (ctx.ARRAY()) {
      // Array declaration
      const dataTypeText = ctx.dataType().getText();
      if (ctx.COMMA()) {
        // 2D: DECLARE x : ARRAY[l1:u1, l2:u2] OF type
        const l1 = toNumber(await this.evalExpr(exprs[0]));
        const u1 = toNumber(await this.evalExpr(exprs[1]));
        const l2 = toNumber(await this.evalExpr(exprs[2]));
        const u2 = toNumber(await this.evalExpr(exprs[3]));
        const arr = new PseudocodeArray(
          [{ lower: l1, upper: u1 }, { lower: l2, upper: u2 }],
          dataTypeText,
        );
        this.env.declare(name, arr);
      } else {
        // 1D: DECLARE x : ARRAY[l:u] OF type
        const lower = toNumber(await this.evalExpr(exprs[0]));
        const upper = toNumber(await this.evalExpr(exprs[1]));
        const arr = new PseudocodeArray([{ lower, upper }], dataTypeText);
        this.env.declare(name, arr);
      }
    } else {
      // Simple variable declaration
      this.env.declare(name);
    }
  }

  // ─── CONSTANT ───────────────────────────────────────────────────

  private async visitConstant(ctx: ConstantStatementContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const value = await this.evalExpr(ctx.expr());
    this.env.declareConstant(name, value);
  }

  // ─── Assignment ─────────────────────────────────────────────────

  private async visitAssignment(ctx: AssignmentStatementContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const exprs = ctx.expr();

    if (ctx.LBRACKET()) {
      // Array element assignment
      const arr = this.env.getArray(name);
      if (exprs.length === 3) {
        // 2D: arr[i, j] = expr
        const i = toNumber(await this.evalExpr(exprs[0]));
        const j = toNumber(await this.evalExpr(exprs[1]));
        const value = await this.evalExpr(exprs[2]);
        arr.set([i, j], value);
      } else {
        // 1D: arr[i] = expr
        const idx = toNumber(await this.evalExpr(exprs[0]));
        const value = await this.evalExpr(exprs[1]);
        arr.set([idx], value);
      }
    } else {
      // Simple assignment
      const value = await this.evalExpr(exprs[0]);
      this.env.set(name, value);
    }
  }

  // ─── INPUT ──────────────────────────────────────────────────────

  private async visitInput(ctx: InputStatementContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const raw = await this.requestInput(name);
    this.callbacks.onInputComplete();
    const value = smartParse(raw);

    if (ctx.LBRACKET()) {
      const idx = toNumber(await this.evalExpr(ctx.expr()!));
      const arr = this.env.getArray(name);
      arr.set([idx], value);
    } else {
      this.env.set(name, value);
    }
  }

  // ─── OUTPUT ─────────────────────────────────────────────────────

  private async visitOutput(ctx: OutputStatementContext): Promise<void> {
    const parts: string[] = [];
    const exprList = ctx.exprList();
    for (const e of exprList.expr()) {
      const val = await this.evalExpr(e);
      parts.push(toString(val));
    }
    this.callbacks.onOutput(parts.join(''));
  }

  // ─── IF / ELSE ──────────────────────────────────────────────────

  private async visitIf(ctx: IfStatementContext): Promise<void> {
    const exprs = ctx.expr();
    const blocks = ctx.block();

    // First condition (IF)
    const firstCond = await this.evalExpr(exprs[0]);
    if (toBoolean(firstCond)) {
      await this.visitBlock(blocks[0]);
      return;
    }

    // ELSEIF conditions
    const elseIfTokens = ctx.ELSEIF();
    for (let i = 0; i < elseIfTokens.length; i++) {
      const cond = await this.evalExpr(exprs[i + 1]);
      if (toBoolean(cond)) {
        await this.visitBlock(blocks[i + 1]);
        return;
      }
    }

    // ELSE block (if present)
    if (ctx.ELSE()) {
      const elseBlockIdx = 1 + elseIfTokens.length;
      await this.visitBlock(blocks[elseBlockIdx]);
    }
  }

  // ─── CASE ───────────────────────────────────────────────────────

  private async visitCase(ctx: CaseStatementContext): Promise<void> {
    const varName = ctx.IDENTIFIER().getText();
    const varVal = this.env.get(varName);
    if (varVal instanceof PseudocodeArray) {
      throw new RuntimeError('CASE cannot operate on array', ctx.start?.line);
    }

    const clauses = ctx.caseClause();
    for (const clause of clauses) {
      const caseVal = await this.evalExpr(clause.expr());
      if (this.valuesEqual(varVal, caseVal)) {
        await this.visitBlock(clause.block());
        return;
      }
    }

    // OTHERWISE
    if (ctx.OTHERWISE() && ctx.block()) {
      await this.visitBlock(ctx.block()!);
    }
  }

  private valuesEqual(a: RuntimeValue, b: RuntimeValue): boolean {
    if (isNumeric(a) && isNumeric(b)) return toNumber(a) === toNumber(b);
    return toString(a) === toString(b);
  }

  // ─── FOR ────────────────────────────────────────────────────────

  private async visitFor(ctx: ForStatementContext): Promise<void> {
    const varName = ctx.IDENTIFIER(0)!.getText();
    const exprs = ctx.expr();

    const startVal = toNumber(await this.evalExpr(exprs[0]));
    const endVal = toNumber(await this.evalExpr(exprs[1]));
    const stepVal = exprs.length > 2 ? toNumber(await this.evalExpr(exprs[2])) : 1;

    this.env.set(varName, mkInteger(startVal));

    if (stepVal > 0) {
      for (let i = startVal; i <= endVal; i += stepVal) {
        await this.yieldControl();
        this.env.set(varName, Number.isInteger(i) ? mkInteger(i) : mkReal(i));
        await this.visitBlock(ctx.block());
      }
    } else if (stepVal < 0) {
      for (let i = startVal; i >= endVal; i += stepVal) {
        await this.yieldControl();
        this.env.set(varName, Number.isInteger(i) ? mkInteger(i) : mkReal(i));
        await this.visitBlock(ctx.block());
      }
    }
  }

  // ─── WHILE ──────────────────────────────────────────────────────

  private async visitWhile(ctx: WhileStatementContext): Promise<void> {
    while (true) {
      await this.yieldControl();
      const cond = await this.evalExpr(ctx.expr());
      if (!toBoolean(cond)) break;
      await this.visitBlock(ctx.block());
    }
  }

  // ─── REPEAT / UNTIL ─────────────────────────────────────────────

  private async visitRepeat(ctx: RepeatStatementContext): Promise<void> {
    do {
      await this.yieldControl();
      await this.visitBlock(ctx.block());
      const cond = await this.evalExpr(ctx.expr());
      if (toBoolean(cond)) break;
    } while (true);
  }

  // ─── PROCEDURE / FUNCTION declarations ──────────────────────────

  private async visitProcedureDecl(ctx: ProcedureDeclarationContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const params = this.extractParams(ctx.paramList());
    this.procedures.set(name.toUpperCase(), { params, body: ctx.block() });
  }

  private async visitFunctionDecl(ctx: FunctionDeclarationContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const params = this.extractParams(ctx.paramList());
    const returnType = ctx.dataType().getText();
    this.functions.set(name.toUpperCase(), { params, body: ctx.block(), returnType });
  }

  private extractParams(ctx: ReturnType<ProcedureDeclarationContext['paramList']>): { name: string; type: string }[] {
    if (!ctx) return [];
    return ctx.param().map((p) => ({
      name: p.IDENTIFIER().getText(),
      type: p.dataType().getText(),
    }));
  }

  // ─── CALL ───────────────────────────────────────────────────────

  private async visitCall(ctx: CallStatementContext): Promise<void> {
    const name = ctx.IDENTIFIER().getText();
    const args = ctx.argList() ? await this.evalArgList(ctx.argList()!) : [];
    await this.callProcedure(name, args, ctx.start?.line);
  }

  private async callProcedure(name: string, args: RuntimeValue[], line?: number): Promise<void> {
    const proc = this.procedures.get(name.toUpperCase());
    if (!proc) throw new RuntimeError(`Procedure '${name}' is not defined`, line);

    const localEnv = new Environment(this.env);
    for (let i = 0; i < proc.params.length; i++) {
      localEnv.declare(proc.params[i].name, args[i] ?? mkNone());
    }

    const prevEnv = this.env;
    this.env = localEnv;
    try {
      await this.visitBlock(proc.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        // Procedures ignore return values
      } else {
        throw e;
      }
    } finally {
      this.env = prevEnv;
    }
  }

  private async callFunction(name: string, args: RuntimeValue[], line?: number): Promise<RuntimeValue> {
    const func = this.functions.get(name.toUpperCase());
    if (!func) throw new RuntimeError(`Function '${name}' is not defined`, line);

    const localEnv = new Environment(this.env);
    for (let i = 0; i < func.params.length; i++) {
      localEnv.declare(func.params[i].name, args[i] ?? mkNone());
    }

    const prevEnv = this.env;
    this.env = localEnv;
    try {
      await this.visitBlock(func.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        return e.value;
      }
      throw e;
    } finally {
      this.env = prevEnv;
    }
    return mkNone();
  }

  // ─── RETURN ─────────────────────────────────────────────────────

  private async visitReturn(ctx: ReturnStatementContext): Promise<void> {
    const value = await this.evalExpr(ctx.expr());
    throw new ReturnSignal(value);
  }

  // ─── FILE HANDLING ─────────────────────────────────────────────

  private async visitOpenFile(ctx: OpenFileStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    const modeCtx = ctx.fileMode();
    let mode: 'READ' | 'WRITE' | 'APPEND';
    if (modeCtx.READ_MODE()) mode = 'READ';
    else if (modeCtx.WRITE_MODE()) mode = 'WRITE';
    else mode = 'APPEND';
    this.fileSystem.openFile(filename, mode);
  }

  private async visitReadFile(ctx: ReadFileStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    const varName = ctx.IDENTIFIER().getText();
    const line = this.fileSystem.readFile(filename);
    this.env.set(varName, smartParse(line));
  }

  private async visitWriteFile(ctx: WriteFileStatementContext): Promise<void> {
    const exprs = ctx.expr();
    const filename = toString(await this.evalExpr(exprs[0]));
    const data = toString(await this.evalExpr(exprs[1]));
    this.fileSystem.writeFile(filename, data);
  }

  private async visitCloseFile(ctx: CloseFileStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    this.fileSystem.closeFile(filename);
  }

  // ─── Expression evaluation ──────────────────────────────────────

  private async evalExpr(ctx: ExprContext): Promise<RuntimeValue> {
    this.checkCancelled();

    if (ctx instanceof NotExprContext) {
      const val = await this.evalExpr(ctx.expr());
      return mkBoolean(!toBoolean(val));
    }

    if (ctx instanceof UnaryMinusExprContext) {
      const val = await this.evalExpr(ctx.expr());
      const n = toNumber(val);
      return val.type === 'INTEGER' ? mkInteger(-n) : mkReal(-n);
    }

    if (ctx instanceof PowerExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      const right = await this.evalExpr(ctx.expr(1)!);
      const result = Math.pow(toNumber(left), toNumber(right));
      return Number.isInteger(result) && left.type === 'INTEGER' && right.type === 'INTEGER'
        ? mkInteger(result) : mkReal(result);
    }

    if (ctx instanceof MulDivExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      const right = await this.evalExpr(ctx.expr(1)!);
      const op = ctx._op!.text!;
      const l = toNumber(left);
      const r = toNumber(right);
      switch (op.toUpperCase()) {
        case '*': {
          const res = l * r;
          return (left.type === 'INTEGER' && right.type === 'INTEGER') ? mkInteger(res) : mkReal(res);
        }
        case '/': {
          if (r === 0) throw new RuntimeError('Division by zero', ctx.start?.line);
          return mkReal(l / r);
        }
        case 'DIV': {
          if (r === 0) throw new RuntimeError('Division by zero', ctx.start?.line);
          return mkInteger(Math.trunc(l / r));
        }
        case 'MOD': {
          if (r === 0) throw new RuntimeError('Division by zero', ctx.start?.line);
          return mkInteger(((l % r) + r) % r);
        }
      }
    }

    if (ctx instanceof AddSubExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      const right = await this.evalExpr(ctx.expr(1)!);
      const op = ctx._op!.text!;
      const l = toNumber(left);
      const r = toNumber(right);
      const result = op === '+' ? l + r : l - r;
      return (left.type === 'INTEGER' && right.type === 'INTEGER') ? mkInteger(result) : mkReal(result);
    }

    if (ctx instanceof ConcatExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      const right = await this.evalExpr(ctx.expr(1)!);
      return mkString(toString(left) + toString(right));
    }

    if (ctx instanceof ComparisonExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      const right = await this.evalExpr(ctx.expr(1)!);
      const op = ctx._op!.text!;

      if (isNumeric(left) && isNumeric(right)) {
        const l = toNumber(left);
        const r = toNumber(right);
        switch (op) {
          case '=': return mkBoolean(l === r);
          case '<>': return mkBoolean(l !== r);
          case '<': return mkBoolean(l < r);
          case '>': return mkBoolean(l > r);
          case '<=': return mkBoolean(l <= r);
          case '>=': return mkBoolean(l >= r);
        }
      } else {
        const l = toString(left);
        const r = toString(right);
        switch (op) {
          case '=': return mkBoolean(l === r);
          case '<>': return mkBoolean(l !== r);
          case '<': return mkBoolean(l < r);
          case '>': return mkBoolean(l > r);
          case '<=': return mkBoolean(l <= r);
          case '>=': return mkBoolean(l >= r);
        }
      }
    }

    if (ctx instanceof AndExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      if (!toBoolean(left)) return mkBoolean(false);
      const right = await this.evalExpr(ctx.expr(1)!);
      return mkBoolean(toBoolean(right));
    }

    if (ctx instanceof OrExprContext) {
      const left = await this.evalExpr(ctx.expr(0)!);
      if (toBoolean(left)) return mkBoolean(true);
      const right = await this.evalExpr(ctx.expr(1)!);
      return mkBoolean(toBoolean(right));
    }

    if (ctx instanceof AtomExprContext) {
      return this.evalAtom(ctx.atom());
    }

    throw new RuntimeError(`Unknown expression type`, ctx.start?.line);
  }

  private async evalAtom(ctx: ReturnType<AtomExprContext['atom']>): Promise<RuntimeValue> {
    if (ctx instanceof ParenAtomContext) {
      return this.evalExpr(ctx.expr());
    }

    if (ctx instanceof IntegerAtomContext) {
      return mkInteger(parseInt(ctx.INTEGER_LITERAL().getText(), 10));
    }

    if (ctx instanceof RealAtomContext) {
      return mkReal(parseFloat(ctx.REAL_LITERAL().getText()));
    }

    if (ctx instanceof StringAtomContext) {
      const text = ctx.STRING_LITERAL().getText();
      return mkString(text.slice(1, -1)); // Remove quotes
    }

    if (ctx instanceof CharAtomContext) {
      const text = ctx.CHAR_LITERAL().getText();
      return mkChar(text.slice(1, -1)); // Remove quotes
    }

    if (ctx instanceof TrueAtomContext) {
      return mkBoolean(true);
    }

    if (ctx instanceof FalseAtomContext) {
      return mkBoolean(false);
    }

    if (ctx instanceof IdentifierAtomContext) {
      const name = ctx.IDENTIFIER().getText();

      // Special "UserInput" keyword triggers input
      if (name.toUpperCase() === 'USERINPUT') {
        const raw = await this.requestInput(name);
        this.callbacks.onInputComplete();
        return smartParse(raw);
      }

      const val = this.env.get(name);
      if (val instanceof PseudocodeArray) {
        throw new RuntimeError(`'${name}' is an array; use indexing to access elements`, ctx.start?.line);
      }
      return val;
    }

    if (ctx instanceof FunctionCallAtomContext) {
      const name = ctx.IDENTIFIER().getText();
      const args = ctx.argList() ? await this.evalArgList(ctx.argList()!) : [];

      // Check builtins first
      const builtin = getBuiltin(name);
      if (builtin) return builtin(args);

      // Check user-defined functions
      return this.callFunction(name, args, ctx.start?.line);
    }

    if (ctx instanceof ArrayAccess1DAtomContext) {
      const name = ctx.IDENTIFIER().getText();
      const idx = toNumber(await this.evalExpr(ctx.expr()));
      const arr = this.env.getArray(name);
      return arr.get([idx]);
    }

    if (ctx instanceof ArrayAccess2DAtomContext) {
      const name = ctx.IDENTIFIER().getText();
      const i = toNumber(await this.evalExpr(ctx.expr(0)!));
      const j = toNumber(await this.evalExpr(ctx.expr(1)!));
      const arr = this.env.getArray(name);
      return arr.get([i, j]);
    }

    if (ctx instanceof DivFunctionAtomContext) {
      const l = toNumber(await this.evalExpr(ctx.expr(0)!));
      const r = toNumber(await this.evalExpr(ctx.expr(1)!));
      if (r === 0) throw new RuntimeError('Division by zero', ctx.start?.line);
      return mkInteger(Math.trunc(l / r));
    }

    if (ctx instanceof ModFunctionAtomContext) {
      const l = toNumber(await this.evalExpr(ctx.expr(0)!));
      const r = toNumber(await this.evalExpr(ctx.expr(1)!));
      if (r === 0) throw new RuntimeError('Division by zero', ctx.start?.line);
      return mkInteger(((l % r) + r) % r);
    }

    throw new RuntimeError('Unknown atom type');
  }

  private async evalArgList(ctx: { expr(): ExprContext[] }): Promise<RuntimeValue[]> {
    const results: RuntimeValue[] = [];
    for (const e of ctx.expr()) {
      results.push(await this.evalExpr(e));
    }
    return results;
  }
}
