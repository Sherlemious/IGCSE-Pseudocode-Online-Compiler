import { describe, it, expect } from 'vitest';
import { convertToFlowchart, type FlowchartConversion } from './flowchartConverter';
import { examples } from '../../data/examples';

function fc(src: string): FlowchartConversion {
  const r = convertToFlowchart(src);
  expect(r.errors).toEqual([]);
  return r;
}

const byLabel = (r: FlowchartConversion, label: string) => r.nodes.find((n) => n.label === label);
const out = (r: FlowchartConversion, id: string) => r.edges.filter((e) => e.source === id);
const target = (r: FlowchartConversion, id: string) => r.nodes.find((n) => n.id === id);

describe('flowchartConverter — sequence & I/O', () => {
  it('START → process → I/O → STOP', () => {
    const r = fc('x <- 5\nOUTPUT x\n');
    const start = byLabel(r, 'START')!;
    expect(start.shape).toBe('terminator');

    const proc = target(r, out(r, start.id)[0].target)!;
    expect(proc.shape).toBe('process');
    expect(proc.label).toBe('x ← 5');

    const io = target(r, out(r, proc.id)[0].target)!;
    expect(io.shape).toBe('io');
    expect(io.label).toBe('OUTPUT x');

    expect(target(r, out(r, io.id)[0].target)!.label).toBe('STOP');
  });

  it('INPUT is an I/O node', () => {
    const r = fc('INPUT n\n');
    expect(r.nodes.some((n) => n.shape === 'io' && n.label === 'INPUT n')).toBe(true);
  });

  it('OUTPUT joins multiple items', () => {
    const r = fc('OUTPUT "Sum: ", x\n');
    expect(r.nodes.some((n) => n.shape === 'io' && n.label === 'OUTPUT "Sum: ", x')).toBe(true);
  });
});

describe('flowchartConverter — selection', () => {
  it('IF/ELSE branches with Yes/No that merge', () => {
    const r = fc('IF a > 1 THEN\nOUTPUT 1\nELSE\nOUTPUT 2\nENDIF\n');
    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(dec.label).toBe('a > 1');

    const yes = out(r, dec.id).find((e) => e.label === 'Yes')!;
    const no = out(r, dec.id).find((e) => e.label === 'No')!;
    expect(target(r, yes.target)!.label).toBe('OUTPUT 1');
    expect(target(r, no.target)!.label).toBe('OUTPUT 2');

    // both branches converge on the same successor (STOP)
    expect(out(r, yes.target)[0].target).toBe(out(r, no.target)[0].target);
  });

  it('ELSEIF chains into the No branch (two decisions)', () => {
    const r = fc('IF a > 1 THEN\nOUTPUT 1\nELSEIF a > 0 THEN\nOUTPUT 2\nELSE\nOUTPUT 3\nENDIF\n');
    const decisions = r.nodes.filter((n) => n.shape === 'decision');
    expect(decisions.length).toBe(2);
    const firstNo = out(r, decisions[0].id).find((e) => e.label === 'No')!;
    expect(firstNo.target).toBe(decisions[1].id);
  });

  it('ELSE IF (two words) chains the same as ELSEIF', () => {
    const r = fc('IF a > 1 THEN\nOUTPUT 1\nELSE IF a > 0 THEN\nOUTPUT 2\nELSE\nOUTPUT 3\nENDIF\n');
    const decisions = r.nodes.filter((n) => n.shape === 'decision');
    expect(decisions.length).toBe(2);
    const firstNo = out(r, decisions[0].id).find((e) => e.label === 'No')!;
    expect(firstNo.target).toBe(decisions[1].id);
  });

  it('CASE makes one labeled edge per clause plus OTHERWISE', () => {
    const r = fc('CASE OF g\n1 : OUTPUT "A"\nOTHERWISE : OUTPUT "C"\nENDCASE\n');
    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(dec.label).toBe('CASE OF g');
    const labels = out(r, dec.id).map((e) => e.label);
    expect(labels).toContain('1');
    expect(labels).toContain('OTHERWISE');
  });

  it('CASE ranges render as "a TO b"', () => {
    const r = fc('CASE OF g\n90 TO 100 : OUTPUT "A"\nENDCASE\n');
    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(out(r, dec.id).some((e) => e.label === '90 TO 100')).toBe(true);
  });
});

