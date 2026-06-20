// Pseudocode → Python converter.
//
// Walks the same ANTLR parse tree the interpreter executes, but emits idiomatic
// Python source instead of running it. Synchronous; mirrors the dispatch shape of
// core/interpreter.ts so the two stay easy to keep in sync.
//
// Coverage is the full IGCSE + A Level superset. Constructs with no clean Python
// equivalent (pointers, random-access files, scalar BYREF) convert best-effort and
// leave an explanatory comment rather than failing.

import { parse } from '../parser';
import { PseudocodeError } from '../core/types';
import { PY_HELPERS, FILE_HELPERS, FILE_REGISTRY } from './pythonHelpers';
import {
  ProgramContext,
  StatementContext,
  BlockContext,
  DeclareStatementContext,
  ConstantStatementContext,
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
  AssignmentStatementContext,
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
  ParamListContext,
  CallStatementContext,
  MethodCallContext,
  ReturnStatementContext,
  OpenFileStatementContext,
  ReadFileStatementContext,
  WriteFileStatementContext,
  CloseFileStatementContext,
  DesignatorContext,
  DesignatorPartContext,
  DataTypeContext,
  ArgListContext,
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

// ─── Python operator precedence (higher binds tighter) ──────────────────────
// Used to add the minimum parentheses needed so the emitted Python re-parses into
// the same tree the pseudocode produced.
const P_OR = 1;
const P_AND = 2;
const P_NOT = 3;
const P_CMP = 4;
const P_ADD = 6; // + - (and string concat, which we map to +)
const P_MUL = 7; // * / % (DIV becomes a function call, so it is atom-level)
const P_NEG = 8; // unary minus
const P_POW = 9; // ** (right-associative)
const P_ATOM = 100;

const PY_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for',
  'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or',
  'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'match', 'case',
]);

/** Make a pseudocode identifier safe to use as a Python name. */
function pyName(name: string): string {
  return PY_KEYWORDS.has(name) ? `${name}_` : name;
}

/** Render a string/char body as a safe Python string literal. */
function pyStr(content: string): string {
  return JSON.stringify(content);
}

const SCALAR_DEFAULTS: Record<string, string> = {
  INTEGER: '0',
  REAL: '0.0',
  STRING: '""',
  CHAR: '" "',
  BOOLEAN: 'False',
};

const PY_ANNOTATIONS: Record<string, string> = {
  INTEGER: 'int',
  REAL: 'float',
  STRING: 'str',
  CHAR: 'str',
  BOOLEAN: 'bool',
  DATE: 'datetime.date',
};

type TypeKind = 'RECORD' | 'ENUM' | 'POINTER' | 'SET' | 'CLASS';

interface FieldInfo {
  /** Attribute used on `self`, with the leading underscore already applied for PRIVATE. */
  access: string;
}

interface ClassInfo {
  fields: Map<string, FieldInfo>;
  methods: Set<string>;
  parent?: string;
}

interface ArrayBound {
  lower: string;
  lower2?: string;
}

export interface PythonConversion {
  code: string;
  errors: PseudocodeError[];
}

export function convertToPython(source: string): PythonConversion {
  if (!source.trim()) return { code: '', errors: [] };
  const { tree, errors } = parse(source);
  if (errors.length > 0 || !tree) {
    return { code: '', errors };
  }
  return { code: new PythonConverter().convert(tree), errors: [] };
}

class PythonConverter {
  private lines: string[] = [];
  private indentLevel = 0;

  private usedImports = new Set<string>();
  private usedHelpers = new Set<string>();
  private usedFileHelpers = new Set<string>();
  private notes = new Set<string>();

  /** Names that exist as variables somewhere — used to tell vars from bare enum members. */
  private varNames = new Set<string>();
  /** Module-level names that a function rebinding them would need `global` for. */
  private globalVars = new Set<string>();

  private typeKinds = new Map<string, TypeKind>();
  private typeNames = new Map<string, string>(); // upper → original casing
  private enumMembers = new Map<string, { enumName: string; member: string }>();
  private classes = new Map<string, ClassInfo>();

  private varTypes = new Map<string, string>(); // var name → scalar type (upper)
  private arrayElemTypes = new Map<string, string>();
  private arrayBounds = new Map<string, ArrayBound>();
  // Records and arrays have value semantics (deep-copied on assignment); class
  // instances stay references, like Python. Only the copyable kinds are tracked.
  private varKinds = new Map<string, 'RECORD' | 'ARRAY'>();

  private classCtx: ClassInfo | null = null;

  convert(tree: ProgramContext): string {
    this.preScan(tree);
    for (const stmt of tree.statement()) {
      this.emitStatement(stmt);
    }
    return this.assemble();
  }

  // ─── Output buffer ────────────────────────────────────────────────────────

  private get pad(): string {
    return '    '.repeat(this.indentLevel);
  }

  private line(text: string): void {
    for (const l of text.split('\n')) {
      this.lines.push(l === '' ? '' : this.pad + l);
    }
  }

  private blank(): void {
    if (this.lines.length === 0) return;
    if (this.lines[this.lines.length - 1] === '') return;
    this.lines.push('');
  }

  private assemble(): string {
    const out: string[] = [];

    if (this.notes.size > 0) {
      for (const note of [...this.notes].sort()) out.push(`# ${note}`);
      out.push('');
    }

    if (this.usedImports.size > 0) {
      for (const imp of [...this.usedImports].sort()) out.push(imp);
      out.push('');
    }

    const defs: string[] = [];
    if (this.usedFileHelpers.size > 0) {
      defs.push(FILE_REGISTRY);
      for (const name of ['OPENFILE', 'READFILE', 'WRITEFILE', 'CLOSEFILE', 'EOF']) {
        if (this.usedFileHelpers.has(name)) defs.push(FILE_HELPERS[name]);
      }
    }
    for (const name of ['DIV', 'ROUND', 'SUBSTRING', 'MID', 'LEFT', 'RIGHT', 'STRING_TO_NUM', 'IS_NUM']) {
      if (this.usedHelpers.has(name)) defs.push(PY_HELPERS[name].code);
    }
    if (defs.length > 0) {
      out.push(defs.join('\n\n'));
      out.push('');
    }

    out.push(...this.lines);
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  }

  private useHelper(name: string): void {
    this.usedHelpers.add(name);
    for (const imp of PY_HELPERS[name].imports ?? []) this.usedImports.add(imp);
  }

