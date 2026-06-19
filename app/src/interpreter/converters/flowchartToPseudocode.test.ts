import { describe, it, expect } from 'vitest';
import { flowchartToPseudocode } from './flowchartToPseudocode';
import type { FlowNode, FlowEdge } from './flowchartConverter';

const N = (id: string, shape: FlowNode['shape'], label: string): FlowNode => ({ id, shape, label });
const E = (source: string, target: string, label?: string): FlowEdge => ({ id: `${source}->${target}`, source, target, label });

const code = (nodes: FlowNode[], edges: FlowEdge[]) => {
  const r = flowchartToPseudocode(nodes, edges);
  expect(r.errors).toEqual([]);
  return r.code;
};

describe('flowchartToPseudocode — sequence & I/O', () => {
  it('emits statements in order with a line→node map', () => {
    const nodes = [N('s', 'terminator', 'START'), N('a', 'process', 'x ← 5'), N('b', 'io', 'OUTPUT x'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'a'), E('a', 'b'), E('b', 'e')];
    const r = flowchartToPseudocode(nodes, edges);
    expect(r.code).toBe('x ← 5\nOUTPUT x');
    expect(r.lineToNode).toEqual({ 1: 'a', 2: 'b' });
  });

  it('treats a subroutine box as a CALL line', () => {
    const nodes = [N('s', 'terminator', 'START'), N('c', 'subroutine', 'CALL Greet()'), N('e', 'terminator', 'STOP')];
    expect(code(nodes, [E('s', 'c'), E('c', 'e')])).toBe('CALL Greet()');
  });
});

describe('flowchartToPseudocode — selection', () => {
  it('IF / ELSE from a decision whose branches reconverge', () => {
    const nodes = [N('s', 'terminator', 'START'), N('d', 'decision', 'a > 1'), N('t', 'io', 'OUTPUT 1'), N('f', 'io', 'OUTPUT 2'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'd'), E('d', 't', 'Yes'), E('d', 'f', 'No'), E('t', 'e'), E('f', 'e')];
    expect(code(nodes, edges)).toBe('IF a > 1 THEN\n    OUTPUT 1\nELSE\n    OUTPUT 2\nENDIF');
  });

  it('IF with no ELSE when the No branch goes straight to the merge', () => {
    const nodes = [N('s', 'terminator', 'START'), N('d', 'decision', 'a > 1'), N('t', 'io', 'OUTPUT 1'), N('m', 'process', 'y ← 2'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'd'), E('d', 't', 'Yes'), E('d', 'm', 'No'), E('t', 'm'), E('m', 'e')];
    expect(code(nodes, edges)).toBe('IF a > 1 THEN\n    OUTPUT 1\nENDIF\ny ← 2');
  });

  it('chains ELSEIF when the else-branch is a lone decision with the same merge', () => {
    const nodes = [
      N('s', 'terminator', 'START'),
      N('d1', 'decision', 'a > 2'), N('o1', 'io', 'OUTPUT 1'),
      N('d2', 'decision', 'a > 0'), N('o2', 'io', 'OUTPUT 2'),
      N('o3', 'io', 'OUTPUT 3'), N('e', 'terminator', 'STOP'),
    ];
    const edges = [
      E('s', 'd1'), E('d1', 'o1', 'Yes'), E('d1', 'd2', 'No'),
      E('d2', 'o2', 'Yes'), E('d2', 'o3', 'No'),
      E('o1', 'e'), E('o2', 'e'), E('o3', 'e'),
    ];
    expect(code(nodes, edges)).toBe('IF a > 2 THEN\n    OUTPUT 1\nELSEIF a > 0 THEN\n    OUTPUT 2\nELSE\n    OUTPUT 3\nENDIF');
  });
});

