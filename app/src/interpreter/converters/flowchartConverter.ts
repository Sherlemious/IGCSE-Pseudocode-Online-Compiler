// Pseudocode → flowchart converter.
//
// Walks the same ANTLR parse tree the interpreter executes, but builds an
// abstract flowchart graph (nodes + edges) instead of running it. Pure and
// synchronous — no React, no layout — so it stays unit-testable like
// core/interpreter.ts and converters/pythonConverter.ts. The view layer
// (FlowchartView) positions the graph with dagre and renders it with React Flow.
//
// Coverage mirrors the Python converter: the full IGCSE core maps to proper
// flowchart shapes; A Level / awkward constructs (pointers, random-access files,
// class internals) render best-effort as plain process boxes and leave a note.

import { parse } from '../parser';
import { PseudocodeError } from '../core/types';
import {
  ProgramContext,
  StatementContext,
  BlockContext,
  DeclareStatementContext,
  DataTypeContext,
  DesignatorContext,
  ExprContext,
  ArgListContext,
  ParamListContext,
  AtomExprContext,
  ParenAtomContext,
  FunctionCallAtomContext,
  NewInstanceAtomContext,
  DivFunctionAtomContext,
  ModFunctionAtomContext,
  DesignatorAtomContext,
  NotExprContext,
  UnaryMinusExprContext,
  PowerExprContext,
  MulDivExprContext,
  AddSubExprContext,
  ConcatExprContext,
  ComparisonExprContext,
  AndExprContext,
  OrExprContext,
} from '../generated/PseudocodeParser';

// ─── Public shapes ──────────────────────────────────────────────────────────

export type NodeShape = 'terminator' | 'process' | 'io' | 'decision' | 'subroutine';

export interface FlowNode {
  id: string;
  shape: NodeShape;
  label: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  /** Branch annotation: "Yes" / "No" / a CASE value / "OTHERWISE". */
  label?: string;
}

export interface FlowchartConversion {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** Best-effort / unsupported explanations, shown under the diagram. */
  notes: string[];
  /** Parse errors — when present the caller shows "fix syntax first". */
  errors: PseudocodeError[];
}

export function convertToFlowchart(source: string): FlowchartConversion {
  if (!source.trim()) return { nodes: [], edges: [], notes: [], errors: [] };
  const { tree, errors } = parse(source);
  if (errors.length > 0 || !tree) {
    return { nodes: [], edges: [], notes: [], errors };
  }
  return new FlowchartBuilder().build(tree);
}

// ─── Builder ────────────────────────────────────────────────────────────────

const ARROW = '←'; // ← assignment, matching Cambridge pseudocode
const MAX_LABEL = 64;

/** An open out-edge waiting to be pointed at whatever node comes next. */
type Pending = { from: string; label?: string }[];

class FlowchartBuilder {
  private nodes: FlowNode[] = [];
  private edges: FlowEdge[] = [];
  private notes = new Set<string>();
  private nodeId = 0;
  private edgeId = 0;

  /** Terminator that RETURN (and the trailing flow) connects to in the current routine. */
  private currentEndId = '';

  build(tree: ProgramContext): FlowchartConversion {
    const stmts = tree.statement();
    const isRoutine = (s: StatementContext) => s.procedureDeclaration() != null || s.functionDeclaration() != null;
    const mainStmts = stmts.filter((s) => !isRoutine(s));
    const routines = stmts.filter(isRoutine);

    // Main program: START → … → STOP.
    const startId = this.addNode('terminator', 'START');
    const stopId = this.addNode('terminator', 'STOP');
    this.currentEndId = stopId;
    const tail = this.emitBlock(mainStmts, [{ from: startId }]);
    this.connect(tail, stopId);

    // Each procedure / function becomes its own sub-flowchart component.
    for (const r of routines) this.emitRoutine(r);

    return { nodes: this.nodes, edges: this.edges, notes: [...this.notes], errors: [] };
  }

  // ─── Graph primitives ──────────────────────────────────────────────────────