  private useFileHelper(name: string): void {
    this.usedFileHelpers.add(name);
  }

  // ─── Pre-scan: collect names before emitting ───────────────────────────────

  private preScan(tree: ProgramContext): void {
    // Module-level rebindable names.
    for (const stmt of tree.statement()) {
      if (stmt.declareStatement()) for (const n of declaredNames(stmt.declareStatement()!)) this.globalVars.add(n);
      if (stmt.constantStatement()) this.globalVars.add(stmt.constantStatement()!.identifier().getText());
      if (stmt.forStatement()) this.globalVars.add(stmt.forStatement()!.identifier(0)!.getText());
      if (stmt.assignmentStatement()) {
        for (const sa of stmt.assignmentStatement()!.singleAssignment()) {
          const d = sa.designator();
          if (isBareDesignator(d)) this.globalVars.add(d.identifier()!.getText());
        }
      }
      if (stmt.inputStatement()) {
        const d = stmt.inputStatement()!.designator();
        if (isBareDesignator(d)) this.globalVars.add(d.identifier()!.getText());
      }
    }
    // Every variable name anywhere (for enum-member disambiguation).
    collectVarNames(tree.statement(), this.varNames);
  }

  // ─── Statements ────────────────────────────────────────────────────────────

  private emitStatement(ctx: StatementContext): void {
    if (ctx.declareStatement()) return this.emitDeclare(ctx.declareStatement()!);
    if (ctx.constantStatement()) return this.emitConstant(ctx.constantStatement()!);
    if (ctx.typeDefinition()) return this.emitTypeDefinition(ctx.typeDefinition()!);
    if (ctx.defineStatement()) return this.emitDefine(ctx.defineStatement()!);
    if (ctx.classDeclaration()) return this.emitClass(ctx.classDeclaration()!);
    if (ctx.assignmentStatement()) return this.emitAssignment(ctx.assignmentStatement()!);
    if (ctx.inputStatement()) return this.emitInput(ctx.inputStatement()!);
    if (ctx.outputStatement()) return this.emitOutput(ctx.outputStatement()!);
    if (ctx.ifStatement()) return this.emitIf(ctx.ifStatement()!);
    if (ctx.caseStatement()) return this.emitCase(ctx.caseStatement()!);
    if (ctx.forStatement()) return this.emitFor(ctx.forStatement()!);
    if (ctx.whileStatement()) return this.emitWhile(ctx.whileStatement()!);
    if (ctx.repeatStatement()) return this.emitRepeat(ctx.repeatStatement()!);
    if (ctx.procedureDeclaration()) return this.emitCallable(ctx.procedureDeclaration()!);
    if (ctx.functionDeclaration()) return this.emitCallable(ctx.functionDeclaration()!);
    if (ctx.callStatement()) return this.emitCall(ctx.callStatement()!);
    if (ctx.methodCallStatement()) return this.line(this.emitMethodCall(ctx.methodCallStatement()!.methodCall()));
    if (ctx.returnStatement()) return this.emitReturn(ctx.returnStatement()!);
    if (ctx.openFileStatement()) return this.emitOpenFile(ctx.openFileStatement()!);
    if (ctx.readFileStatement()) return this.emitReadFile(ctx.readFileStatement()!);
    if (ctx.writeFileStatement()) return this.emitWriteFile(ctx.writeFileStatement()!);
    if (ctx.closeFileStatement()) return this.emitCloseFile(ctx.closeFileStatement()!);
    if (ctx.seekStatement()) return this.emitRawUnsupported(ctx.seekStatement()!.getText(), 'SEEK (random-access files)');
    if (ctx.getRecordStatement()) return this.emitRawUnsupported(ctx.getRecordStatement()!.getText(), 'GETRECORD (random-access files)');
    if (ctx.putRecordStatement()) return this.emitRawUnsupported(ctx.putRecordStatement()!.getText(), 'PUTRECORD (random-access files)');
  }

  /** Emit the statements of a block at the current indent (no `pass` padding). */
  private emitBlockBody(ctx: BlockContext): void {
    for (const stmt of ctx.statement()) this.emitStatement(stmt);
  }

  /** Emit a block as an indented suite, inserting `pass` when it is empty. */
  private emitSuite(ctx: BlockContext): void {
    this.indentLevel++;
    const start = this.lines.length;
    this.emitBlockBody(ctx);
    if (this.lines.length === start) this.line('pass');
    this.indentLevel--;
  }

  // ─── DECLARE / CONSTANT ─────────────────────────────────────────────────────

  private emitDeclare(ctx: DeclareStatementContext): void {
    if (ctx.ARRAY()) {
      const elemText = ctx.dataType().getText();
      const exprs = ctx.expr();
      if (ctx.COMMA()) {
        // 2D: DECLARE x : ARRAY[l1:u1, l2:u2] OF type
        const name = ctx.identifier()!.getText();
        const dims = [
          { loCtx: exprs[0], hiCtx: exprs[1] },
          { loCtx: exprs[2], hiCtx: exprs[3] },
        ];
        this.arrayBounds.set(name, { lower: this.emitExpr(exprs[0], 0), lower2: this.emitExpr(exprs[2], 0) });
        this.arrayElemTypes.set(name, elemText.toUpperCase());
        this.varKinds.set(name, 'ARRAY');
        this.line(`${pyName(name)} = ${this.arrayLiteral(elemText, dims)}`);
      } else {
        // 1D: DECLARE x, y, ... : ARRAY[l:u] OF type
        const dims = [{ loCtx: exprs[0], hiCtx: exprs[1] }];
        const lower = this.emitExpr(exprs[0], 0);
        for (const id of ctx.identifierList()!.identifier()) {
          const name = id.getText();
          this.arrayBounds.set(name, { lower });
          this.arrayElemTypes.set(name, elemText.toUpperCase());
          this.varKinds.set(name, 'ARRAY');
          this.line(`${pyName(name)} = ${this.arrayLiteral(elemText, dims)}`);
        }
      }
      return;
    }

    const dt = ctx.dataType();
    const kind = this.valueKindOfType(dt);
    for (const id of ctx.identifierList()!.identifier()) {
      const name = id.getText();
      this.recordVarType(name, dt);
      if (kind) this.varKinds.set(name, kind);
      this.line(`${pyName(name)} = ${this.defaultForDataType(dt)}`);
    }
  }

