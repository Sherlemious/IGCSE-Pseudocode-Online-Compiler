import {
  ProgramContext,
  StatementContext,
  DeclareStatementContext,
  ConstantStatementContext,
  AssignmentStatementContext,
  SingleAssignmentContext,
  InputStatementContext,
  OutputStatementContext,
  IfStatementContext,
  CaseStatementContext,
  CaseLabelContext,
  ForStatementContext,
  WhileStatementContext,
  RepeatStatementContext,
  ProcedureDeclarationContext,
  FunctionDeclarationContext,
  CallStatementContext,
  MethodCallContext,
  ReturnStatementContext,
  OpenFileStatementContext,
  ReadFileStatementContext,
  WriteFileStatementContext,
  CloseFileStatementContext,
  SeekStatementContext,
  GetRecordStatementContext,
  PutRecordStatementContext,
  TypeDefinitionContext,
  EnumTypeDefContext,
  PointerTypeDefContext,
  SetTypeDefContext,
  RecordTypeDefContext,
  DefineStatementContext,
  ClassDeclarationContext,
  ClassFieldMemberContext,
  ClassProcMemberContext,
  ClassFuncMemberContext,
  DesignatorContext,
  DesignatorPartContext,
  DataTypeContext,
  ParamListContext,
  ArgListContext,
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
  NewInstanceAtomContext,
  AddressOfAtomContext,
  DivFunctionAtomContext,
  ModFunctionAtomContext,
  DesignatorAtomContext,
  IntegerAtomContext,
  RealAtomContext,
  DateAtomContext,
  StringAtomContext,
  CharAtomContext,
  TrueAtomContext,
  FalseAtomContext,
} from '../generated/PseudocodeParser';

import { Environment } from './environment';
import { PseudocodeArray } from './arrays';
import { RecordValue } from './records';
import { copyValue } from './copy';
import { serializeValue, deserializeValue } from './serialize';
import {
  ClassDefinition,
  ClassInstance,
  MethodDefinition,
  ClassFieldDef,
  Visibility,
} from './classes';
import {
  Reference,
  VariableRef,
  ArrayElementRef,
  RecordFieldRef,
  ObjectFieldRef,
  ValueRef,
} from './references';
import {
  RuntimeValue,
  mkInteger,
  mkReal,
  mkString,
  mkChar,
  mkBoolean,
  mkNone,
  mkArray,
  mkRecord,
  mkEnum,
  mkPointer,
  mkSet,
  mkDate,
  mkDateFromParts,
  mkObject,
  toNumber,
  toBoolean,
  toString,
  isNumeric,
  smartParse,
} from './values';
import { getBuiltin, registerFileBuiltins } from './builtins';
import { VirtualFileSystem } from './filesystem';
import type { ServerVirtualFileSystem } from './serverFilesystem';
import { InterpreterCallbacks, RuntimeError, ExecutionCancelledError, DebugVariable, MAX_TRACE_ROWS } from './types';

type AnyFileSystem = VirtualFileSystem | ServerVirtualFileSystem;

class ReturnSignal {
  constructor(public value: RuntimeValue) {}
}

interface ParamDef {
  name: string;
  type: string;
  mode: 'BYVAL' | 'BYREF';
}

interface CallableDefinition {
  params: ParamDef[];
  body: BlockContext;
  returnType?: string;
}

type TypeDef =
  | { kind: 'ENUM'; name: string; members: string[] }
  | { kind: 'POINTER'; targetType: string }
  | { kind: 'SET'; elementType: string }
  | { kind: 'RECORD'; prototype: RecordValue };

interface MethodFrame {
  instance: ClassInstance;
  /** The class in whose body the running method was defined (drives SUPER). */
  definedIn: ClassDefinition;
}

export class Interpreter {
  private env: Environment;
  private callbacks: InterpreterCallbacks;
  private signal: AbortSignal;
  private procedures = new Map<string, CallableDefinition>();
  private functions = new Map<string, CallableDefinition>();
  private types = new Map<string, TypeDef>();
  private enumMembers = new Map<string, RuntimeValue>();
  private classes = new Map<string, ClassDefinition>();
  private methodStack: MethodFrame[] = [];
  private inputResolver: ((value: string) => void) | null = null;
  private iterationCount = 0;
  private lastYieldTime = performance.now();
  private fileSystem: AnyFileSystem;
  private _stepMode = false;
  private stepResolver: (() => void) | null = null;
  private _breakpoints = new Set<number>();
  private _traceMode = false;
  private _traceCount = 0;

  constructor(callbacks: InterpreterCallbacks, signal: AbortSignal, fileSystem?: AnyFileSystem) {
    this.env = new Environment();
    this.callbacks = callbacks;
    this.signal = signal;
    this.fileSystem = fileSystem ?? new VirtualFileSystem();
    registerFileBuiltins((filename) => this.fileSystem.eof(filename));
  }