  private addNode(shape: NodeShape, label: string): string {
    const id = `n${this.nodeId++}`;
    this.nodes.push({ id, shape, label: truncate(label) });
    return id;
  }

  private connect(pending: Pending, targetId: string): void {
    for (const p of pending) {
      this.edges.push({ id: `e${this.edgeId++}`, source: p.from, target: targetId, label: p.label });
    }
  }

  private note(text: string): void {
    this.notes.add(text);
  }

  // ─── Blocks & statements ────────────────────────────────────────────────────

  /**
   * Emit every statement in sequence. `incoming` are the open edges that should
   * point at the first statement's entry node; the returned Pending are the open
   * edges leaving the last statement. Stops early once flow terminates (a RETURN,
   * or an IF/CASE whose every branch returns) — the rest of the block is
   * unreachable and would only draw dangling nodes.
   */
  private emitBlock(stmts: StatementContext[], incoming: Pending): Pending {
    let pending = incoming;
    for (const stmt of stmts) {
      pending = this.emitStatement(stmt, pending);
      if (pending.length === 0) break;
    }
    return pending;
  }

  private emitStatement(ctx: StatementContext, incoming: Pending): Pending {
    const asg = ctx.assignmentStatement();
    if (asg) {
      const label = asg
        .singleAssignment()
        .map((sa) => `${designatorText(sa.designator())} ${ARROW} ${exprText(sa.expr())}`)
        .join('   ');
      return this.linear('process', label, incoming);
    }

    const decl = ctx.declareStatement();
    if (decl) return this.linear('process', declareText(decl), incoming);

    const con = ctx.constantStatement();
    if (con) return this.linear('process', `CONSTANT ${con.identifier().getText()} = ${exprText(con.expr())}`, incoming);

    const typeDef = ctx.typeDefinition();
    if (typeDef) return this.linear('process', `TYPE ${typeDef.getChild(1)?.getText() ?? ''}`, incoming);

    const def = ctx.defineStatement();
    if (def) return this.linear('process', `DEFINE ${def.identifier().getText()}`, incoming);

    const cls = ctx.classDeclaration();
    if (cls) {
      this.note('Class definitions are shown as a single box — their methods are not expanded into separate flowcharts.');
      return this.linear('process', `CLASS ${cls.IDENTIFIER(0)?.getText() ?? ''}`, incoming);
    }

    const inp = ctx.inputStatement();
    if (inp) return this.linear('io', `INPUT ${designatorText(inp.designator())}`, incoming);

    const out = ctx.outputStatement();
    if (out) {
      const items = out.exprList().expr().map(exprText).join(', ');
      return this.linear('io', `OUTPUT ${items}`, incoming);
    }

    if (ctx.ifStatement()) return this.emitIf(ctx.ifStatement()!, incoming);
    if (ctx.caseStatement()) return this.emitCase(ctx.caseStatement()!, incoming);
    if (ctx.forStatement()) return this.emitFor(ctx.forStatement()!, incoming);
    if (ctx.whileStatement()) return this.emitWhile(ctx.whileStatement()!, incoming);
    if (ctx.repeatStatement()) return this.emitRepeat(ctx.repeatStatement()!, incoming);

    const call = ctx.callStatement();
    if (call) {
      const mc = call.methodCall();
      const label = mc
        ? `CALL ${mc.getText()}`
        : `CALL ${call.identifier()!.getText()}(${argText(call.argList())})`;
      return this.linear('subroutine', label, incoming);
    }

    const mcs = ctx.methodCallStatement();
    if (mcs) return this.linear('subroutine', `CALL ${mcs.methodCall().getText()}`, incoming);

    const ret = ctx.returnStatement();
    if (ret) {
      const e = ret.expr();
      const id = this.addNode('process', e ? `RETURN ${exprText(e)}` : 'RETURN');
      this.connect(incoming, id);
      this.connect([{ from: id }], this.currentEndId);
      return []; // flow ends here
    }

    const open = ctx.openFileStatement();
    if (open) {
      const mode = open.fileMode();
      const modeName = mode.READ_MODE() ? 'READ' : mode.WRITE_MODE() ? 'WRITE' : mode.RANDOM() ? 'RANDOM' : 'APPEND';
      return this.linear('process', `OPENFILE ${exprText(open.expr())} FOR ${modeName}`, incoming);
    }
    const readF = ctx.readFileStatement();
    if (readF) return this.linear('io', `READFILE ${exprText(readF.expr())}, ${designatorText(readF.designator())}`, incoming);
    const writeF = ctx.writeFileStatement();
    if (writeF) {
      const es = writeF.expr();
      return this.linear('io', `WRITEFILE ${exprText(es[0])}, ${exprText(es[1])}`, incoming);
    }
    const closeF = ctx.closeFileStatement();
    if (closeF) return this.linear('process', `CLOSEFILE ${exprText(closeF.expr())}`, incoming);

    if (ctx.seekStatement() || ctx.getRecordStatement() || ctx.putRecordStatement()) {
      this.note('Random-access file operations (SEEK / GETRECORD / PUTRECORD) are shown as plain steps.');
      return this.linear('process', truncate(ctx.getText()), incoming);
    }

    // Nested routine declarations (rare) or anything unhandled → best-effort box.
    if (ctx.procedureDeclaration() || ctx.functionDeclaration()) {
      this.note('Nested subroutine definitions are shown as a single box rather than expanded inline.');
      return this.linear('process', truncate(ctx.getText()), incoming);
    }
    const text = ctx.getText().trim();
    if (!text) return incoming; // blank / comment-only line
    return this.linear('process', truncate(text), incoming);
  }

