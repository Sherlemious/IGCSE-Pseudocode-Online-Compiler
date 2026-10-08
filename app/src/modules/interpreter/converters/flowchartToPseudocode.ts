// Flowchart → pseudocode.
//
// The inverse of flowchartConverter: turns a drawn flowchart (FlowchartDoc) into
// a structured pseudocode program, so the flowchart builder can run, debug and
// grade through the ordinary interpreter and autograder. Pure and synchronous.
//
// Structuring works on the control-flow graph: DFS back edges find loops,
// dominators check every loop is entered only through its header (a reducible
// graph), and immediate post-dominators find where IF branches rejoin.
//   - a loop whose header decision is its only way out      → WHILE (or FOR)
//   - a loop whose one way out is a decision at the bottom  → REPEAT … UNTIL
//   - any other two-way decision                            → IF … ELSE … ENDIF
//   - a decision labelled CASE OF x                         → CASE … ENDCASE
// Drawings that can't be written as structured pseudocode (an arrow into the
// middle of a loop, a loop with two ways out) get an error on the node or arrow.

import { parse } from '../parser';
import { categorizeParseError, humanizeParseError, resolveOffendingLine } from '../errorMessages';
import type { FlowEdge } from './flowchartConverter';
import type { FlowchartDoc, FlowchartDocNode } from './flowchartDoc';

export interface FlowchartIssue {
  /** The box the problem is on, when there is one. */
  nodeId?: string;
  /** The arrow the problem is on, when there is one. */
  edgeId?: string;
  message: string;
  /** Error slug: `flowchart_*` for drawing problems, or the parse-error category of a box's text. */
  category: string;
}

export interface FlowchartProgram {
  /** Generated program; empty when the drawing itself has problems. */
  code: string;
  /** For each 0-based line of `code`, the node it came from (null for blank lines). */
  lineToNode: (string | null)[];
  errors: FlowchartIssue[];
}

const EXIT = '\u0000exit';
const INDENT = '    ';
/** Shared nodes can be emitted on more than one path; cap the output so a tangle can't blow up. */
const MAX_LINES = 4000;

type Kind = 'start' | 'routine' | 'end' | 'return' | 'process' | 'io' | 'subroutine' | 'decision' | 'case';

class FlowchartError extends Error {
  constructor(readonly issue: FlowchartIssue) {
    super(issue.message);
  }
}

export function flowchartToPseudocode(doc: FlowchartDoc): FlowchartProgram {
  try {
    return new Structurer(doc).run();
  } catch (e) {
    if (e instanceof FlowchartError) return { code: '', lineToNode: [], errors: [e.issue] };
    throw e;
  }
}

// ─── Label normalisation ─────────────────────────────────────────────────────