  private checkCancelled(): void {
    if (this.signal.aborted) throw new ExecutionCancelledError();
  }

  private async yieldControl(): Promise<void> {
    this.iterationCount++;
    // Check time every 100 iterations to minimize performance.now() overhead
    if (this.iterationCount % 100 === 0) {
      const now = performance.now();
      if (now - this.lastYieldTime > 16) {
        this.checkCancelled();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        this.lastYieldTime = performance.now();
      }
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

  setTraceMode(enabled: boolean): void {
    this._traceMode = enabled;
    this._traceCount = 0;
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
    const COMPOSITE_LABELS: Partial<Record<RuntimeValue['type'], string>> = {
      ARRAY: 'Array',
      RECORD: 'Record',
      OBJECT: 'Object',
      POINTER: 'Pointer',
      SET: 'Set',
    };
    for (const [name, entry] of this.env.getAllVariables()) {
      const label = COMPOSITE_LABELS[entry.value.type];
      vars.push({
        name,
        value: label ?? toString(entry.value),
        type: entry.value.type,
        constant: entry.constant,
      });
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

  private async requestInput(variableName: string, prompt?: string): Promise<string> {
    this.checkCancelled();
    this.callbacks.onInputRequest(variableName, prompt);
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
    await this.dispatchStatement(ctx);
    // Record a trace row (variable state *after* the statement ran) when tracing.
    if (this._traceMode && line !== undefined && this._traceCount < MAX_TRACE_ROWS) {
      this._traceCount++;
      this.callbacks.onTrace?.(line, this.snapshotVariables());
    }
  }

  private async dispatchStatement(ctx: StatementContext): Promise<void> {
    if (ctx.declareStatement()) return this.visitDeclare(ctx.declareStatement()!);
    if (ctx.constantStatement()) return this.visitConstant(ctx.constantStatement()!);
    if (ctx.typeDefinition()) return this.visitTypeDefinition(ctx.typeDefinition()!);
    if (ctx.defineStatement()) return this.visitDefine(ctx.defineStatement()!);
    if (ctx.classDeclaration()) return this.visitClassDeclaration(ctx.classDeclaration()!);
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
    if (ctx.methodCallStatement()) {
      await this.execMethodCall(ctx.methodCallStatement()!.methodCall());
      return;
    }
    if (ctx.returnStatement()) return this.visitReturn(ctx.returnStatement()!);
    if (ctx.openFileStatement()) return this.visitOpenFile(ctx.openFileStatement()!);
    if (ctx.readFileStatement()) return this.visitReadFile(ctx.readFileStatement()!);
    if (ctx.writeFileStatement()) return this.visitWriteFile(ctx.writeFileStatement()!);
    if (ctx.closeFileStatement()) return this.visitCloseFile(ctx.closeFileStatement()!);
    if (ctx.seekStatement()) return this.visitSeek(ctx.seekStatement()!);
    if (ctx.getRecordStatement()) return this.visitGetRecord(ctx.getRecordStatement()!);
    if (ctx.putRecordStatement()) return this.visitPutRecord(ctx.putRecordStatement()!);
  }

  // ─── DECLARE ────────────────────────────────────────────────────

  private async visitDeclare(ctx: DeclareStatementContext): Promise<void> {
    await this.declareInto(ctx, (name, value) => this.env.declare(name, value));
  }

  /**
   * Execute a DECLARE statement, sending each declared name/value to `define`.
   * Reused for normal declarations and for the fields of record TYPEs.
   */
  private async declareInto(
    ctx: DeclareStatementContext,
    define: (name: string, value: RuntimeValue) => void,
  ): Promise<void> {
    const exprs = ctx.expr();

    if (ctx.ARRAY()) {
      const elemTypeCtx = ctx.dataType();
      const elemTypeName = elemTypeCtx.getText();
      const factory = () => this.defaultForDataTypeSync(elemTypeCtx);
      if (ctx.COMMA()) {
        // 2D: DECLARE x : ARRAY[l1:u1, l2:u2] OF type (single identifier only)
        const name = ctx.identifier()!.getText();
        const l1 = toNumber(await this.evalExpr(exprs[0]));
        const u1 = toNumber(await this.evalExpr(exprs[1]));
        const l2 = toNumber(await this.evalExpr(exprs[2]));
        const u2 = toNumber(await this.evalExpr(exprs[3]));
        const arr = new PseudocodeArray(
          [{ lower: l1, upper: u1 }, { lower: l2, upper: u2 }],
          elemTypeName,
          factory,
        );
        define(name, mkArray(arr));
      } else {
        // 1D: DECLARE x, y, ... : ARRAY[l:u] OF type
        const lower = toNumber(await this.evalExpr(exprs[0]));
        const upper = toNumber(await this.evalExpr(exprs[1]));
        for (const id of ctx.identifierList()!.identifier()) {
          const arr = new PseudocodeArray([{ lower, upper }], elemTypeName, factory);
          define(id.getText(), mkArray(arr));
        }
      }
    } else {
      const typeCtx = ctx.dataType();
      for (const id of ctx.identifierList()!.identifier()) {
        define(id.getText(), await this.defaultForDataType(typeCtx));
      }
    }
  }

  private async defaultForDataType(ctx: DataTypeContext): Promise<RuntimeValue> {
    if (ctx.ARRAY()) {
      const exprs = ctx.expr();
      const elemCtx = ctx.dataType()!;
      const factory = () => this.defaultForDataTypeSync(elemCtx);
      let bounds: { lower: number; upper: number }[];
      if (exprs.length >= 4) {
        bounds = [
          { lower: toNumber(await this.evalExpr(exprs[0])), upper: toNumber(await this.evalExpr(exprs[1])) },
          { lower: toNumber(await this.evalExpr(exprs[2])), upper: toNumber(await this.evalExpr(exprs[3])) },
        ];
      } else if (exprs.length >= 2) {
        bounds = [
          { lower: toNumber(await this.evalExpr(exprs[0])), upper: toNumber(await this.evalExpr(exprs[1])) },
        ];
      } else {
        bounds = [{ lower: 1, upper: 10000 }];
      }
      return mkArray(new PseudocodeArray(bounds, elemCtx.getText(), factory));
    }
    return this.defaultForDataTypeSync(ctx);
  }

  private defaultForDataTypeSync(ctx: DataTypeContext): RuntimeValue {
    if (ctx.ARRAY()) return mkNone(); // arrays of arrays are not supported
    return this.defaultValueForTypeName(ctx.getText());
  }

  private defaultValueForTypeName(typeName: string): RuntimeValue {
    switch (typeName.toUpperCase()) {
      case 'INTEGER': return mkInteger(0);
      case 'REAL': return mkReal(0.0);
      case 'STRING': return mkString('');
      case 'CHAR': return mkChar(' ');
      case 'BOOLEAN': return mkBoolean(false);
      case 'DATE': return mkDate(Date.UTC(1900, 0, 1));
      default: {
        const td = this.types.get(typeName.toUpperCase());
        if (!td) return mkNone();
        switch (td.kind) {
          case 'RECORD': return mkRecord(td.prototype.clone(copyValue));
          case 'POINTER': return mkPointer(null);
          case 'SET': return mkSet(typeName, new Set());
          case 'ENUM': return mkNone();
        }
      }
    }
  }

  // ─── CONSTANT ───────────────────────────────────────────────────

  private async visitConstant(ctx: ConstantStatementContext): Promise<void> {
    const name = ctx.identifier().getText();
    const value = await this.evalExpr(ctx.expr());
    this.env.declareConstant(name, value);
  }

  // ─── TYPE / DEFINE (A Level user-defined types) ─────────────────

  private async visitTypeDefinition(ctx: TypeDefinitionContext): Promise<void> {
    if (ctx instanceof EnumTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      const members = ctx.identifierList().identifier().map((t) => t.getText());
      this.types.set(name.toUpperCase(), { kind: 'ENUM', name, members });
      members.forEach((m, i) => this.enumMembers.set(m.toUpperCase(), mkEnum(name, m, i)));
      return;
    }
    if (ctx instanceof PointerTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      this.types.set(name.toUpperCase(), { kind: 'POINTER', targetType: ctx.dataType().getText() });
      return;
    }
    if (ctx instanceof SetTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      this.types.set(name.toUpperCase(), { kind: 'SET', elementType: ctx.dataType().getText() });
      return;
    }
    if (ctx instanceof RecordTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      const prototype = new RecordValue(name);
      for (const d of ctx.declareStatement()) {
        await this.declareInto(d, (fieldName, value) => prototype.defineField(fieldName, value));
      }
      this.types.set(name.toUpperCase(), { kind: 'RECORD', prototype });
      return;
    }
  }

  private async visitDefine(ctx: DefineStatementContext): Promise<void> {
    const varName = ctx.identifier().getText();
    const typeName = ctx.IDENTIFIER()!.getText();
    const elements = new Set<string>();
    const list = ctx.exprList();
    if (list) {
      for (const e of list.expr()) {
        elements.add(toString(await this.evalExpr(e)));
      }
    }
    this.env.declare(varName, mkSet(typeName, elements));
  }

  // ─── CLASS (A Level OOP) ────────────────────────────────────────

  private async visitClassDeclaration(ctx: ClassDeclarationContext): Promise<void> {
    const name = ctx.IDENTIFIER(0)!.getText();
    let parent: ClassDefinition | null = null;
    if (ctx.INHERITS()) {
      const parentName = ctx.IDENTIFIER(1)!.getText();
      parent = this.classes.get(parentName.toUpperCase()) ?? null;
      if (!parent) {
        throw new RuntimeError(
          `Class '${parentName}' is not defined — define the parent class before '${name}'`,
          ctx.start?.line,
        );
      }
    }

    const fields: ClassFieldDef[] = [];
    const methods = new Map<string, MethodDefinition>();

    for (const member of ctx.classMember()) {
      if (member instanceof ClassFieldMemberContext) {
        const visibility: Visibility = member.PRIVATE() ? 'PRIVATE' : 'PUBLIC';
        for (const id of member.identifierList().identifier()) {
          fields.push({ name: id.getText(), dataTypeCtx: member.dataType(), visibility });
        }
      } else if (member instanceof ClassProcMemberContext) {
        const proc = member.procedureDeclaration();
        const methodName = proc.identifier().getText();
        methods.set(methodName.toUpperCase(), {
          name: methodName,
          params: this.extractParams(proc.paramList()),
          body: proc.block(),
          isFunction: false,
          visibility: member.PRIVATE() ? 'PRIVATE' : 'PUBLIC',
        });
      } else if (member instanceof ClassFuncMemberContext) {
        const func = member.functionDeclaration();
        const methodName = func.identifier().getText();
        methods.set(methodName.toUpperCase(), {
          name: methodName,
          params: this.extractParams(func.paramList()),
          body: func.block(),
          returnType: func.dataType().getText(),
          isFunction: true,
          visibility: member.PRIVATE() ? 'PRIVATE' : 'PUBLIC',
        });
      }
    }

    this.classes.set(name.toUpperCase(), new ClassDefinition(name, parent, fields, methods));
  }

  private async instantiateClass(
    className: string,
    argListCtx: ArgListContext | null,
    line?: number,
  ): Promise<RuntimeValue> {
    const classDef = this.classes.get(className.toUpperCase());
    if (!classDef) {
      throw new RuntimeError(`Class '${className}' is not defined`, line);
    }
    const instance = new ClassInstance(classDef);
    for (const f of classDef.allFields()) {
      instance.fields.set(f.name.toUpperCase(), await this.defaultForDataType(f.dataTypeCtx));
    }
    const ctor = classDef.findMethod('NEW');
    if (ctor) {
      await this.invokeMethodOn(instance, ctor, argListCtx, line);
    }
    return mkObject(instance);
  }

  private async invokeSuperMethod(
    memberName: string,
    argListCtx: ArgListContext | null,
    line?: number,
  ): Promise<RuntimeValue> {
    const frame = this.methodStack[this.methodStack.length - 1];
    if (!frame) {
      throw new RuntimeError('SUPER can only be used inside a class method', line);
    }
    const parent = frame.definedIn.parent;
    if (!parent) {
      throw new RuntimeError(
        `Class '${frame.definedIn.name}' does not inherit from another class, so SUPER cannot be used`,
        line,
      );
    }
    const found = parent.findMethod(memberName);
    if (!found) {
      throw new RuntimeError(`Class '${parent.name}' has no method '${memberName}'`, line);
    }
    return this.invokeMethodOn(frame.instance, found, argListCtx, line);
  }

  private async invokeMethodOnRef(
    receiver: Reference,
    memberName: string,
    argListCtx: ArgListContext | null,
    line?: number,
  ): Promise<RuntimeValue> {
    const val = receiver.get();
    if (val.type !== 'OBJECT') {
      throw new RuntimeError(
        `${receiver.describe()} is not an object — only objects created with NEW have methods`,
        line,
      );
    }
    const instance = val.value as ClassInstance;
    const found = instance.classDef.findMethod(memberName);
    if (!found) {
      throw new RuntimeError(`Class '${instance.classDef.name}' has no method '${memberName}'`, line);
    }
    this.assertAccessible(found.owner, memberName, found.method.visibility, 'method', line);
    return this.invokeMethodOn(instance, found, argListCtx, line);
  }

  private async invokeMethodOn(
    instance: ClassInstance,
    found: { method: MethodDefinition; owner: ClassDefinition },
    argListCtx: ArgListContext | null,
    line?: number,
  ): Promise<RuntimeValue> {
    const localEnv = new Environment(this.env);
    // Bind every instance field by name so method bodies read/write them directly
    for (const f of instance.classDef.allFields()) {
      localEnv.declareRef(f.name, new ObjectFieldRef(instance, f.name, f.name));
    }
    await this.bindParams(localEnv, found.method.params, argListCtx, found.method.name, line);

    const prevEnv = this.env;
    this.env = localEnv;
    this.methodStack.push({ instance, definedIn: found.owner });
    try {
      await this.visitBlock(found.method.body);
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      throw e;
    } finally {
      this.env = prevEnv;
      this.methodStack.pop();
    }
    return mkNone();
  }

  private assertAccessible(
    owner: ClassDefinition,
    memberName: string,
    visibility: Visibility,
    kind: 'method' | 'property',
    line?: number,
  ): void {
    if (visibility === 'PUBLIC') return;
    const frame = this.methodStack[this.methodStack.length - 1];
    if (frame && (frame.definedIn.isInChainOf(owner) || owner.isInChainOf(frame.definedIn))) return;
    throw new RuntimeError(
      `Cannot access private ${kind} '${memberName}' of class '${owner.name}' from outside the class`,
      line,
    );
  }

  private assertFieldAccessible(classDef: ClassDefinition, fieldName: string, line?: number): void {
    const field = classDef.findField(fieldName);
    if (!field || field.visibility === 'PUBLIC') return;
    const key = fieldName.toUpperCase();
    let owner: ClassDefinition | null = classDef;
    while (owner && !owner.fields.some((f) => f.name.toUpperCase() === key)) {
      owner = owner.parent;
    }
    this.assertAccessible(owner ?? classDef, fieldName, 'PRIVATE', 'property', line);
  }

  // ─── Designators ────────────────────────────────────────────────

  /** Resolve a designator to an assignable reference (lvalue). */
  private async resolveDesignator(ctx: DesignatorContext): Promise<Reference> {
    const parts = ctx.designatorPart();
    const line = ctx.start?.line;
    const headId = ctx.identifier();

    if (!headId) {
      // SUPER head: only meaningful when immediately calling a superclass method
      const first = parts[0];
      if (!first || !first.DOT() || !first.LPAREN()) {
        throw new RuntimeError('SUPER must be followed by a method call, e.g. SUPER.NEW(...)', line);
      }
      const memberName = first.memberName()!.getText();
      const result = await this.invokeSuperMethod(memberName, first.argList() ?? null, line);
      const label = `SUPER.${memberName}(...)`;
      return this.walkParts(new ValueRef(result, label), label, parts.slice(1), line);
    }

    const name = headId.getText();
    // Auto-create arrays for index-first access on undeclared names (IGCSE behavior)
    const firstPart = parts[0];
    if (firstPart && firstPart.LBRACKET() && !this.env.has(name)) {
      const dims = Math.min(firstPart.expr().length, 2) as 1 | 2;
      this.env.getOrCreateArray(name, dims);
    }
    return this.walkParts(new VariableRef(this.env, name), name, parts, line);
  }

  private async walkParts(
    start: Reference,
    startLabel: string,
    parts: DesignatorPartContext[],
    line: number | undefined,
  ): Promise<Reference> {
    let ref = start;
    let label = startLabel;
    for (const part of parts) {
      if (part.CARET()) {
        const val = ref.get();
        if (val.type !== 'POINTER') {
          throw new RuntimeError(
            `${ref.describe()} is not a pointer — only pointer variables can be dereferenced with ^`,
            line,
          );
        }
        const target = val.value as Reference | null;
        if (!target) {
          throw new RuntimeError(
            `${ref.describe()} does not point anywhere yet — assign it an address first, e.g. ptr <- ^someVariable`,
            line,
          );
        }
        label = `${label}^`;
        ref = target;
      } else if (part.LBRACKET()) {
        const indices: number[] = [];
        for (const e of part.expr()) {
          indices.push(toNumber(await this.evalExpr(e)));
        }
        label = `${label}[${indices.join(', ')}]`;
        ref = new ArrayElementRef(ref, indices, label);
      } else {
        const memberName = part.memberName()!.getText();
        if (part.LPAREN()) {
          const result = await this.invokeMethodOnRef(ref, memberName, part.argList() ?? null, line);
          label = `${label}.${memberName}(...)`;
          ref = new ValueRef(result, label);
        } else {
          const val = ref.get();
          if (val.type === 'OBJECT') {
            const instance = val.value as ClassInstance;
            this.assertFieldAccessible(instance.classDef, memberName, line);
            label = `${label}.${memberName}`;
            ref = new ObjectFieldRef(instance, memberName, label);
          } else {
            label = `${label}.${memberName}`;
            ref = new RecordFieldRef(ref, memberName, label);
          }
        }
      }
    }
    return ref;
  }

  /** Evaluate a designator to a value (rvalue), with USERINPUT and enum-member fallbacks. */
  private async evalDesignator(ctx: DesignatorContext): Promise<RuntimeValue> {
    const parts = ctx.designatorPart();
    const headId = ctx.identifier();

    if (headId && parts.length === 0) {
      const name = headId.getText();

      // Special "UserInput" keyword triggers input
      if (name.toUpperCase() === 'USERINPUT') {
        const raw = await this.requestInput(name);
        this.callbacks.onInputComplete();
        return smartParse(raw);
      }

      // Enum members are readable as bare identifiers, e.g. ThisSeason <- Spring
      if (!this.env.has(name)) {
        const enumVal = this.enumMembers.get(name.toUpperCase());
        if (enumVal) return enumVal;
      }

      return this.env.get(name);
    }

    return (await this.resolveDesignator(ctx)).get();
  }

  // ─── Assignment ─────────────────────────────────────────────────

  private async visitAssignment(ctx: AssignmentStatementContext): Promise<void> {
    for (const sa of ctx.singleAssignment()) {
      await this.visitSingleAssignment(sa);
    }
  }

  private async visitSingleAssignment(ctx: SingleAssignmentContext): Promise<void> {
    const ref = await this.resolveDesignator(ctx.designator());
    const value = await this.evalExpr(ctx.expr());
    ref.set(copyValue(value));
  }

  // ─── INPUT ──────────────────────────────────────────────────────

  private async visitInput(ctx: InputStatementContext): Promise<void> {
    const desig = ctx.designator();
    const promptToken = ctx.STRING_LITERAL();
    const prompt = promptToken ? promptToken.getText().slice(1, -1) : undefined;
    const raw = await this.requestInput(desig.getText(), prompt);
    this.callbacks.onInputComplete();
    const ref = await this.resolveDesignator(desig);
    ref.set(smartParse(raw));
  }

  // ─── OUTPUT ─────────────────────────────────────────────────────

  private async visitOutput(ctx: OutputStatementContext): Promise<void> {
    const parts: string[] = [];
    const exprList = ctx.exprList();
    for (const e of exprList.expr()) {
      const val = await this.evalExpr(e);
      if (val.type === 'ARRAY') {
        throw new RuntimeError(
          `'${e.getText()}' is an array; use indexing to access elements`,
          ctx.start?.line,
        );
      }
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
    const subject = await this.evalDesignator(ctx.designator());
    if (subject.type === 'ARRAY') {
      throw new RuntimeError('CASE cannot operate on array', ctx.start?.line);
    }

    for (const clause of ctx.caseClause()) {
      for (const labelCtx of clause.caseLabel()) {
        if (await this.caseLabelMatches(subject, labelCtx)) {
          await this.visitBlock(clause.block());
          return;
        }
      }
    }

    // OTHERWISE
    if (ctx.OTHERWISE() && ctx.block()) {
      await this.visitBlock(ctx.block()!);
    }
  }

  private async caseLabelMatches(subject: RuntimeValue, label: CaseLabelContext): Promise<boolean> {
    const exprs = label.expr();
    const first = await this.evalExpr(exprs[0]);
    if (exprs.length === 1) {
      return this.valuesEqual(subject, first);
    }
    // Range label: <value1> TO <value2> (inclusive)
    const second = await this.evalExpr(exprs[1]);
    const s = this.ordinalOf(subject);
    return s >= this.ordinalOf(first) && s <= this.ordinalOf(second);
  }

  /** Numeric position of a value for range comparisons (chars by code, enums by ordinal). */
  private ordinalOf(v: RuntimeValue): number {
    if (v.type === 'CHAR') return (v.value as string).charCodeAt(0);
    if (v.type === 'ENUM') return v.ordinal!;
    return toNumber(v);
  }

  private valuesEqual(a: RuntimeValue, b: RuntimeValue): boolean {
    if (a.type === 'ENUM' && b.type === 'ENUM') {
      return a.enumName === b.enumName && a.ordinal === b.ordinal;
    }
    if (a.type === 'DATE' && b.type === 'DATE') return a.value === b.value;
    if (isNumeric(a) && isNumeric(b)) return toNumber(a) === toNumber(b);
    return toString(a) === toString(b);
  }

  // ─── FOR ────────────────────────────────────────────────────────

  private async visitFor(ctx: ForStatementContext): Promise<void> {
    const varName = ctx.identifier(0)!.getText();
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
    const name = ctx.identifier().getText();
    const params = this.extractParams(ctx.paramList());
    this.procedures.set(name.toUpperCase(), { params, body: ctx.block() });
  }

  private async visitFunctionDecl(ctx: FunctionDeclarationContext): Promise<void> {
    const name = ctx.identifier().getText();
    const params = this.extractParams(ctx.paramList());
    const returnType = ctx.dataType().getText();
    this.functions.set(name.toUpperCase(), { params, body: ctx.block(), returnType });
  }

  private extractParams(ctx: ParamListContext | null): ParamDef[] {
    if (!ctx) return [];
    // BYREF/BYVAL is sticky: it applies to subsequent parameters until changed (9618 spec)
    let mode: 'BYVAL' | 'BYREF' = 'BYVAL';
    return ctx.param().map((p) => {
      if (p.BYREF()) mode = 'BYREF';
      else if (p.BYVAL()) mode = 'BYVAL';
      return {
        name: p.identifier().getText(),
        type: p.dataType().getText(),
        mode,
      };
    });
  }

  // ─── CALL ───────────────────────────────────────────────────────

  private async visitCall(ctx: CallStatementContext): Promise<void> {
    const mc = ctx.methodCall();
    if (mc) {
      await this.execMethodCall(mc);
      return;
    }
    const name = ctx.identifier()!.getText();
    await this.callProcedure(name, ctx.argList() ?? null, ctx.start?.line);
  }

  private async execMethodCall(ctx: MethodCallContext): Promise<RuntimeValue> {
    const line = ctx.start?.line;
    const memberName = ctx.memberName().getText();
    const parts = ctx.designatorPart();
    const headId = ctx.identifier();

    if (!headId) {
      if (parts.length > 0) {
        throw new RuntimeError('SUPER must be followed directly by a method call, e.g. SUPER.NEW(...)', line);
      }
      return this.invokeSuperMethod(memberName, ctx.argList() ?? null, line);
    }

    const name = headId.getText();
    const receiver = await this.walkParts(new VariableRef(this.env, name), name, parts, line);
    return this.invokeMethodOnRef(receiver, memberName, ctx.argList() ?? null, line);
  }

  private async bindParams(
    localEnv: Environment,
    params: ParamDef[],
    argListCtx: ArgListContext | null,
    calleeName: string,
    line?: number,
  ): Promise<void> {
    const argExprs = argListCtx?.expr() ?? [];
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      const argExpr = argExprs[i];
      if (p.mode === 'BYREF') {
        if (!argExpr) {
          throw new RuntimeError(`'${calleeName}' needs an argument for BYREF parameter '${p.name}'`, line);
        }
        const desig = this.designatorFromExpr(argExpr);
        if (!desig) {
          throw new RuntimeError(
            `BYREF parameter '${p.name}' of '${calleeName}' needs a variable, array element or field as its argument (not an expression)`,
            line,
          );
        }
        localEnv.declareRef(p.name, await this.resolveDesignator(desig));
      } else {
        const value = argExpr ? copyValue(await this.evalExpr(argExpr)) : mkNone();
        localEnv.declare(p.name, value);
      }
    }
  }

  private designatorFromExpr(expr: ExprContext): DesignatorContext | null {
    if (expr instanceof AtomExprContext) {
      const atom = expr.atom();
      if (atom instanceof DesignatorAtomContext) return atom.designator();
    }
    return null;
  }

  /** Inside a method body, bare calls may target sibling methods of the same instance. */
  private currentInstanceMethod(name: string): { instance: ClassInstance; found: { method: MethodDefinition; owner: ClassDefinition } } | null {
    const frame = this.methodStack[this.methodStack.length - 1];
    if (!frame) return null;
    const found = frame.instance.classDef.findMethod(name);
    return found ? { instance: frame.instance, found } : null;
  }

  private async callProcedure(name: string, argListCtx: ArgListContext | null, line?: number): Promise<void> {
    const proc = this.procedures.get(name.toUpperCase());
    if (!proc) {
      const sibling = this.currentInstanceMethod(name);
      if (sibling) {
        await this.invokeMethodOn(sibling.instance, sibling.found, argListCtx, line);
        return;
      }
      throw new RuntimeError(`Procedure '${name}' is not defined`, line);
    }

    const localEnv = new Environment(this.env);
    await this.bindParams(localEnv, proc.params, argListCtx, name, line);

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

  private async callFunction(name: string, argListCtx: ArgListContext | null, line?: number): Promise<RuntimeValue> {
    const func = this.functions.get(name.toUpperCase());
    if (!func) {
      const sibling = this.currentInstanceMethod(name);
      if (sibling) {
        return this.invokeMethodOn(sibling.instance, sibling.found, argListCtx, line);
      }
      throw new RuntimeError(`Function '${name}' is not defined`, line);
    }

    const localEnv = new Environment(this.env);
    await this.bindParams(localEnv, func.params, argListCtx, name, line);

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
    let mode: 'READ' | 'WRITE' | 'APPEND' | 'RANDOM';
    if (modeCtx.READ_MODE()) mode = 'READ';
    else if (modeCtx.WRITE_MODE()) mode = 'WRITE';
    else if (modeCtx.APPEND_MODE()) mode = 'APPEND';
    else mode = 'RANDOM';
    this.fileSystem.openFile(filename, mode);
  }

  private async visitReadFile(ctx: ReadFileStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    const line = this.fileSystem.readFile(filename);
    const ref = await this.resolveDesignator(ctx.designator());
    ref.set(smartParse(line));
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

  private async visitSeek(ctx: SeekStatementContext): Promise<void> {
    const exprs = ctx.expr();
    const filename = toString(await this.evalExpr(exprs[0]));
    const address = toNumber(await this.evalExpr(exprs[1]));
    this.fileSystem.seek(filename, address);
  }

  private async visitGetRecord(ctx: GetRecordStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    const data = this.fileSystem.getRecord(filename);
    const ref = await this.resolveDesignator(ctx.designator());
    ref.set(deserializeValue(data));
  }

  private async visitPutRecord(ctx: PutRecordStatementContext): Promise<void> {
    const filename = toString(await this.evalExpr(ctx.expr()));
    const ref = await this.resolveDesignator(ctx.designator());
    this.fileSystem.putRecord(filename, serializeValue(ref.get()));
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
        ? mkInteger(result)
        : mkReal(result);
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
          return left.type === 'INTEGER' && right.type === 'INTEGER' ? mkInteger(res) : mkReal(res);
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
      // Enum ordinal arithmetic, e.g. Season + 1 → the next season (9618 guide)
      if (left.type === 'ENUM' && isNumeric(right)) {
        const delta = (op === '+' ? 1 : -1) * toNumber(right);
        return this.enumAdvance(left, delta, ctx.start?.line);
      }
      const l = toNumber(left);
      const r = toNumber(right);
      const result = op === '+' ? l + r : l - r;
      return left.type === 'INTEGER' && right.type === 'INTEGER' ? mkInteger(result) : mkReal(result);
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

      const bothDates = left.type === 'DATE' && right.type === 'DATE';
      const bothEnums = left.type === 'ENUM' && right.type === 'ENUM';
      if (bothDates || bothEnums || (isNumeric(left) && isNumeric(right))) {
        const l = bothEnums ? left.ordinal! : toNumber(left);
        const r = bothEnums ? right.ordinal! : toNumber(right);
        switch (op) {
          case '=':
            return mkBoolean(l === r);
          case '<>':
            return mkBoolean(l !== r);
          case '<':
            return mkBoolean(l < r);
          case '>':
            return mkBoolean(l > r);
          case '<=':
            return mkBoolean(l <= r);
          case '>=':
            return mkBoolean(l >= r);
        }
      } else {
        const l = toString(left);
        const r = toString(right);
        switch (op) {
          case '=':
            return mkBoolean(l === r);
          case '<>':
            return mkBoolean(l !== r);
          case '<':
            return mkBoolean(l < r);
          case '>':
            return mkBoolean(l > r);
          case '<=':
            return mkBoolean(l <= r);
          case '>=':
            return mkBoolean(l >= r);
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

  private enumAdvance(v: RuntimeValue, delta: number, line?: number): RuntimeValue {
    const td = this.types.get(v.enumName!.toUpperCase());
    if (!td || td.kind !== 'ENUM') {
      throw new RuntimeError(`Enum type '${v.enumName}' is not defined`, line);
    }
    const idx = v.ordinal! + delta;
    if (idx < 0 || idx >= td.members.length) {
      throw new RuntimeError(
        `'${toString(v)}' ${delta >= 0 ? '+' : '-'} ${Math.abs(delta)} goes outside the values of '${td.name}'`,
        line,
      );
    }
    return mkEnum(td.name, td.members[idx], idx);
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

    if (ctx instanceof DateAtomContext) {
      const [d, m, y] = ctx.DATE_LITERAL().getText().split('/').map(Number);
      return mkDateFromParts(d, m, y);
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

    if (ctx instanceof DesignatorAtomContext) {
      return this.evalDesignator(ctx.designator());
    }

    if (ctx instanceof FunctionCallAtomContext) {
      const name = ctx.identifier().getText();

      // Check builtins first
      const builtin = getBuiltin(name);
      if (builtin) {
        const args = ctx.argList() ? await this.evalArgList(ctx.argList()!) : [];
        return builtin(args);
      }

      // Check user-defined functions
      return this.callFunction(name, ctx.argList() ?? null, ctx.start?.line);
    }

    if (ctx instanceof NewInstanceAtomContext) {
      return this.instantiateClass(ctx.IDENTIFIER().getText(), ctx.argList() ?? null, ctx.start?.line);
    }

    if (ctx instanceof AddressOfAtomContext) {
      return mkPointer(await this.resolveDesignator(ctx.designator()));
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