  /** RECORD/ARRAY have value semantics; everything else (scalars, classes, enums) does not. */
  private valueKindOfType(dt: DataTypeContext): 'RECORD' | 'ARRAY' | null {
    if (dt.ARRAY()) return 'ARRAY';
    return this.typeKinds.get(dt.getText().toUpperCase()) === 'RECORD' ? 'RECORD' : null;
  }

  private emitConstant(ctx: ConstantStatementContext): void {
    this.line(`${pyName(ctx.identifier().getText())} = ${this.emitExpr(ctx.expr(), 0)}`);
  }

  private recordVarType(name: string, dt: DataTypeContext): void {
    if (dt.ARRAY()) {
      const elem = dt.dataType();
      if (elem) {
        this.arrayElemTypes.set(name, elem.getText().toUpperCase());
        const exprs = dt.expr();
        if (exprs.length >= 2) {
          this.arrayBounds.set(name, {
            lower: this.emitExpr(exprs[0], 0),
            lower2: exprs.length >= 4 ? this.emitExpr(exprs[2], 0) : undefined,
          });
        }
      }
      return;
    }
    this.varTypes.set(name, dt.getText().toUpperCase());
  }

  // ─── TYPE / DEFINE ──────────────────────────────────────────────────────────

  private emitTypeDefinition(ctx: TypeDefinitionContext): void {
    if (ctx instanceof EnumTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      this.typeKinds.set(name.toUpperCase(), 'ENUM');
      this.typeNames.set(name.toUpperCase(), name);
      this.usedImports.add('from enum import IntEnum');
      const members = ctx.identifierList().identifier().map((t) => t.getText());
      members.forEach((m) => this.enumMembers.set(m.toUpperCase(), { enumName: name, member: m }));
      this.blank();
      this.line(`class ${pyName(name)}(IntEnum):`);
      this.indentLevel++;
      members.forEach((m, i) => this.line(`${pyName(m)} = ${i}`));
      this.indentLevel--;
      this.blank();
      return;
    }

    if (ctx instanceof PointerTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      this.typeKinds.set(name.toUpperCase(), 'POINTER');
      this.typeNames.set(name.toUpperCase(), name);
      this.notePointers();
      this.line(`# TYPE ${name} = ^${ctx.dataType().getText()} — pointers have no direct Python equivalent`);
      return;
    }

    if (ctx instanceof SetTypeDefContext) {
      const name = ctx.IDENTIFIER().getText();
      this.typeKinds.set(name.toUpperCase(), 'SET');
      this.typeNames.set(name.toUpperCase(), name);
      this.line(`# TYPE ${name} = SET OF ${ctx.dataType().getText()} — represented as a Python set`);
      return;
    }

    if (ctx instanceof RecordTypeDefContext) {
      this.emitRecordType(ctx);
    }
  }

  private emitRecordType(ctx: RecordTypeDefContext): void {
    const name = ctx.IDENTIFIER().getText();
    this.typeKinds.set(name.toUpperCase(), 'RECORD');
    this.typeNames.set(name.toUpperCase(), name);
    this.usedImports.add('from dataclasses import dataclass, field');

    this.blank();
    this.line('@dataclass');
    this.line(`class ${pyName(name)}:`);
    this.indentLevel++;
    const start = this.lines.length;
    for (const d of ctx.declareStatement()) this.emitRecordFields(d);
    if (this.lines.length === start) this.line('pass');
    this.indentLevel--;
    this.blank();
  }

  private emitRecordFields(ctx: DeclareStatementContext): void {
    if (ctx.ARRAY()) {
      const elemText = ctx.dataType().getText();
      const exprs = ctx.expr();
      const dims = ctx.COMMA()
        ? [{ loCtx: exprs[0], hiCtx: exprs[1] }, { loCtx: exprs[2], hiCtx: exprs[3] }]
        : [{ loCtx: exprs[0], hiCtx: exprs[1] }];
      const literal = this.arrayLiteral(elemText, dims);
      const names = ctx.COMMA() ? [ctx.identifier()!.getText()] : ctx.identifierList()!.identifier().map((i) => i.getText());
      for (const n of names) this.line(`${pyName(n)}: list = field(default_factory=lambda: ${literal})`);
      return;
    }
    const dt = ctx.dataType();
    const annotation = this.annotationForDataType(dt);
    const def = this.defaultForDataType(dt);
    for (const id of ctx.identifierList()!.identifier()) {
      const name = pyName(id.getText());
      if (this.isMutableType(dt.getText())) {
        this.line(`${name}: ${annotation} = field(default_factory=${def.replace(/\(\)$/, '')})`);
      } else {
        this.line(`${name}: ${annotation} = ${def}`);
      }
    }
  }

  private emitDefine(ctx: DefineStatementContext): void {
    const name = pyName(ctx.identifier().getText());
    const list = ctx.exprList();
    const elems = list ? list.expr().map((e) => this.emitExpr(e, 0)) : [];
    this.line(`${name} = ${elems.length ? `{${elems.join(', ')}}` : 'set()'}`);
  }

  // ─── CLASS ──────────────────────────────────────────────────────────────────