/** Apply `fn` to the parts of `text` outside string literals. */
function outsideStrings(text: string, fn: (s: string) => string): string {
  return text
    .split(/("[^"\n]*"?)/)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('');
}

/** Phone keyboards and the read-only diagram use symbols the lexer doesn't know. */
export function normalizeLabel(text: string): string {
  const quoted = text.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'");
  return outsideStrings(quoted, (s) =>
    s
      .replace(/←/g, '<-')
      .replace(/≤/g, '<=')
      .replace(/≥/g, '>=')
      .replace(/≠/g, '<>')
      .replace(/!=/g, '<>')
      .replace(/==/g, '=')
      .replace(/×/g, '*')
      .replace(/÷/g, '/'),
  ).trim();
}

function oneLine(text: string): string {
  return text.replace(/\s*\n\s*/g, ' ').trim();
}

function conditionText(label: string): string {
  let s = oneLine(normalizeLabel(label));
  s = s.replace(/\?+\s*$/, '').trim();
  s = s.replace(/^(IF|IS|WHILE|UNTIL)\s+/i, '').replace(/\s+THEN$/i, '').trim();
  return s;
}

function ioText(label: string): string | null {
  const s = oneLine(normalizeLabel(label));
  const m = s.match(/^(INPUT|READ|GET|ENTER|OUTPUT|PRINT|DISPLAY|WRITE|SHOW)\b\s*:?\s*(.*)$/i);
  if (m) {
    const isInput = /^(INPUT|READ|GET|ENTER)$/i.test(m[1]);
    return `${isInput ? 'INPUT' : 'OUTPUT'} ${m[2]}`.trim();
  }
  if (/^(READFILE|WRITEFILE|OPENFILE|CLOSEFILE|GETRECORD|PUTRECORD|SEEK)\b/i.test(s)) return s;
  return null;
}

const YES = /^(yes|y|true|t)$/i;
const NO = /^(no|n|false|f)$/i;
const OTHERWISE = /^otherwise$/i;

// ─── Dominators (Cooper, Harvey & Kennedy) ───────────────────────────────────

function idoms(entry: string, succ: (n: string) => string[]): { idom: Map<string, string>; order: Map<string, number> } {
  const post: string[] = [];
  const seen = new Set<string>([entry]);
  const stack: { n: string; i: number }[] = [{ n: entry, i: 0 }];
  while (stack.length) {
    const top = stack[stack.length - 1];
    const ss = succ(top.n);
    if (top.i < ss.length) {
      const next = ss[top.i++];
      if (!seen.has(next)) {
        seen.add(next);
        stack.push({ n: next, i: 0 });
      }
    } else {
      post.push(top.n);
      stack.pop();
    }
  }
  const order = new Map(post.map((n, i) => [n, i]));
  const preds = new Map<string, string[]>();
  for (const n of post) for (const s of succ(n)) if (order.has(s)) (preds.get(s) ?? preds.set(s, []).get(s)!).push(n);

  const idom = new Map<string, string>([[entry, entry]]);
  const intersect = (a: string, b: string) => {
    while (a !== b) {
      while (order.get(a)! < order.get(b)!) a = idom.get(a)!;
      while (order.get(b)! < order.get(a)!) b = idom.get(b)!;
    }
    return a;
  };
  const rpo = [...post].reverse();
  let changed = true;
  while (changed) {
    changed = false;
    for (const b of rpo) {
      if (b === entry) continue;
      let next: string | undefined;
      for (const p of preds.get(b) ?? []) {
        if (!idom.has(p)) continue;
        next = next === undefined ? p : intersect(p, next);
      }
      if (next !== undefined && idom.get(b) !== next) {
        idom.set(b, next);
        changed = true;
      }
    }
  }
  return { idom, order };
}

function dominates(idom: Map<string, string>, a: string, b: string): boolean {
  let x: string | undefined = b;
  while (x !== undefined) {
    if (x === a) return true;
    const up = idom.get(x);
    if (up === x) return false;
    x = up;
  }
  return false;
}

// ─── Structurer ──────────────────────────────────────────────────────────────

interface Line {
  text: string;
  node: string | null;
}

class Structurer {
  private nodes = new Map<string, FlowchartDocNode>();
  private outEdges = new Map<string, FlowEdge[]>();
  private inEdges = new Map<string, FlowEdge[]>();
  private kinds = new Map<string, Kind>();
  private issues: FlowchartIssue[] = [];
  private lines: Line[] = [];

  // Per component, filled by analyse().
  private pidom = new Map<string, string>();
  /** Back edges still to be structured, per loop header (source node ids). */
  private latches = new Map<string, Set<string>>();

  constructor(private readonly doc: FlowchartDoc) {
    for (const n of doc.nodes) {
      this.nodes.set(n.id, n);
      this.outEdges.set(n.id, []);
      this.inEdges.set(n.id, []);
    }
    for (const e of doc.edges) {
      if (!this.nodes.has(e.source) || !this.nodes.has(e.target)) continue;
      this.outEdges.get(e.source)!.push(e);
      this.inEdges.get(e.target)!.push(e);
    }
  }

  run(): FlowchartProgram {
    const starts = this.classify();
    if (this.issues.length) return this.fail();

    const main = starts.filter((s) => this.kinds.get(s) === 'start');
    const routines = starts.filter((s) => this.kinds.get(s) === 'routine');
    if (main.length === 0) {
      this.issue({ category: 'flowchart_no_start', message: 'Add a START box at the top of your flowchart.' });
      return this.fail();
    }
    for (const extra of main.slice(1)) {
      this.issue({
        nodeId: extra,
        category: 'flowchart_multiple_start',
        message: 'A flowchart has one START. Delete this one or join its steps to the main flow.',
      });
    }
    if (this.issues.length) return this.fail();

    const reachable = this.checkReachable(starts);
    for (const n of reachable) this.checkNode(n);
    if (this.issues.length) return this.fail();

    for (const r of routines) this.emitRoutine(r);
    this.emitMain(main[0]);
    if (this.issues.length) return this.fail();

    return this.finish();
  }

  // ─── Validation ──────────────────────────────────────────────────────────────

  private issue(i: FlowchartIssue): void {
    this.issues.push(i);
  }

  private fail(): FlowchartProgram {
    return { code: '', lineToNode: [], errors: this.issues };
  }

  private label(id: string): string {
    return this.nodes.get(id)?.label ?? '';
  }

  /** Assigns a Kind to every node; returns the start terminators. */
  private classify(): string[] {
    const starts: string[] = [];
    for (const n of this.nodes.values()) {
      const text = oneLine(n.label).toUpperCase();
      let kind: Kind;
      switch (n.shape) {
        case 'terminator':
          if (/^(START|BEGIN)\b/.test(text)) kind = 'start';
          else if (/^(PROCEDURE|FUNCTION)\b/.test(text)) kind = 'routine';
          else kind = 'end';
          break;
        case 'decision':
          kind = /^CASE\s+OF\b/.test(text) || this.outEdges.get(n.id)!.length > 2 ? 'case' : 'decision';
          break;
        case 'io':
          kind = 'io';
          break;
        case 'subroutine':
          kind = 'subroutine';
          break;
        default:
          kind = /^RETURN\b/.test(text) ? 'return' : 'process';
      }
      this.kinds.set(n.id, kind);
      if (kind === 'start' || kind === 'routine') {
        starts.push(n.id);
        for (const e of this.inEdges.get(n.id)!) {
          this.issue({
            edgeId: e.id,
            nodeId: n.id,
            category: 'flowchart_terminator_middle',
            message: `Nothing comes before ${kind === 'start' ? 'START' : 'the start of a subroutine'}. Remove this arrow.`,
          });
        }
      } else if (kind === 'end') {
        for (const e of this.outEdges.get(n.id)!) {
          this.issue({
            edgeId: e.id,
            nodeId: n.id,
            category: 'flowchart_terminator_middle',
            message: 'Nothing runs after STOP. Remove this arrow, or move STOP to the end.',
          });
        }
      }
    }
    return starts;
  }

  /** Flags boxes no arrow leads to; returns the ones that do run. */
  private checkReachable(starts: string[]): Set<string> {
    const seen = new Set<string>(starts);
    const queue = [...starts];
    while (queue.length) {
      const n = queue.pop()!;
      for (const e of this.outEdges.get(n)!) {
        if (!seen.has(e.target)) {
          seen.add(e.target);
          queue.push(e.target);
        }
      }
    }
    for (const n of this.nodes.keys()) {
      if (seen.has(n)) continue;
      // A spare STOP nothing points at is harmless (the blank canvas starts with one).
      if (this.kinds.get(n) === 'end' && this.inEdges.get(n)!.length === 0) continue;
      this.issue({
        nodeId: n,
        category: 'flowchart_unreachable',
        message: 'No arrow leads to this box from START, so it never runs. Join it to the flow or delete it.',
      });
    }
    return seen;
  }

  private checkNode(id: string): void {
    const kind = this.kinds.get(id)!;
    const outs = this.outEdges.get(id)!;
    const label = this.label(id).trim();
    if (kind === 'end') return;
    if ((kind === 'start' || kind === 'routine') && outs.length !== 1) {
      this.issue({
        nodeId: id,
        category: outs.length ? 'flowchart_extra_arrow' : 'flowchart_missing_arrow',
        message: outs.length
          ? 'START has one arrow out, to the first step.'
          : 'Draw an arrow from START to the first step.',
      });
      return;
    }
    if (kind === 'start' || kind === 'routine') return;

    if (!label) {
      this.issue({ nodeId: id, category: 'flowchart_empty_box', message: 'This box is empty. Type the step it does.' });
      return;
    }

    if (kind === 'return') {
      for (const e of outs) {
        if (this.kinds.get(e.target) !== 'end') {
          this.issue({
            edgeId: e.id,
            nodeId: id,
            category: 'flowchart_after_return',
            message: 'RETURN ends the subroutine, so this arrow should go to its end box.',
          });
        }
      }
      return;
    }

    if (kind === 'io' && ioText(label) === null) {
      this.issue({
        nodeId: id,
        category: 'flowchart_io_keyword',
        message: 'An input/output box starts with INPUT or OUTPUT, e.g. INPUT Age or OUTPUT "Hello".',
      });
      return;
    }

    if (kind === 'process' || kind === 'io' || kind === 'subroutine') {
      if (outs.length === 0) {
        this.issue({
          nodeId: id,
          category: 'flowchart_missing_arrow',
          message: 'Draw an arrow from this box to the next step (or to STOP).',
        });
      } else if (outs.length > 1) {
        this.issue({
          nodeId: id,
          category: 'flowchart_extra_arrow',
          message: 'Only a decision diamond can have more than one arrow out. Use a diamond to choose between paths.',
        });
      }
      return;
    }

    if (kind === 'decision') {
      if (outs.length < 2) {
        this.issue({
          nodeId: id,
          category: 'flowchart_missing_arrow',
          message: 'A decision needs two arrows out: one labelled Yes and one labelled No.',
        });
        return;
      }
      if (!this.yesNo(id)) {
        this.issue({
          nodeId: id,
          category: 'flowchart_branch_labels',
          message: 'Label the two arrows out of this diamond Yes and No.',
        });
      }
      return;
    }

    // CASE
    if (!/^CASE\s+OF\b/i.test(oneLine(label))) {
      this.issue({
        nodeId: id,
        category: 'flowchart_extra_arrow',
        message: 'A Yes/No decision has exactly two arrows out. For more choices, label the diamond CASE OF <variable>.',
      });
      return;
    }
    let otherwise = 0;
    for (const e of outs) {
      const l = (e.label ?? '').trim();
      if (!l) {
        this.issue({
          edgeId: e.id,
          nodeId: id,
          category: 'flowchart_branch_labels',
          message: 'Label each arrow out of a CASE diamond with a value (or OTHERWISE).',
        });
        return;
      }
      if (OTHERWISE.test(l)) otherwise++;
    }
    if (otherwise > 1) {
      this.issue({ nodeId: id, category: 'flowchart_branch_labels', message: 'Only one arrow can be OTHERWISE.' });
    }
  }

  /** The Yes and No targets of a two-way decision, or null when the arrows aren't labelled clearly. */
  private yesNo(id: string): { yes: string; no: string } | null {
    const outs = this.outEdges.get(id)!;
    if (outs.length !== 2) return null;
    const [a, b] = outs;
    const la = (a.label ?? '').trim();
    const lb = (b.label ?? '').trim();
    const isYes = (l: string) => YES.test(l);
    const isNo = (l: string) => NO.test(l);
    if (isYes(la) && (isNo(lb) || !lb)) return { yes: a.target, no: b.target };
    if (isNo(la) && (isYes(lb) || !lb)) return { yes: b.target, no: a.target };
    if (!la && isNo(lb)) return { yes: a.target, no: b.target };
    if (!la && isYes(lb)) return { yes: b.target, no: a.target };
    return null;
  }

  // ─── Graph helpers ──────────────────────────────────────────────────────────

  private succ = (id: string): string[] => {
    if (id === EXIT) return [];
    const kind = this.kinds.get(id);
    if (kind === 'end' || kind === 'return') return [EXIT];
    return this.outEdges.get(id)!.map((e) => e.target);
  };

  /** Prepare dominator data and loop headers for the component starting at `entry`. */
  private analyse(entry: string): void {
    // Component nodes and their predecessors (EXIT included).
    const comp = new Set<string>([entry]);
    const stack = [entry];
    while (stack.length) {
      for (const s of this.succ(stack.pop()!)) {
        if (!comp.has(s)) {
          comp.add(s);
          stack.push(s);
        }
      }
    }
    const preds = new Map<string, string[]>();
    for (const n of comp) for (const s of this.succ(n)) (preds.get(s) ?? preds.set(s, []).get(s)!).push(n);

    // Everything must be able to finish.
    const finishes = new Set<string>([EXIT]);
    const back = [EXIT];
    while (back.length) {
      for (const p of preds.get(back.pop()!) ?? []) {
        if (!finishes.has(p)) {
          finishes.add(p);
          back.push(p);
        }
      }
    }
    if (!comp.has(EXIT)) {
      throw new FlowchartError({
        nodeId: entry,
        category: 'flowchart_no_stop',
        message:
          this.kinds.get(entry) === 'start'
            ? 'This flowchart never reaches STOP. Draw an arrow to a STOP box.'
            : 'This subroutine never reaches its end box. Draw an arrow to it.',
      });
    }
    for (const n of comp) {
      if (!finishes.has(n)) {
        throw new FlowchartError({
          nodeId: n,
          category: 'flowchart_endless_loop',
          message: 'This loop never ends: no path from here reaches STOP. Add a decision that leads out of the loop.',
        });
      }
    }

    const dom = idoms(entry, this.succ).idom;
    this.pidom = idoms(EXIT, (n) => preds.get(n) ?? []).idom;

    // Back edges: an arrow to a node still on the DFS stack.
    const onStack = new Set<string>();
    const visited = new Set<string>();
    const walk: { n: string; i: number }[] = [{ n: entry, i: 0 }];
    onStack.add(entry);
    visited.add(entry);
    while (walk.length) {
      const top = walk[walk.length - 1];
      const ss = this.succ(top.n);
      if (top.i < ss.length) {
        const s = ss[top.i++];
        if (onStack.has(s)) {
          if (!dominates(dom, s, top.n)) {
            const edge = this.outEdges.get(top.n)!.find((e) => e.target === s);
            throw new FlowchartError({
              edgeId: edge?.id,
              nodeId: s,
              category: 'flowchart_jump_into_loop',
              message:
                'This arrow jumps into the middle of a loop. A loop is entered only at its top: point the arrow at the loop’s first box.',
            });
          }
          (this.latches.get(s) ?? this.latches.set(s, new Set()).get(s)!).add(top.n);
        } else if (!visited.has(s)) {
          visited.add(s);
          onStack.add(s);
          walk.push({ n: s, i: 0 });
        }
      } else {
        onStack.delete(top.n);
        walk.pop();
      }
    }
  }

  /** Nodes of the natural loop for `header` with back edges from `latches`. */
  private loopBody(header: string, latches: Iterable<string>): Set<string> {
    const body = new Set<string>([header]);
    const stack: string[] = [];
    for (const l of latches) {
      if (!body.has(l)) {
        body.add(l);
        stack.push(l);
      }
    }
    while (stack.length) {
      const n = stack.pop()!;
      for (const e of this.inEdges.get(n)!) {
        if (!body.has(e.source)) {
          body.add(e.source);
          stack.push(e.source);
        }
      }
    }
    return body;
  }

  /** Can any path from `from` reach one of `targets` (without going through EXIT)? */
  private reachesAny(from: string, targets: Set<string>): boolean {
    const seen = new Set<string>();
    const stack = [from];
    while (stack.length) {
      const n = stack.pop()!;
      if (targets.has(n)) return true;
      if (seen.has(n) || n === EXIT) continue;
      seen.add(n);
      stack.push(...this.succ(n));
    }
    return false;
  }

  /** Only RETURN boxes (never STOP) lie ahead: a way out of a loop that pseudocode can write. */
  private onlyReturnsAhead(from: string): boolean {
    const seen = new Set<string>();
    const stack = [from];
    while (stack.length) {
      const n = stack.pop()!;
      if (seen.has(n) || n === EXIT) continue;
      seen.add(n);
      if (this.kinds.get(n) === 'end') return false;
      stack.push(...this.succ(n));
    }
    return true;
  }

  // ─── Emission ───────────────────────────────────────────────────────────────

  private emit(depth: number, text: string, node: string | null): void {
    if (this.lines.length >= MAX_LINES) {
      throw new FlowchartError({
        category: 'flowchart_too_complex',
        message: 'This flowchart is too tangled to turn into pseudocode. Try tidying the arrows so paths join up.',
      });
    }
    this.lines.push({ text: INDENT.repeat(depth) + text, node });
  }

  private emitMain(start: string): void {
    this.latches = new Map();
    this.analyse(start);
    if (this.lines.length) this.emit(0, '', null);
    this.emitRegion(this.succ(start)[0], new Set([EXIT]), 0);
  }

  private emitRoutine(start: string): void {
    this.latches = new Map();
    this.analyse(start);
    const header = oneLine(normalizeLabel(this.label(start)));
    const isFunction = /^FUNCTION\b/i.test(header);
    if (this.lines.length) this.emit(0, '', null);
    this.emit(0, header, start);
    this.emitRegion(this.succ(start)[0], new Set([EXIT]), 1);
    this.emit(0, isFunction ? 'ENDFUNCTION' : 'ENDPROCEDURE', start);
  }

  /** Emit statements from `from` until the flow reaches one of `stops` (or ends). */
  private emitRegion(from: string, stops: Set<string>, depth: number): void {
    let cur = from;
    while (!stops.has(cur) && cur !== EXIT) {
      if (this.latches.get(cur)?.size) {
        cur = this.emitLoop(cur, stops, depth);
        continue;
      }
      const kind = this.kinds.get(cur)!;
      const label = this.label(cur);
      switch (kind) {
        case 'end':
          return;
        case 'return':
          this.emit(depth, oneLine(normalizeLabel(label)).replace(/^return\b/i, 'RETURN'), cur);
          return;
        case 'process':
          for (const line of normalizeLabel(label).split('\n')) {
            if (line.trim()) this.emit(depth, line.trim(), cur);
          }
          cur = this.succ(cur)[0];
          break;
        case 'io':
          this.emit(depth, ioText(label)!, cur);
          cur = this.succ(cur)[0];
          break;
        case 'subroutine': {
          const call = oneLine(normalizeLabel(label));
          this.emit(depth, /^CALL\b/i.test(call) ? call : `CALL ${call}`, cur);
          cur = this.succ(cur)[0];
          break;
        }
        case 'decision':
          cur = this.emitIf(cur, stops, depth);
          break;
        case 'case':
          cur = this.emitCase(cur, stops, depth);
          break;
        default:
          return;
      }
    }
  }

  private emitIf(id: string, stops: Set<string>, depth: number): string {
    const { yes, no } = this.yesNo(id)!;
    const cond = conditionText(this.label(id));
    const join = this.pidom.get(id) ?? EXIT;

    // One branch ends in RETURN while the other carries on: write the early return
    // as a one-armed IF and keep going with the other branch.
    if (join === EXIT && !stops.has(EXIT)) {
      const live = new Set([...stops].filter((s) => s !== EXIT));
      const yesEnds = !this.reachesAny(yes, live);
      const noEnds = !this.reachesAny(no, live);
      if (yesEnds !== noEnds) {
        const [ends, goesOn, test] = yesEnds ? [yes, no, cond] : [no, yes, `NOT (${cond})`];
        this.emit(depth, `IF ${test} THEN`, id);
        this.emitRegion(ends, new Set([...stops, EXIT]), depth + 1);
        this.emit(depth, 'ENDIF', id);
        return goesOn;
      }
    }

    const inner = new Set([...stops, join]);
    if (yes === join && no !== join) {
      this.emit(depth, `IF NOT (${cond}) THEN`, id);
      this.emitRegion(no, inner, depth + 1);
    } else {
      this.emit(depth, `IF ${cond} THEN`, id);
      this.emitRegion(yes, inner, depth + 1);
      if (no !== join) {
        this.emit(depth, 'ELSE', id);
        this.emitRegion(no, inner, depth + 1);
      }
    }
    this.emit(depth, 'ENDIF', id);
    return join;
  }

  private emitCase(id: string, stops: Set<string>, depth: number): string {
    const subject = oneLine(normalizeLabel(this.label(id))).replace(/^CASE\s+OF\s+/i, '');
    const join = this.pidom.get(id) ?? EXIT;
    const inner = new Set([...stops, join]);
    const outs = this.outEdges.get(id)!;
    const otherwise = outs.find((e) => OTHERWISE.test((e.label ?? '').trim()));

    this.emit(depth, `CASE OF ${subject}`, id);
    for (const e of outs) {
      if (e === otherwise) continue;
      this.emit(depth + 1, `${normalizeLabel(e.label ?? '')} :`, id);
      this.emitRegion(e.target, inner, depth + 2);
    }
    if (otherwise && otherwise.target !== join) {
      this.emit(depth + 1, 'OTHERWISE :', id);
      this.emitRegion(otherwise.target, inner, depth + 2);
    }
    this.emit(depth, 'ENDCASE', id);
    return join;
  }

  /** Emit the loop headed at `h`; returns the node the flow continues at after it. */
  private emitLoop(h: string, stops: Set<string>, depth: number): string {
    const latches = this.latches.get(h)!;
    const body = this.loopBody(h, latches);

    // Ways out of the loop. A branch into a RETURN-only region is an early return
    // (written inside the loop as IF … RETURN), so it doesn't count against the
    // loop having a single exit.
    const exits: { from: string; early: boolean }[] = [];
    for (const n of body) {
      for (const s of this.succ(n)) {
        if (body.has(s)) continue;
        const branching = this.kinds.get(n) === 'decision' || this.kinds.get(n) === 'case';
        exits.push({ from: n, early: s !== EXIT && branching && this.onlyReturnsAhead(s) });
      }
    }
    const onlyExit = (x: string) => exits.every((e) => e.from === x || e.early);

    // WHILE: the header decision is the only way out.
    if (this.kinds.get(h) === 'decision' && onlyExit(h)) {
      const { yes, no } = this.yesNo(h)!;
      const inYes = body.has(yes);
      if (inYes !== body.has(no)) {
        const [inside, outside] = inYes ? [yes, no] : [no, yes];
        const cond = conditionText(this.label(h));
        const saved = new Set(latches);
        latches.clear();
        if (!this.emitFor(h, saved, inside, inYes, cond, stops, depth)) {
          this.emit(depth, `WHILE ${inYes ? cond : `NOT (${cond})`} DO`, h);
          this.emitRegion(inside, new Set([...stops, h]), depth + 1);
          this.emit(depth, 'ENDWHILE', h);
        }
        for (const l of saved) latches.add(l);
        return outside;
      }
    }

    // REPEAT … UNTIL: one decision at the bottom, arrowing back to the top, is the only way out.
    for (const d of latches) {
      const yn = this.kinds.get(d) === 'decision' ? this.yesNo(d) : null;
      if (d === h || !yn || !onlyExit(d)) continue;
      const exitYes = yn.no === h;
      const outside = exitYes ? yn.yes : yn.no;
      if ((yn.yes !== h && yn.no !== h) || body.has(outside)) continue;
      const cond = conditionText(this.label(d));
      latches.delete(d);
      this.emit(depth, 'REPEAT', h);
      // Any back edges left to `h` belong to loops nested at the same top box.
      this.emitRegion(h, new Set([...stops, d]), depth + 1);
      this.emit(depth, `UNTIL ${exitYes ? cond : `NOT (${cond})`}`, d);
      latches.add(d);
      return outside;
    }

    throw new FlowchartError({
      nodeId: h,
      category: 'flowchart_loop_exit',
      message:
        'This loop needs exactly one way out: a decision at the top (a WHILE loop) or at the bottom that arrows back up (REPEAT … UNTIL).',
    });
  }

  /**
   * `v ← a` → decision `v ≤ b` → body → `v ← v + k` → back: write it as FOR, as the
   * flowchart converter draws it. Falls back to WHILE (returns false) whenever the
   * shape or the body could make FOR behave differently.
   */
  private emitFor(
    h: string,
    latches: Set<string>,
    inside: string,
    inYes: boolean,
    cond: string,
    stops: Set<string>,
    depth: number,
  ): boolean {
    if (!inYes || latches.size !== 1) return false;
    const latch = [...latches][0];
    if (this.kinds.get(latch) !== 'process' || latch === inside) return false;
    const prev = this.lines[this.lines.length - 1];
    if (!prev?.node || this.kinds.get(prev.node) !== 'process' || this.succ(prev.node)[0] !== h) return false;
    if (this.inEdges.get(h)!.length !== 2) return false;

    const test = cond.match(/^([A-Za-z_]\w*)\s*(<=|>=)\s*(.+)$/);
    if (!test) return false;
    const [, v, op, end] = test;
    const init = oneLine(normalizeLabel(this.label(prev.node))).match(/^([A-Za-z_]\w*)\s*<-\s*(.+)$/);
    if (!init || init[1] !== v) return false;
    const inc = oneLine(normalizeLabel(this.label(latch))).match(
      new RegExp(`^${v}\\s*<-\\s*${v}\\s*([+-])\\s*(\\d+(?:\\.\\d+)?)$`),
    );
    if (!inc) return false;
    const [, sign, k] = inc;
    if ((op === '<=') !== (sign === '+') || Number(k) === 0) return false;

    // FOR evaluates its bounds once and owns its counter: the body must not change either.
    const watched = new Set([v, ...(end.match(/[A-Za-z_]\w*/g) ?? [])]);
    const body = this.loopBody(h, latches);
    for (const n of body) {
      if (n === h || n === latch) continue;
      for (const line of normalizeLabel(this.label(n)).split('\n')) {
        const target =
          line.match(/^\s*([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?\s*<-/) ??
          line.match(/^\s*(?:INPUT|READ|GET|ENTER)\s+([A-Za-z_]\w*)/i);
        if (target && watched.has(target[1])) return false;
      }
    }

    this.lines.pop();
    const step = sign === '+' ? (k === '1' ? '' : ` STEP ${k}`) : ` STEP -${k}`;
    this.emit(depth, `FOR ${v} <- ${init[2]} TO ${end}${step}`, h);
    this.emitRegion(inside, new Set([...stops, latch, h]), depth + 1);
    this.emit(depth, `NEXT ${v}`, h);
    return true;
  }

  // ─── Finish: parse check, map errors to boxes ───────────────────────────────

  private finish(): FlowchartProgram {
    const code = this.lines.map((l) => l.text).join('\n') + '\n';
    const lineToNode = this.lines.map((l) => l.node);
    const { errors } = parse(code);
    const lines = code.split('\n');
    const issues: FlowchartIssue[] = [];
    const seen = new Set<string>();
    for (const e of errors) {
      const at = resolveOffendingLine(lines, e.line);
      const lineNo = at.line ?? e.line ?? null;
      const nodeId = lineNo ? (lineToNode[lineNo - 1] ?? undefined) : undefined;
      const key = nodeId ?? '';
      if (seen.has(key)) continue;
      seen.add(key);
      issues.push({
        nodeId,
        message: humanizeParseError(e.message, at.text, { lines, line: at.line }),
        category: categorizeParseError(e.message, at.text, { lines, line: at.line }),
      });
    }
    return { code, lineToNode, errors: issues };
  }
}