  /** A single in-line node: connect incoming → node, hand back the node's out-edge. */
  private linear(shape: NodeShape, label: string, incoming: Pending): Pending {
    const id = this.addNode(shape, label);
    this.connect(incoming, id);
    return [{ from: id }];
  }

  // ─── Control flow ────────────────────────────────────────────────────────────

  private emitIf(ctx: ReturnType<StatementContext['ifStatement']> & {}, incoming: Pending): Pending {
    const exprs = ctx.expr();
    const blocks = ctx.block();
    const elseifCount = ctx.ELSEIF().length;

    let noPending = incoming; // edges flowing into the next decision
    let merged: Pending = [];
    for (let i = 0; i <= elseifCount; i++) {
      const decId = this.addNode('decision', exprText(exprs[i]));
      this.connect(noPending, decId);
      const yesTail = this.emitBlock(blocks[i].statement(), [{ from: decId, label: 'Yes' }]);
      merged = merged.concat(yesTail);
      noPending = [{ from: decId, label: 'No' }];
    }

    if (ctx.ELSE()) {
      const elseTail = this.emitBlock(blocks[blocks.length - 1].statement(), noPending);
      merged = merged.concat(elseTail);
    } else {
      merged = merged.concat(noPending); // no ELSE → the final "No" falls through
    }
    return merged;
  }

  private emitCase(ctx: ReturnType<StatementContext['caseStatement']> & {}, incoming: Pending): Pending {
    const decId = this.addNode('decision', `CASE OF ${designatorText(ctx.designator())}`);
    this.connect(incoming, decId);

    let merged: Pending = [];
    for (const clause of ctx.caseClause()) {
      const label = clause
        .caseLabel()
        .map((l) => {
          const es = l.expr();
          return es.length === 2 ? `${exprText(es[0])} TO ${exprText(es[1])}` : exprText(es[0]);
        })
        .join(', ');
      merged = merged.concat(this.emitBlock(clause.block().statement(), [{ from: decId, label: truncate(label, 24) }]));
    }

    if (ctx.OTHERWISE() && ctx.block()) {
      merged = merged.concat(this.emitBlock(ctx.block()!.statement(), [{ from: decId, label: 'OTHERWISE' }]));
    } else {
      merged = merged.concat([{ from: decId, label: 'OTHERWISE' }]);
    }
    return merged;
  }