describe('flowchartToPseudocode — iteration', () => {
  it('WHILE from a decision with a back-edge from its body', () => {
    const nodes = [N('s', 'terminator', 'START'), N('d', 'decision', 'x < 3'), N('b', 'process', 'x ← x + 1'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'd'), E('d', 'b', 'Yes'), E('b', 'd'), E('d', 'e', 'No')];
    expect(code(nodes, edges)).toBe('WHILE x < 3 DO\n    x ← x + 1\nENDWHILE');
  });

  it('negates the condition when Yes is the exit branch', () => {
    const nodes = [N('s', 'terminator', 'START'), N('d', 'decision', 'x >= 3'), N('b', 'process', 'x ← x + 1'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'd'), E('d', 'e', 'Yes'), E('d', 'b', 'No'), E('b', 'd')];
    expect(code(nodes, edges)).toBe('WHILE NOT (x >= 3) DO\n    x ← x + 1\nENDWHILE');
  });

  it('REPEAT…UNTIL from a bottom decision looping back to the body head', () => {
    const nodes = [N('s', 'terminator', 'START'), N('h', 'process', 'x ← x + 1'), N('d', 'decision', 'x >= 3'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'h'), E('h', 'd'), E('d', 'e', 'Yes'), E('d', 'h', 'No')];
    expect(code(nodes, edges)).toBe('REPEAT\n    x ← x + 1\nUNTIL x >= 3');
  });

  it('nests an IF inside a WHILE', () => {
    const nodes = [
      N('s', 'terminator', 'START'), N('w', 'decision', 'i < n'),
      N('if', 'decision', 'a[i] > m'), N('upd', 'process', 'm ← a[i]'),
      N('inc', 'process', 'i ← i + 1'), N('e', 'terminator', 'STOP'),
    ];
    const edges = [
      E('s', 'w'), E('w', 'if', 'Yes'), E('w', 'e', 'No'),
      E('if', 'upd', 'Yes'), E('if', 'inc', 'No'), E('upd', 'inc'), E('inc', 'w'),
    ];
    expect(code(nodes, edges)).toBe(
      'WHILE i < n DO\n    IF a[i] > m THEN\n        m ← a[i]\n    ENDIF\n    i ← i + 1\nENDWHILE',
    );
  });
});

describe('flowchartToPseudocode — errors', () => {
  it('a non-decision with two outgoing arrows errors, pointing at the node', () => {
    const nodes = [N('s', 'terminator', 'START'), N('a', 'process', 'x ← 1'), N('b', 'io', 'OUTPUT 1'), N('c', 'io', 'OUTPUT 2'), N('e', 'terminator', 'STOP')];
    const edges = [E('s', 'a'), E('a', 'b'), E('a', 'c'), E('b', 'e'), E('c', 'e')];
    const r = flowchartToPseudocode(nodes, edges);
    expect(r.code).toBe('');
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].nodeId).toBe('a');
  });

  it('a graph with no start errors', () => {
    const r = flowchartToPseudocode([N('a', 'process', 'x ← 1'), N('b', 'process', 'y ← 2')], [E('a', 'b'), E('b', 'a')]);
    expect(r.errors).toHaveLength(1);
  });

  it('a node not connected to the start errors, pointing at it', () => {
    const nodes = [N('s', 'terminator', 'START'), N('a', 'process', 'x ← 1'), N('e', 'terminator', 'STOP'), N('stray', 'process', 'y ← 2')];
    const edges = [E('s', 'a'), E('a', 'e')];
    const r = flowchartToPseudocode(nodes, edges);
    expect(r.code).toBe('');
    expect(r.errors[0].nodeId).toBe('stray');
  });

  it('a reachable step with no outgoing arrow errors, pointing at it', () => {
    const nodes = [N('s', 'terminator', 'START'), N('a', 'process', 'x ← 1')];
    const edges = [E('s', 'a')];
    const r = flowchartToPseudocode(nodes, edges);
    expect(r.code).toBe('');
    expect(r.errors[0].nodeId).toBe('a');
  });

  it('empty graph yields empty code', () => {
    expect(flowchartToPseudocode([], [])).toEqual({ code: '', errors: [], lineToNode: {} });
  });

  it('a seed canvas (START + STOP, no edges) is treated as empty, not an error', () => {
    const r = flowchartToPseudocode([N('s', 'terminator', 'START'), N('e', 'terminator', 'STOP')], []);
    expect(r.errors).toEqual([]);
    expect(r.code).toBe('');
  });
});