  private emitClass(ctx: ClassDeclarationContext): void {
    const name = ctx.IDENTIFIER(0)!.getText();
    const parentName = ctx.INHERITS() ? ctx.IDENTIFIER(1)!.getText() : undefined;

    // Class-typed DECLAREs default to None (the interpreter has no nullary default
    // for a class) — instances are created explicitly via `NEW`.
    this.typeKinds.set(name.toUpperCase(), 'CLASS');
    this.typeNames.set(name.toUpperCase(), name);

    const fields = new Map<string, FieldInfo>();
    const methods = new Set<string>();
    if (parentName) {
      const parent = this.classes.get(parentName.toUpperCase());
      if (parent) {
        for (const [k, v] of parent.fields) fields.set(k, v);
        for (const m of parent.methods) methods.add(m);
      }
    }

    const ownFields: { name: string; access: string; dt: DataTypeContext }[] = [];
    const procs: { decl: ProcedureDeclarationContext; isNew: boolean }[] = [];
    const funcs: FunctionDeclarationContext[] = [];

    for (const member of ctx.classMember()) {
      if (member instanceof ClassFieldMemberContext) {
        const priv = member.PRIVATE() != null;
        for (const id of member.identifierList().identifier()) {
          const fieldName = id.getText();
          const access = (priv ? '_' : '') + pyName(fieldName);
          fields.set(fieldName.toUpperCase(), { access });
          ownFields.push({ name: fieldName, access, dt: member.dataType() });
        }
      } else if (member instanceof ClassProcMemberContext) {
        const decl = member.procedureDeclaration();
        const mName = decl.identifier().getText();
        methods.add(mName.toUpperCase());
        procs.push({ decl, isNew: mName.toUpperCase() === 'NEW' });
      } else if (member instanceof ClassFuncMemberContext) {
        const decl = member.functionDeclaration();
        methods.add(decl.identifier().getText().toUpperCase());
        funcs.push(decl);
      }
    }

    const info: ClassInfo = { fields, methods, parent: parentName?.toUpperCase() };
    this.classes.set(name.toUpperCase(), info);

    this.blank();
    this.line(`class ${pyName(name)}${parentName ? `(${pyName(parentName)})` : ''}:`);
    this.indentLevel++;
    const classStart = this.lines.length;

    const prevCtx = this.classCtx;
    this.classCtx = info;

    const ctor = procs.find((p) => p.isNew);
    if (ownFields.length > 0 || ctor) {
      const params = ctor ? this.paramNames(ctor.decl.paramList()) : [];
      this.line(`def __init__(self${params.length ? ', ' + params.join(', ') : ''}):`);
      this.indentLevel++;
      const initStart = this.lines.length;
      for (const f of ownFields) this.line(`self.${f.access} = ${this.defaultForDataType(f.dt)}`);
      if (ctor) this.emitBlockBody(ctor.decl.block());
      if (this.lines.length === initStart) this.line('pass');
      this.indentLevel--;
    }

    for (const p of procs) {
      if (p.isNew) continue;
      this.emitMethod(p.decl.identifier().getText(), p.decl.paramList(), p.decl.block());
    }
    for (const f of funcs) {
      this.emitMethod(f.identifier().getText(), f.paramList(), f.block());
    }

    if (this.lines.length === classStart) this.line('pass');

    this.classCtx = prevCtx;
    this.indentLevel--;
    this.blank();
  }

  private emitMethod(name: string, paramList: ParamListContext | null, block: BlockContext): void {
    this.blank();
    const params = this.paramNames(paramList);
    this.line(`def ${pyName(name)}(self${params.length ? ', ' + params.join(', ') : ''}):`);
    this.emitDefBody(block, new Set(params));
  }

  // ─── Assignment / INPUT / OUTPUT ────────────────────────────────────────────

  private emitAssignment(ctx: AssignmentStatementContext): void {
    for (const sa of ctx.singleAssignment()) {
      this.line(`${this.emitDesignator(sa.designator())} = ${this.emitRhs(sa.expr())}`);
    }
  }

  /**
   * Right-hand side of an assignment. Records and arrays are value types in
   * pseudocode, so copying one whole variable into another deep-copies it
   * (class instances stay references, matching Python).
   */
  private emitRhs(expr: ExprContext): string {
    const text = this.emitExpr(expr, 0);
    if (this.isCopyableVarRef(expr)) {
      this.usedImports.add('import copy');
      return `copy.deepcopy(${text})`;
    }
    return text;
  }

  /** True if `expr` is a bare variable whose value has record/array (copy) semantics. */
  private isCopyableVarRef(expr: ExprContext): boolean {
    if (!(expr instanceof AtomExprContext)) return false;
    const atom = expr.atom();
    if (!(atom instanceof DesignatorAtomContext)) return false;
    const d = atom.designator();
    if (!isBareDesignator(d)) return false;
    return this.varKinds.has(d.identifier()!.getText());
  }

  private emitInput(ctx: InputStatementContext): void {
    const desig = ctx.designator();
    const promptTok = ctx.STRING_LITERAL();
    const promptArg = promptTok ? pyStr(promptTok.getText().slice(1, -1)) : '';
    let call = `input(${promptArg})`;
    const coerce = this.inputCoercion(desig);
    if (coerce) call = `${coerce}(${call})`;
    this.line(`${this.emitDesignator(desig)} = ${call}`);
  }

  private inputCoercion(desig: DesignatorContext): 'int' | 'float' | null {
    const head = desig.identifier();
    if (!head) return null;
    const name = head.getText();
    const parts = desig.designatorPart();
    let type: string | undefined;
    if (parts.length === 0) {
      type = this.varTypes.get(name);
    } else if (parts.length === 1 && parts[0].LBRACKET()) {
      type = this.arrayElemTypes.get(name);
    }
    if (type === 'INTEGER') return 'int';
    if (type === 'REAL') return 'float';
    return null;
  }

  private emitOutput(ctx: OutputStatementContext): void {
    // Cambridge OUTPUT concatenates its items with no separator.
    const items = ctx.exprList().expr().map((e) => this.emitExpr(e, 0));
    this.line(items.length === 1 ? `print(${items[0]})` : `print(${items.join(', ')}, sep="")`);
  }

  // ─── Control flow ────────────────────────────────────────────────────────────

  private emitIf(ctx: IfStatementContext): void {
    const exprs = ctx.expr();
    const blocks = ctx.block();

    // exprs = IF condition + each ELSEIF / ELSE IF condition; blocks pair with them.
    // A trailing block (blocks.length > exprs.length) is the final ELSE branch.
    this.line(`if ${this.emitExpr(exprs[0], 0)}:`);
    this.emitSuite(blocks[0]);
    for (let i = 1; i < exprs.length; i++) {
      this.line(`elif ${this.emitExpr(exprs[i], 0)}:`);
      this.emitSuite(blocks[i]);
    }
    if (blocks.length > exprs.length) {
      this.line('else:');
      this.emitSuite(blocks[exprs.length]);
    }
  }

  private emitCase(ctx: CaseStatementContext): void {
    // Translate to an if/elif chain on the subject for broad Python compatibility.
    const subject = this.emitDesignator(ctx.designator());
    const subjVar = '_case';
    this.line(`${subjVar} = ${subject}`);

    const clauses = ctx.caseClause();
    clauses.forEach((clause, idx) => {
      const conds = clause.caseLabel().map((lbl) => this.caseCondition(subjVar, lbl));
      const cond = conds.length === 1 ? conds[0] : conds.map((c) => `(${c})`).join(' or ');
      this.line(`${idx === 0 ? 'if' : 'elif'} ${cond}:`);
      this.emitSuite(clause.block());
    });

    if (ctx.OTHERWISE() && ctx.block()) {
      this.line(clauses.length === 0 ? 'if True:' : 'else:');
      this.emitSuite(ctx.block()!);
    }
  }