describe('flowchartConverter — iteration', () => {
  it('FOR builds init, decision, increment, and a back-edge', () => {
    const r = fc('FOR i <- 1 TO 5\nOUTPUT i\nNEXT i\n');
    expect(byLabel(r, 'i ← 1')!.shape).toBe('process');

    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(dec.label).toBe('i ≤ 5');
    expect(out(r, dec.id).some((e) => e.label === 'Yes')).toBe(true);
    expect(out(r, dec.id).some((e) => e.label === 'No')).toBe(true);

    const inc = byLabel(r, 'i ← i + 1')!;
    expect(out(r, inc.id).some((e) => e.target === dec.id)).toBe(true); // loop back
  });

  it('FOR with negative literal STEP counts down', () => {
    const r = fc('FOR i <- 5 TO 1 STEP -1\nOUTPUT i\nNEXT i\n');
    expect(r.nodes.find((n) => n.shape === 'decision')!.label).toBe('i ≥ 1');
    expect(byLabel(r, 'i ← i - 1')).toBeTruthy();
  });

  it('WHILE loops the body back to the decision', () => {
    const r = fc('WHILE x < 3 DO\nx <- x + 1\nENDWHILE\n');
    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(dec.label).toBe('x < 3');
    const body = byLabel(r, 'x ← x + 1')!;
    expect(out(r, body.id).some((e) => e.target === dec.id)).toBe(true);
    expect(out(r, dec.id).some((e) => e.label === 'No')).toBe(true);
  });

  it('REPEAT runs the body first, then loops No back to the body', () => {
    const r = fc('REPEAT\nx <- x + 1\nUNTIL x >= 3\n');
    const body = byLabel(r, 'x ← x + 1')!;
    const dec = r.nodes.find((n) => n.shape === 'decision')!;
    expect(dec.label).toBe('x >= 3');
    expect(out(r, dec.id).some((e) => e.label === 'No' && e.target === body.id)).toBe(true);
    expect(out(r, dec.id).some((e) => e.label === 'Yes')).toBe(true);
  });
});

describe('flowchartConverter — routines', () => {
  it('a PROCEDURE becomes its own terminator-bounded component; CALL is a subroutine box', () => {
    const r = fc('PROCEDURE Greet()\nOUTPUT "hi"\nENDPROCEDURE\nCALL Greet()\n');
    expect(r.nodes.some((n) => n.shape === 'terminator' && n.label.startsWith('PROCEDURE Greet'))).toBe(true);
    expect(r.nodes.some((n) => n.shape === 'terminator' && n.label === 'ENDPROCEDURE')).toBe(true);
    expect(r.nodes.some((n) => n.shape === 'subroutine' && n.label === 'CALL Greet()')).toBe(true);
  });

  it('FUNCTION RETURN connects to the end terminator', () => {
    const r = fc('FUNCTION Sq(n : INTEGER) RETURNS INTEGER\nRETURN n * n\nENDFUNCTION\n');
    expect(byLabel(r, 'FUNCTION Sq(n : INTEGER) RETURNS INTEGER')!.shape).toBe('terminator');
    const ret = byLabel(r, 'RETURN n * n')!;
    const end = r.nodes.find((n) => n.shape === 'terminator' && n.label === 'ENDFUNCTION')!;
    expect(out(r, ret.id).some((e) => e.target === end.id)).toBe(true);
  });
});

describe('flowchartConverter — expressions & degradation', () => {
  it('parenthesises compound operands to keep labels unambiguous', () => {
    const r = fc('x <- (a + b) * c\n');
    expect(byLabel(r, 'x ← (a + b) * c')).toBeTruthy();
  });

  it('records/classes degrade to a single box with a note', () => {
    const r = fc('CLASS Pet\n  PRIVATE Name : STRING\nENDCLASS\n');
    expect(r.nodes.some((n) => n.shape === 'process' && n.label === 'CLASS Pet')).toBe(true);
    expect(r.notes.length).toBeGreaterThan(0);
  });
});

describe('flowchartConverter — errors & corpus', () => {
  it('returns parse errors and an empty graph for invalid pseudocode', () => {
    const r = convertToFlowchart('IF x THEN\nOUTPUT 1\n'); // missing ENDIF
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.nodes).toEqual([]);
  });

  it('empty input yields an empty graph', () => {
    expect(convertToFlowchart('   ')).toEqual({ nodes: [], edges: [], notes: [], errors: [] });
  });

  it('every built-in example converts to a valid, non-dangling graph', () => {
    for (const ex of examples) {
      const r = convertToFlowchart(ex.code);
      expect(r.errors, `parse errors in "${ex.title}"`).toEqual([]);
      expect(r.nodes.length, `no nodes for "${ex.title}"`).toBeGreaterThan(0);
      const ids = new Set(r.nodes.map((n) => n.id));
      for (const e of r.edges) {
        expect(ids.has(e.source), `dangling source in "${ex.title}"`).toBe(true);
        expect(ids.has(e.target), `dangling target in "${ex.title}"`).toBe(true);
      }
    }
  });
});