  private emitFor(ctx: ReturnType<StatementContext['forStatement']> & {}, incoming: Pending): Pending {
    const varName = ctx.identifier(0)!.getText();
    const exprs = ctx.expr();
    const startE = exprText(exprs[0]);
    const endE = exprText(exprs[1]);
    const stepText = exprs.length > 2 ? exprText(exprs[2]) : '1';
    const down = stepText.startsWith('-');
    if (exprs.length > 2 && !/^-?\d+$/.test(stepText)) {
      this.note('FOR … STEP is drawn assuming a positive step when the step is not a literal number.');
    }

    const initId = this.addNode('process', `${varName} ${ARROW} ${startE}`);
    this.connect(incoming, initId);

    const decId = this.addNode('decision', `${varName} ${down ? '≥' : '≤'} ${endE}`);
    this.connect([{ from: initId }], decId);

    const bodyTail = this.emitBlock(ctx.block().statement(), [{ from: decId, label: 'Yes' }]);
    const incLabel = down
      ? `${varName} ${ARROW} ${varName} - ${stepText.slice(1)}`
      : `${varName} ${ARROW} ${varName} + ${stepText}`;
    const incId = this.addNode('process', incLabel);
    this.connect(bodyTail, incId);
    this.connect([{ from: incId }], decId); // loop back

    return [{ from: decId, label: 'No' }];
  }

  private emitWhile(ctx: ReturnType<StatementContext['whileStatement']> & {}, incoming: Pending): Pending {
    const decId = this.addNode('decision', exprText(ctx.expr()));
    this.connect(incoming, decId);
    const bodyTail = this.emitBlock(ctx.block().statement(), [{ from: decId, label: 'Yes' }]);
    this.connect(bodyTail, decId); // loop back
    return [{ from: decId, label: 'No' }];
  }

  private emitRepeat(ctx: ReturnType<StatementContext['repeatStatement']> & {}, incoming: Pending): Pending {
    // Body runs first, then the UNTIL test loops back to the body's entry node.
    const startIdx = this.nodes.length;
    const bodyTail = this.emitBlock(ctx.block().statement(), incoming);
    const entryId = startIdx < this.nodes.length ? this.nodes[startIdx].id : null;

    const decId = this.addNode('decision', exprText(ctx.expr()));
    this.connect(bodyTail, decId);
    this.connect([{ from: decId, label: 'No' }], entryId ?? decId); // not yet true → loop back
    return [{ from: decId, label: 'Yes' }];
  }

  // ─── Routines ────────────────────────────────────────────────────────────────

  private emitRoutine(stmt: StatementContext): void {
    const pd = stmt.procedureDeclaration();
    const fd = stmt.functionDeclaration();

    let header: string;
    let endLabel: string;
    let block: BlockContext;
    let paramList: ParamListContext | null;
    if (pd) {
      paramList = pd.paramList();
      header = `PROCEDURE ${pd.identifier().getText()}(${paramText(paramList)})`;
      endLabel = 'ENDPROCEDURE';
      block = pd.block();
    } else if (fd) {
      paramList = fd.paramList();
      header = `FUNCTION ${fd.identifier().getText()}(${paramText(paramList)}) RETURNS ${fd.dataType().getText()}`;
      endLabel = 'ENDFUNCTION';
      block = fd.block();
    } else {
      return;
    }

    const startId = this.addNode('terminator', header);
    const endId = this.addNode('terminator', endLabel);
    const prevEnd = this.currentEndId;
    this.currentEndId = endId;
    const tail = this.emitBlock(block.statement(), [{ from: startId }]);
    this.connect(tail, endId);
    this.currentEndId = prevEnd;
  }
}

// ─── Label rendering (pure, no builder state) ─────────────────────────────────

function truncate(text: string, max = MAX_LABEL): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

/** Wrap a sub-expression in parentheses when it is itself compound, so labels stay unambiguous. */
function operand(ctx: ExprContext): string {
  const s = exprText(ctx);
  return ctx instanceof AtomExprContext ? s : `(${s})`;
}