  private caseCondition(subjVar: string, lbl: CaseLabelContext): string {
    const exprs = lbl.expr();
    if (exprs.length === 2) {
      return `${this.emitExpr(exprs[0], P_CMP)} <= ${subjVar} <= ${this.emitExpr(exprs[1], P_CMP)}`;
    }
    return `${subjVar} == ${this.emitExpr(exprs[0], P_CMP + 1)}`;
  }

  private emitFor(ctx: ForStatementContext): void {
    const varName = pyName(ctx.identifier(0)!.getText());
    const exprs = ctx.expr();
    const start = this.emitExpr(exprs[0], 0);
    const endText = this.emitExpr(exprs[1], P_ADD);
    const stepCtx = exprs.length > 2 ? exprs[2] : null;

    let stop: string;
    let stepArg = '';
    if (stepCtx) {
      const stepConst = constInt(stepCtx);
      const stepText = this.emitExpr(stepCtx, 0);
      stepArg = `, ${stepText}`;
      if (stepConst !== null && stepConst < 0) {
        stop = `${endText} - 1`;
      } else {
        if (stepConst === null) this.notes.add('FOR ... STEP assumes a positive step; adjust range() if the step is negative.');
        stop = `${endText} + 1`;
      }
    } else {
      stop = `${endText} + 1`;
    }

    this.line(`for ${varName} in range(${start}, ${stop}${stepArg}):`);
    this.emitSuite(ctx.block());
  }

  private emitWhile(ctx: WhileStatementContext): void {
    this.line(`while ${this.emitExpr(ctx.expr(), 0)}:`);
    this.emitSuite(ctx.block());
  }

  private emitRepeat(ctx: RepeatStatementContext): void {
    // REPEAT ... UNTIL c  →  do/while via `while True` + guarded break.
    this.line('while True:');
    this.indentLevel++;
    const start = this.lines.length;
    this.emitBlockBody(ctx.block());
    if (this.lines.length === start) this.line('pass');
    this.line(`if ${this.emitExpr(ctx.expr(), 0)}:`);
    this.indentLevel++;
    this.line('break');
    this.indentLevel--;
    this.indentLevel--;
  }

  // ─── PROCEDURE / FUNCTION / CALL / RETURN ───────────────────────────────────

  private emitCallable(ctx: ProcedureDeclarationContext | FunctionDeclarationContext): void {
    this.blank();
    const name = pyName(ctx.identifier().getText());
    const params = this.paramNames(ctx.paramList());
    this.line(`def ${name}(${params.join(', ')}):`);
    this.emitDefBody(ctx.block(), new Set(params));
  }

  /** Emit a def suite, prepending any needed `global` declaration. */
  private emitDefBody(block: BlockContext, paramNames: Set<string>): void {
    this.indentLevel++;

    const locals = new Set(paramNames);
    collectLocalNames(block, locals);
    const rebinds = new Set<string>();
    collectRebinds(block, rebinds);
    const needGlobal = [...rebinds].filter((n) => this.globalVars.has(n) && !locals.has(n));

    const start = this.lines.length;
    if (needGlobal.length > 0) this.line(`global ${needGlobal.join(', ')}`);
    this.emitBlockBody(block);
    if (this.lines.length === start) this.line('pass');

    this.indentLevel--;
  }

  private paramNames(ctx: ParamListContext | null): string[] {
    if (!ctx) return [];
    let mode: 'BYVAL' | 'BYREF' = 'BYVAL';
    return ctx.param().map((p) => {
      if (p.BYREF()) mode = 'BYREF';
      else if (p.BYVAL()) mode = 'BYVAL';
      const name = p.identifier().getText();
      const type = p.dataType().getText().toUpperCase();
      this.varTypes.set(name, type);
      const kind = this.valueKindOfType(p.dataType());
      if (kind) this.varKinds.set(name, kind);
      if (mode === 'BYREF' && (type in SCALAR_DEFAULTS || type === 'DATE')) {
        this.notes.add("BYREF on a scalar can't be reproduced in Python — such changes won't propagate back to the caller.");
      }
      return pyName(name);
    });
  }

  private emitCall(ctx: CallStatementContext): void {
    const mc = ctx.methodCall();
    if (mc) {
      this.line(this.emitMethodCall(mc));
      return;
    }
    const name = ctx.identifier()!.getText();
    const args = this.emitArgs(ctx.argList());
    if (this.classCtx && this.classCtx.methods.has(name.toUpperCase())) {
      this.line(`self.${pyName(name)}(${args})`);
    } else {
      this.line(`${pyName(name)}(${args})`);
    }
  }

  private emitMethodCall(ctx: MethodCallContext): string {
    const member = ctx.memberName().getText();
    const args = this.emitArgs(ctx.argList());
    const headId = ctx.identifier();
    if (!headId) {
      const target = member.toUpperCase() === 'NEW' ? '__init__' : pyName(member);
      return `super().${target}(${args})`;
    }
    const name = headId.getText();
    const base = this.applyParts(this.headText(name), this.arrayBounds.get(name) ?? null, ctx.designatorPart());
    return `${base}.${pyName(member)}(${args})`;
  }

  private emitReturn(ctx: ReturnStatementContext): void {
    this.line(`return ${this.emitExpr(ctx.expr(), 0)}`);
  }

  // ─── File handling ──────────────────────────────────────────────────────────

  private emitOpenFile(ctx: OpenFileStatementContext): void {
    const mode = ctx.fileMode();
    if (mode.RANDOM()) {
      this.emitRawUnsupported(ctx.getText(), 'OPENFILE ... FOR RANDOM (random-access files)');
      return;
    }
    const modeName = mode.READ_MODE() ? 'READ' : mode.WRITE_MODE() ? 'WRITE' : 'APPEND';
    this.useFileHelper('OPENFILE');
    this.line(`OPENFILE(${this.emitExpr(ctx.expr(), 0)}, ${pyStr(modeName)})`);
  }

  private emitReadFile(ctx: ReadFileStatementContext): void {
    this.useFileHelper('READFILE');
    this.line(`${this.emitDesignator(ctx.designator())} = READFILE(${this.emitExpr(ctx.expr(), 0)})`);
  }

  private emitWriteFile(ctx: WriteFileStatementContext): void {
    this.useFileHelper('WRITEFILE');
    const exprs = ctx.expr();
    this.line(`WRITEFILE(${this.emitExpr(exprs[0], 0)}, ${this.emitExpr(exprs[1], 0)})`);
  }