function exprText(ctx: ExprContext): string {
  if (ctx instanceof NotExprContext) return `NOT ${operand(ctx.expr())}`;
  if (ctx instanceof UnaryMinusExprContext) return `-${operand(ctx.expr())}`;
  if (ctx instanceof PowerExprContext) return `${operand(ctx.expr(0)!)} ^ ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof MulDivExprContext) return `${operand(ctx.expr(0)!)} ${ctx._op!.text!} ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof AddSubExprContext) return `${operand(ctx.expr(0)!)} ${ctx._op!.text!} ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof ConcatExprContext) return `${operand(ctx.expr(0)!)} & ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof ComparisonExprContext) return `${operand(ctx.expr(0)!)} ${ctx._op!.text!} ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof AndExprContext) return `${operand(ctx.expr(0)!)} AND ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof OrExprContext) return `${operand(ctx.expr(0)!)} OR ${operand(ctx.expr(1)!)}`;
  if (ctx instanceof AtomExprContext) return atomText(ctx.atom());
  return ctx.getText();
}

function atomText(a: ReturnType<AtomExprContext['atom']>): string {
  if (a instanceof ParenAtomContext) return `(${exprText(a.expr())})`;
  if (a instanceof FunctionCallAtomContext) return `${a.identifier().getText()}(${argText(a.argList())})`;
  if (a instanceof NewInstanceAtomContext) return `NEW ${a.IDENTIFIER().getText()}(${argText(a.argList())})`;
  if (a instanceof DivFunctionAtomContext) return `DIV(${exprText(a.expr(0)!)}, ${exprText(a.expr(1)!)})`;
  if (a instanceof ModFunctionAtomContext) return `MOD(${exprText(a.expr(0)!)}, ${exprText(a.expr(1)!)})`;
  if (a instanceof DesignatorAtomContext) return designatorText(a.designator());
  return a.getText(); // literals, TRUE/FALSE, dates, address-of
}

function argText(ctx: ArgListContext | null): string {
  if (!ctx) return '';
  return ctx.expr().map(exprText).join(', ');
}

/** Designators (x, arr[i,j], rec.Field, ptr^, chains) read fine as their source text. */
function designatorText(ctx: DesignatorContext): string {
  return ctx.getText();
}

function dataTypeText(dt: DataTypeContext): string {
  if (dt.ARRAY()) {
    const elem = dt.dataType();
    const exprs = dt.expr();
    const bounds =
      exprs.length >= 4
        ? `${exprText(exprs[0])}:${exprText(exprs[1])}, ${exprText(exprs[2])}:${exprText(exprs[3])}`
        : `${exprText(exprs[0])}:${exprText(exprs[1])}`;
    return `ARRAY[${bounds}] OF ${elem ? dataTypeText(elem) : ''}`;
  }
  return dt.getText();
}

function declareText(ds: DeclareStatementContext): string {
  if (ds.ARRAY()) {
    const exprs = ds.expr();
    const names = ds.COMMA()
      ? [ds.identifier()!.getText()]
      : ds.identifierList()!.identifier().map((i) => i.getText());
    const bounds = ds.COMMA()
      ? `${exprText(exprs[0])}:${exprText(exprs[1])}, ${exprText(exprs[2])}:${exprText(exprs[3])}`
      : `${exprText(exprs[0])}:${exprText(exprs[1])}`;
    return `DECLARE ${names.join(', ')} : ARRAY[${bounds}] OF ${dataTypeText(ds.dataType())}`;
  }
  const names = ds.identifierList()!.identifier().map((i) => i.getText());
  return `DECLARE ${names.join(', ')} : ${dataTypeText(ds.dataType())}`;
}

function paramText(ctx: ParamListContext | null): string {
  if (!ctx) return '';
  return ctx.param().map((p) => `${p.identifier().getText()} : ${p.dataType().getText()}`).join(', ');
}