  private emitCloseFile(ctx: CloseFileStatementContext): void {
    this.useFileHelper('CLOSEFILE');
    this.line(`CLOSEFILE(${this.emitExpr(ctx.expr(), 0)})`);
  }

  private emitRawUnsupported(text: string, label: string): void {
    this.notes.add(`Some constructs have no Python equivalent and are left as TODO comments (${label}).`);
    this.line(`# TODO: ${label} not supported — original: ${text}`);
  }

  // ─── Designators ────────────────────────────────────────────────────────────

  private emitDesignator(ctx: DesignatorContext): string {
    const headId = ctx.identifier();
    const parts = ctx.designatorPart();
    if (!headId) return this.emitSuperDesignator(parts);

    const name = headId.getText();
    if (name.toUpperCase() === 'USERINPUT' && parts.length === 0) return 'input()';
    return this.applyParts(this.headText(name), this.arrayBounds.get(name) ?? null, parts);
  }

  /** Resolve a designator head to its Python text (self.field / Enum.Member / name). */
  private headText(name: string): string {
    const upper = name.toUpperCase();
    if (this.classCtx && this.classCtx.fields.has(upper)) {
      return `self.${this.classCtx.fields.get(upper)!.access}`;
    }
    if (!this.varNames.has(name) && this.enumMembers.has(upper)) {
      const em = this.enumMembers.get(upper)!;
      return `${pyName(em.enumName)}.${pyName(em.member)}`;
    }
    return pyName(name);
  }

  private emitSuperDesignator(parts: DesignatorPartContext[]): string {
    const first = parts[0];
    const member = first.memberName()!.getText();
    const target = member.toUpperCase() === 'NEW' ? '__init__' : pyName(member);
    const base = `super().${target}(${this.emitArgs(first.argList())})`;
    return this.applyParts(base, null, parts.slice(1));
  }

  private applyParts(base: string, bounds: ArrayBound | null, parts: DesignatorPartContext[]): string {
    let result = base;
    let curBounds = bounds;
    for (const part of parts) {
      if (part.CARET()) {
        this.notePointers(); // ptr^ dereference → identity
        continue;
      }
      if (part.LBRACKET()) {
        part.expr().forEach((e, dim) => {
          const lower = curBounds ? (dim === 0 ? curBounds.lower : curBounds.lower2 ?? '1') : '1';
          result += `[${this.indexText(e, lower)}]`;
        });
        continue;
      }
      const member = part.memberName()!.getText();
      curBounds = null;
      if (part.LPAREN()) {
        result += `.${pyName(member)}(${this.emitArgs(part.argList())})`;
      } else {
        result += `.${pyName(member)}`;
      }
    }
    return result;
  }

  /** A 1-based array index translated to 0-based using the array's lower bound. */
  private indexText(e: ExprContext, lower: string): string {
    const idx = this.emitExpr(e, P_ADD);
    if (lower === '0') return idx;
    if (lower === '1') return `${idx} - 1`;
    return `${idx} - ${/^\w+$/.test(lower) ? lower : `(${lower})`}`;
  }

  private emitArgs(ctx: ArgListContext | null): string {
    if (!ctx) return '';
    return ctx.expr().map((e) => this.emitExpr(e, 0)).join(', ');
  }

  // ─── Expressions ──────────────────────────────────────────────────────────

  private emitExpr(ctx: ExprContext, minPrec: number): string {
    if (ctx instanceof NotExprContext) {
      return wrapIf(`not ${this.emitExpr(ctx.expr(), P_NOT)}`, P_NOT, minPrec);
    }
    if (ctx instanceof UnaryMinusExprContext) {
      return wrapIf(`-${this.emitExpr(ctx.expr(), P_NEG)}`, P_NEG, minPrec);
    }
    if (ctx instanceof PowerExprContext) {
      const l = this.emitExpr(ctx.expr(0)!, P_POW + 1);
      const r = this.emitExpr(ctx.expr(1)!, P_POW);
      return wrapIf(`${l} ** ${r}`, P_POW, minPrec);
    }
    if (ctx instanceof MulDivExprContext) {
      const op = ctx._op!.text!.toUpperCase();
      if (op === 'DIV') {
        this.useHelper('DIV');
        return `DIV(${this.emitExpr(ctx.expr(0)!, 0)}, ${this.emitExpr(ctx.expr(1)!, 0)})`;
      }
      const pyOp = op === 'MOD' ? '%' : op; // '*' or '/'
      return this.binary(ctx.expr(0)!, pyOp, ctx.expr(1)!, P_MUL, minPrec);
    }
    if (ctx instanceof AddSubExprContext) {
      return this.binary(ctx.expr(0)!, ctx._op!.text!, ctx.expr(1)!, P_ADD, minPrec);
    }
    if (ctx instanceof ConcatExprContext) {
      const l = this.concatOperand(ctx.expr(0)!, P_ADD);
      const r = this.concatOperand(ctx.expr(1)!, P_ADD + 1);
      return wrapIf(`${l} + ${r}`, P_ADD, minPrec);
    }
    if (ctx instanceof ComparisonExprContext) {
      const op = ctx._op!.text!;
      const pyOp = op === '=' ? '==' : op === '<>' ? '!=' : op;
      const l = this.emitExpr(ctx.expr(0)!, P_CMP + 1);
      const r = this.emitExpr(ctx.expr(1)!, P_CMP + 1);
      return wrapIf(`${l} ${pyOp} ${r}`, P_CMP, minPrec);
    }
    if (ctx instanceof AndExprContext) {
      return this.binary(ctx.expr(0)!, 'and', ctx.expr(1)!, P_AND, minPrec);
    }
    if (ctx instanceof OrExprContext) {
      return this.binary(ctx.expr(0)!, 'or', ctx.expr(1)!, P_OR, minPrec);
    }
    if (ctx instanceof AtomExprContext) {
      return this.emitAtom(ctx.atom(), minPrec);
    }
    return '???';
  }

  private binary(left: ExprContext, op: string, right: ExprContext, prec: number, minPrec: number): string {
    const l = this.emitExpr(left, prec);
    const r = this.emitExpr(right, prec + 1);
    return wrapIf(`${l} ${op} ${r}`, prec, minPrec);
  }

  /** Operand of `&` concat: string-coerce anything that isn't already a string. */
  private concatOperand(ctx: ExprContext, minPrec: number): string {
    if (isStringy(ctx)) return this.emitExpr(ctx, minPrec);
    return `str(${this.emitExpr(ctx, 0)})`;
  }

  private emitAtom(ctx: ReturnType<AtomExprContext['atom']>, minPrec: number): string {
    if (ctx instanceof ParenAtomContext) return this.emitExpr(ctx.expr(), minPrec);
    if (ctx instanceof IntegerAtomContext) return ctx.INTEGER_LITERAL().getText();
    if (ctx instanceof RealAtomContext) return ctx.REAL_LITERAL().getText();
    if (ctx instanceof StringAtomContext) return pyStr(ctx.STRING_LITERAL().getText().slice(1, -1));
    if (ctx instanceof CharAtomContext) return pyStr(ctx.CHAR_LITERAL().getText().slice(1, -1));
    if (ctx instanceof TrueAtomContext) return 'True';
    if (ctx instanceof FalseAtomContext) return 'False';
    if (ctx instanceof DateAtomContext) {
      this.usedImports.add('import datetime');
      const [d, m, y] = ctx.DATE_LITERAL().getText().split('/').map((n) => parseInt(n, 10));
      return `datetime.date(${y}, ${m}, ${d})`;
    }
    if (ctx instanceof DesignatorAtomContext) return this.emitDesignator(ctx.designator());
    if (ctx instanceof FunctionCallAtomContext) return this.emitFunctionCall(ctx);
    if (ctx instanceof NewInstanceAtomContext) {
      return `${pyName(ctx.IDENTIFIER().getText())}(${this.emitArgs(ctx.argList())})`;
    }
    if (ctx instanceof AddressOfAtomContext) {
      this.notePointers(); // ^x address-of → the value itself (aliasing not reproduced)
      return this.emitDesignator(ctx.designator());
    }
    if (ctx instanceof DivFunctionAtomContext) {
      this.useHelper('DIV');
      return `DIV(${this.emitExpr(ctx.expr(0)!, 0)}, ${this.emitExpr(ctx.expr(1)!, 0)})`;
    }
    if (ctx instanceof ModFunctionAtomContext) {
      const s = `${this.emitExpr(ctx.expr(0)!, P_MUL)} % ${this.emitExpr(ctx.expr(1)!, P_MUL + 1)}`;
      return wrapIf(s, P_MUL, minPrec);
    }
    return '???';
  }

  private emitFunctionCall(ctx: FunctionCallAtomContext): string {
    const name = ctx.identifier().getText();
    const builtin = this.builtinCall(name.toUpperCase(), ctx.argList());
    if (builtin !== null) return builtin;
    const args = this.emitArgs(ctx.argList());
    if (this.classCtx && this.classCtx.methods.has(name.toUpperCase())) {
      return `self.${pyName(name)}(${args})`;
    }
    return `${pyName(name)}(${args})`;
  }

  private builtinCall(nameUpper: string, argList: ArgListContext | null): string | null {
    const A = argList ? argList.expr() : [];
    const e = (i: number, prec = 0) => this.emitExpr(A[i], prec);
    switch (nameUpper) {
      case 'LENGTH': return `len(${e(0)})`;
      case 'LCASE': return `${e(0, P_ATOM)}.lower()`;
      case 'UCASE': return `${e(0, P_ATOM)}.upper()`;
      case 'SUBSTRING': this.useHelper('SUBSTRING'); return `SUBSTRING(${e(0)}, ${e(1)}, ${e(2)})`;
      case 'MID': this.useHelper('MID'); return `MID(${e(0)}, ${e(1)}, ${e(2)})`;
      case 'LEFT': this.useHelper('LEFT'); return `LEFT(${e(0)}, ${e(1)})`;
      case 'RIGHT': this.useHelper('RIGHT'); return `RIGHT(${e(0)}, ${e(1)})`;
      case 'ROUND': this.useHelper('ROUND'); return A.length > 1 ? `ROUND(${e(0)}, ${e(1)})` : `ROUND(${e(0)})`;
      case 'INT': return `int(${e(0)})`;
      case 'RAND': this.usedImports.add('import random'); return `(random.random() * ${e(0, P_MUL + 1)})`;
      case 'RANDOM': this.usedImports.add('import random'); return 'random.random()';
      case 'NUM_TO_STRING': return `str(${e(0)})`;
      case 'STRING_TO_NUM': this.useHelper('STRING_TO_NUM'); return `STRING_TO_NUM(${e(0)})`;
      case 'ASC': return `ord(${e(0)})`;
      case 'CHR': return `chr(${e(0)})`;
      case 'IS_NUM': this.useHelper('IS_NUM'); return `IS_NUM(${e(0)})`;
      case 'EOF': this.useFileHelper('EOF'); return `EOF(${e(0)})`;
      default: return null;
    }
  }

  // ─── Type helpers ───────────────────────────────────────────────────────────

  private defaultForDataType(dt: DataTypeContext): string {
    if (dt.ARRAY()) {
      const elem = dt.dataType();
      const exprs = dt.expr();
      if (elem && exprs.length >= 2) {
        const dims = exprs.length >= 4
          ? [{ loCtx: exprs[0], hiCtx: exprs[1] }, { loCtx: exprs[2], hiCtx: exprs[3] }]
          : [{ loCtx: exprs[0], hiCtx: exprs[1] }];
        return this.arrayLiteral(elem.getText(), dims);
      }
      return '[]';
    }
    return this.scalarDefault(dt.getText());
  }

  private scalarDefault(typeText: string): string {
    const upper = typeText.toUpperCase();
    if (upper in SCALAR_DEFAULTS) return SCALAR_DEFAULTS[upper];
    if (upper === 'DATE') {
      this.usedImports.add('import datetime');
      return 'datetime.date(1900, 1, 1)';
    }
    const kind = this.typeKinds.get(upper);
    if (kind === 'RECORD') return `${pyName(this.typeNames.get(upper) ?? typeText)}()`;
    if (kind === 'SET') return 'set()';
    return 'None'; // ENUM, POINTER, unknown
  }

  private annotationForDataType(dt: DataTypeContext): string {
    if (dt.ARRAY()) return 'list';
    const upper = dt.getText().toUpperCase();
    if (upper in PY_ANNOTATIONS) return upper === 'DATE' ? '"datetime.date"' : PY_ANNOTATIONS[upper];
    const original = this.typeNames.get(upper);
    return original ? pyName(original) : 'object';
  }

  private isMutableType(typeText: string): boolean {
    return this.typeKinds.get(typeText.toUpperCase()) === 'RECORD';
  }

  private arrayLiteral(elemText: string, dims: { loCtx: ExprContext; hiCtx: ExprContext }[]): string {
    let inner = this.scalarDefault(elemText);
    let mutable = this.isMutableType(elemText);
    for (let i = dims.length - 1; i >= 0; i--) {
      const size = this.sizeText(dims[i].loCtx, dims[i].hiCtx);
      inner = mutable ? `[${inner} for _ in range(${size})]` : `[${inner}] * ${size}`;
      mutable = true;
    }
    return inner;
  }

  private sizeText(loCtx: ExprContext, hiCtx: ExprContext): string {
    const lo = constInt(loCtx);
    const hi = constInt(hiCtx);
    if (lo !== null && hi !== null) return String(hi - lo + 1);
    return `(${this.emitExpr(hiCtx, 0)}) - (${this.emitExpr(loCtx, 0)}) + 1`;
  }

  private notePointers(): void {
    this.notes.add('Pointers are approximated — Python has no direct pointer/dereference equivalent, so aliasing is not reproduced.');
  }
}

// ─── Free helpers (no converter state) ────────────────────────────────────────

function wrapIf(text: string, prec: number, minPrec: number): string {
  return prec < minPrec ? `(${text})` : text;
}

/** True if this expression already evaluates to a string (so `&` needs no str()). */
function isStringy(ctx: ExprContext): boolean {
  if (ctx instanceof ConcatExprContext) return true;
  if (ctx instanceof AtomExprContext) {
    const a = ctx.atom();
    if (a instanceof StringAtomContext || a instanceof CharAtomContext) return true;
    if (a instanceof ParenAtomContext) return isStringy(a.expr());
    if (a instanceof FunctionCallAtomContext) {
      const STRING_BUILTINS = new Set(['UCASE', 'LCASE', 'SUBSTRING', 'MID', 'LEFT', 'RIGHT', 'NUM_TO_STRING', 'CHR']);
      return STRING_BUILTINS.has(a.identifier().getText().toUpperCase());
    }
  }
  return false;
}

function constInt(ctx: ExprContext): number | null {
  if (ctx instanceof UnaryMinusExprContext) {
    const v = constInt(ctx.expr());
    return v === null ? null : -v;
  }
  if (ctx instanceof AtomExprContext) {
    const a = ctx.atom();
    if (a instanceof IntegerAtomContext) return parseInt(a.INTEGER_LITERAL().getText(), 10);
    if (a instanceof ParenAtomContext) return constInt(a.expr());
  }
  return null;
}

function isBareDesignator(d: DesignatorContext): boolean {
  return d.designatorPart().length === 0 && d.identifier() != null;
}

function declaredNames(ds: DeclareStatementContext): string[] {
  if (ds.identifierList()) return ds.identifierList()!.identifier().map((i) => i.getText());
  if (ds.identifier()) return [ds.identifier()!.getText()];
  return [];
}

/** Blocks nested directly inside a statement's control structures (not defs/classes). */
function subBlocks(stmt: StatementContext): BlockContext[] {
  const out: BlockContext[] = [];
  if (stmt.ifStatement()) out.push(...stmt.ifStatement()!.block());
  if (stmt.caseStatement()) {
    const c = stmt.caseStatement()!;
    for (const clause of c.caseClause()) out.push(clause.block());
    if (c.block()) out.push(c.block()!);
  }
  if (stmt.forStatement()) out.push(stmt.forStatement()!.block());
  if (stmt.whileStatement()) out.push(stmt.whileStatement()!.block());
  if (stmt.repeatStatement()) out.push(stmt.repeatStatement()!.block());
  return out;
}

function collectLocalNames(block: BlockContext, into: Set<string>): void {
  for (const stmt of block.statement()) {
    if (stmt.declareStatement()) for (const n of declaredNames(stmt.declareStatement()!)) into.add(n);
    if (stmt.forStatement()) into.add(stmt.forStatement()!.identifier(0)!.getText());
    for (const sb of subBlocks(stmt)) collectLocalNames(sb, into);
  }
}

function collectRebinds(block: BlockContext, into: Set<string>): void {
  for (const stmt of block.statement()) {
    if (stmt.assignmentStatement()) {
      for (const sa of stmt.assignmentStatement()!.singleAssignment()) {
        if (isBareDesignator(sa.designator())) into.add(sa.designator().identifier()!.getText());
      }
    }
    if (stmt.inputStatement() && isBareDesignator(stmt.inputStatement()!.designator())) {
      into.add(stmt.inputStatement()!.designator().identifier()!.getText());
    }
    if (stmt.readFileStatement() && isBareDesignator(stmt.readFileStatement()!.designator())) {
      into.add(stmt.readFileStatement()!.designator().identifier()!.getText());
    }
    for (const sb of subBlocks(stmt)) collectRebinds(sb, into);
  }
}

function collectVarNames(stmts: StatementContext[], into: Set<string>): void {
  for (const stmt of stmts) {
    if (stmt.declareStatement()) for (const n of declaredNames(stmt.declareStatement()!)) into.add(n);
    if (stmt.constantStatement()) into.add(stmt.constantStatement()!.identifier().getText());
    if (stmt.forStatement()) into.add(stmt.forStatement()!.identifier(0)!.getText());
    if (stmt.assignmentStatement()) {
      for (const sa of stmt.assignmentStatement()!.singleAssignment()) {
        if (isBareDesignator(sa.designator())) into.add(sa.designator().identifier()!.getText());
      }
    }
    if (stmt.inputStatement() && isBareDesignator(stmt.inputStatement()!.designator())) {
      into.add(stmt.inputStatement()!.designator().identifier()!.getText());
    }
    if (stmt.procedureDeclaration()) {
      addParamNames(stmt.procedureDeclaration()!.paramList(), into);
      collectVarNames(stmt.procedureDeclaration()!.block().statement(), into);
    }
    if (stmt.functionDeclaration()) {
      addParamNames(stmt.functionDeclaration()!.paramList(), into);
      collectVarNames(stmt.functionDeclaration()!.block().statement(), into);
    }
    for (const sb of subBlocks(stmt)) collectVarNames(sb.statement(), into);
  }
}

function addParamNames(ctx: ParamListContext | null, into: Set<string>): void {
  if (!ctx) return;
  for (const p of ctx.param()) into.add(p.identifier().getText());
}
