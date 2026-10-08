import { describe, expect, it } from 'vitest';
import { gradeTestCases } from '@/modules/practice/autograder';
import type { NodeShape } from './flowchartConverter';
import { convertToFlowchart } from './flowchartConverter';
import {
  blankAnswers,
  docFromConversion,
  fillBlanks,
  makeTemplate,
  parseFlowchartDoc,
  type FlowchartDoc,
} from './flowchartDoc';
import { flowchartToPseudocode } from './flowchartToPseudocode';

const SHAPE: Record<string, NodeShape> = { T: 'terminator', P: 'process', IO: 'io', D: 'decision', S: 'subroutine' };

/** Compact hand-drawn doc: nodes `[id, shape, label]`, edges `[from, to, label?]`. */
function doc(nodes: [string, keyof typeof SHAPE, string][], edges: [string, string, string?][]): FlowchartDoc {
  return {
    version: 1,
    nodes: nodes.map(([id, s, label]) => ({ id, shape: SHAPE[s], label })),
    edges: edges.map(([source, target, label], i) => ({ id: `e${i}`, source, target, ...(label ? { label } : {}) })),
  };
}

function code(d: FlowchartDoc): string {
  const r = flowchartToPseudocode(d);
  expect(r.errors).toEqual([]);
  return r.code.trim();
}

async function outputs(d: FlowchartDoc, inputs: string[]): Promise<string> {
  const r = flowchartToPseudocode(d);
  expect(r.errors).toEqual([]);
  const [res] = await gradeTestCases(r.code, [{ inputs, expectedOutput: '' }]);
  expect(res.error ?? null).toBeNull();
  return res.actualOutput ?? '';
}

function firstError(d: FlowchartDoc) {
  const r = flowchartToPseudocode(d);
  expect(r.errors.length).toBeGreaterThan(0);
  return r.errors[0];
}

// START → INPUT A, B → A > B? → OUTPUT A | OUTPUT B → STOP
const larger = () =>
  doc(
    [
      ['s', 'T', 'START'],
      ['i1', 'IO', 'Input A'],
      ['i2', 'IO', 'INPUT B'],
      ['d', 'D', 'Is A > B?'],
      ['oa', 'IO', 'OUTPUT A'],
      ['ob', 'IO', 'Print B'],
      ['x', 'T', 'STOP'],
      ['x2', 'T', 'END'],
    ],
    [
      ['s', 'i1'],
      ['i1', 'i2'],
      ['i2', 'd'],
      ['d', 'oa', 'Yes'],
      ['d', 'ob', 'No'],
      ['oa', 'x'],
      ['ob', 'x2'],
    ],
  );

describe('flowchartToPseudocode — hand-drawn flowcharts', () => {
  it('writes selection, normalising I/O words and the decision text', () => {
    expect(code(larger())).toBe(
      ['INPUT A', 'INPUT B', 'IF A > B THEN', '    OUTPUT A', 'ELSE', '    OUTPUT B', 'ENDIF'].join('\n'),
    );
  });

  it('runs: INPUT works without DECLARE', async () => {
    expect((await outputs(larger(), ['3', '9'])).trim()).toBe('9');
    expect((await outputs(larger(), ['12', '9'])).trim()).toBe('12');
  });

  it('accepts arrows, ≤ and smart quotes from phone keyboards', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['p', 'P', 'Total ← 0'],
        ['d', 'D', 'Total ≤ 3'],
        ['o', 'IO', 'OUTPUT “ok ≤ fine”'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'p'],
        ['p', 'd'],
        ['d', 'o', 'Y'],
        ['d', 'x', 'N'],
        ['o', 'x'],
      ],
    );
    expect(code(d)).toBe(['Total <- 0', 'IF Total <= 3 THEN', '    OUTPUT "ok ≤ fine"', 'ENDIF'].join('\n'));
  });

  it('infers the other branch when only one arrow is labelled', () => {
    const d = larger();
    d.edges[4].label = undefined; // the No arrow
    expect(code(d)).toContain('IF A > B THEN');
  });

  it('writes a pre-test loop as WHILE, negating a No-inside condition', async () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['p', 'P', 'n <- 1'],
        ['d', 'D', 'n > 3'],
        ['o', 'IO', 'OUTPUT n'],
        ['inc', 'P', 'n <- n * 2'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'p'],
        ['p', 'd'],
        ['d', 'o', 'No'],
        ['o', 'inc'],
        ['inc', 'd'],
        ['d', 'x', 'Yes'],
      ],
    );
    expect(code(d)).toBe(['n <- 1', 'WHILE NOT (n > 3) DO', '    OUTPUT n', '    n <- n * 2', 'ENDWHILE'].join('\n'));
    expect((await outputs(d, [])).trim().split('\n')).toEqual(['1', '2']);
  });

  it('writes a counting loop as FOR', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['p', 'P', 'i ← 1'],
        ['d', 'D', 'i ≤ 5'],
        ['o', 'IO', 'OUTPUT i'],
        ['inc', 'P', 'i ← i + 2'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'p'],
        ['p', 'd'],
        ['d', 'o', 'Yes'],
        ['o', 'inc'],
        ['inc', 'd'],
        ['d', 'x', 'No'],
      ],
    );
    expect(code(d)).toBe(['FOR i <- 1 TO 5 STEP 2', '    OUTPUT i', 'NEXT i'].join('\n'));
  });

  it('keeps WHILE when the body changes the counter', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['p', 'P', 'i <- 1'],
        ['d', 'D', 'i <= 5'],
        ['o', 'IO', 'INPUT i'],
        ['inc', 'P', 'i <- i + 1'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'p'],
        ['p', 'd'],
        ['d', 'o', 'Yes'],
        ['o', 'inc'],
        ['inc', 'd'],
        ['d', 'x', 'No'],
      ],
    );
    expect(code(d)).toContain('WHILE i <= 5 DO');
  });

  it('writes a post-test loop as REPEAT … UNTIL', async () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['i', 'IO', 'INPUT Mark'],
        ['d', 'D', 'Mark >= 0 AND Mark <= 100?'],
        ['o', 'IO', 'OUTPUT Mark'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'i'],
        ['i', 'd'],
        ['d', 'i', 'No'],
        ['d', 'o', 'Yes'],
        ['o', 'x'],
      ],
    );
    expect(code(d)).toBe(['REPEAT', '    INPUT Mark', 'UNTIL Mark >= 0 AND Mark <= 100', 'OUTPUT Mark'].join('\n'));
    expect((await outputs(d, ['-4', '200', '55'])).trim()).toBe('55');
  });

  it('writes a multi-way diamond as CASE', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['i', 'IO', 'INPUT Grade'],
        ['c', 'D', 'CASE OF Grade'],
        ['a', 'IO', 'OUTPUT "Top"'],
        ['b', 'IO', 'OUTPUT "Pass"'],
        ['o', 'IO', 'OUTPUT "Retake"'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'i'],
        ['i', 'c'],
        ['c', 'a', '"A"'],
        ['c', 'b', '"B", "C"'],
        ['c', 'o', 'OTHERWISE'],
        ['a', 'x'],
        ['b', 'x'],
        ['o', 'x'],
      ],
    );
    expect(code(d)).toContain('CASE OF Grade\n    "A" :\n        OUTPUT "Top"');
    expect(code(d)).toContain('    OTHERWISE :\n        OUTPUT "Retake"\nENDCASE');
  });

  it('writes a procedure drawn as its own flowchart and a CALL box', async () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['c', 'S', 'Greet("Sam")'],
        ['x', 'T', 'STOP'],
        ['ps', 'T', 'PROCEDURE Greet(Name : STRING)'],
        ['po', 'IO', 'OUTPUT "Hi ", Name'],
        ['pe', 'T', 'ENDPROCEDURE'],
      ],
      [
        ['s', 'c'],
        ['c', 'x'],
        ['ps', 'po'],
        ['po', 'pe'],
      ],
    );
    expect(code(d)).toBe(
      ['PROCEDURE Greet(Name : STRING)', '    OUTPUT "Hi ", Name', 'ENDPROCEDURE', '', 'CALL Greet("Sam")'].join('\n'),
    );
    expect((await outputs(d, [])).trim()).toBe('Hi Sam');
  });

  it('writes an early RETURN inside a loop as IF … RETURN', async () => {
    const src = [
      'FUNCTION Find(Target : INTEGER) RETURNS INTEGER',
      '    FOR i <- 1 TO 5',
      '        IF i * i = Target THEN',
      '            RETURN i',
      '        ENDIF',
      '    NEXT i',
      '    RETURN -1',
      'ENDFUNCTION',
      'OUTPUT Find(16), " ", Find(7)',
    ].join('\n');
    const d = docFromConversion(convertToFlowchart(src, { fullLabels: true }));
    const out = code(d);
    expect(out).toContain('FOR i <- 1 TO 5');
    expect((await outputs(d, [])).trim()).toBe('4 -1');
  });

  it('handles a loop nested at the top of a REPEAT', async () => {
    const src = ['n <- 0', 'REPEAT', '    REPEAT', '        n <- n + 1', '    UNTIL MOD(n, 3) = 0', '    OUTPUT n', 'UNTIL n >= 9'].join('\n');
    const d = docFromConversion(convertToFlowchart(src, { fullLabels: true }));
    expect((await outputs(d, [])).trim().split('\n')).toEqual(['3', '6', '9']);
  });

  it('maps every line back to the box it came from', () => {
    const r = flowchartToPseudocode(larger());
    expect(r.lineToNode.slice(0, 7)).toEqual(['i1', 'i2', 'd', 'oa', 'd', 'ob', 'd']);
  });
});

describe('flowchartToPseudocode — problems are reported on the box or arrow', () => {
  it('needs a START', () => {
    expect(firstError(doc([['x', 'T', 'STOP']], [])).category).toBe('flowchart_no_start');
  });

  it('needs Yes/No labels on a decision', () => {
    const d = larger();
    d.edges[3].label = undefined;
    d.edges[4].label = undefined;
    expect(firstError(d)).toMatchObject({ nodeId: 'd', category: 'flowchart_branch_labels' });
  });

  it('flags an empty box, a box with no arrow out, and an I/O box without INPUT/OUTPUT', () => {
    const d = larger();
    d.nodes[4].label = '';
    expect(firstError(d)).toMatchObject({ nodeId: 'oa', category: 'flowchart_empty_box' });

    const d2 = larger();
    d2.edges = d2.edges.filter((e) => e.source !== 'oa');
    expect(firstError(d2)).toMatchObject({ nodeId: 'oa', category: 'flowchart_missing_arrow' });

    const d3 = larger();
    d3.nodes[4].label = 'A';
    expect(firstError(d3)).toMatchObject({ nodeId: 'oa', category: 'flowchart_io_keyword' });
  });

  it('flags a box nothing leads to, but ignores a spare STOP', () => {
    const d = larger();
    d.nodes.push({ id: 'lost', shape: 'process', label: 'x <- 1' }, { id: 'spare', shape: 'terminator', label: 'STOP' });
    const r = flowchartToPseudocode(d);
    expect(r.errors).toEqual([expect.objectContaining({ nodeId: 'lost', category: 'flowchart_unreachable' })]);
  });

  it('flags a loop that never ends', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['a', 'P', 'x <- 1'],
        ['b', 'IO', 'OUTPUT x'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'a'],
        ['a', 'b'],
        ['b', 'a'],
      ],
    );
    expect(firstError(d).category).toMatch(/flowchart_(endless_loop|no_stop)/);
  });

  it('flags an arrow into the middle of a loop', () => {
    // s → d1 ─Yes→ a → b → (back to a);  d1 ─No→ b … a jump into the a/b cycle at b.
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['d1', 'D', 'x > 0'],
        ['a', 'P', 'x <- x - 1'],
        ['b', 'D', 'x > 5'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'd1'],
        ['d1', 'a', 'Yes'],
        ['d1', 'b', 'No'],
        ['a', 'b'],
        ['b', 'a', 'Yes'],
        ['b', 'x', 'No'],
      ],
    );
    expect(firstError(d).category).toBe('flowchart_jump_into_loop');
  });

  it('flags a loop with two ways out', () => {
    const d = doc(
      [
        ['s', 'T', 'START'],
        ['d1', 'D', 'x > 10'],
        ['a', 'P', 'x <- x + 1'],
        ['d2', 'D', 'x = 7'],
        ['x', 'T', 'STOP'],
      ],
      [
        ['s', 'd1'],
        ['d1', 'x', 'Yes'],
        ['d1', 'a', 'No'],
        ['a', 'd2'],
        ['d2', 'x', 'Yes'],
        ['d2', 'd1', 'No'],
      ],
    );
    expect(firstError(d)).toMatchObject({ category: 'flowchart_loop_exit' });
  });

  it('turns a bad label into the editor’s friendly hint on that box', () => {
    const d = larger();
    d.nodes[3].label = 'A >';
    const e = firstError(d);
    expect(e.nodeId).toBe('d');
    expect(e.message).not.toMatch(/mismatched input|no viable alternative|extraneous/);
  });
});

describe('flowchart docs', () => {
  it('parseFlowchartDoc rejects junk and keeps valid docs', () => {
    expect(parseFlowchartDoc(null)).toBeNull();
    expect(parseFlowchartDoc({ nodes: [{ id: 'a', shape: 'blob', label: '' }], edges: [] })).toBeNull();
    expect(
      parseFlowchartDoc({ nodes: [{ id: 'a', shape: 'process', label: 'x' }], edges: [{ id: 'e', source: 'a', target: 'zz' }] }),
    ).toBeNull();
    expect(parseFlowchartDoc(larger())).toEqual(larger());
  });

  it('a template only takes answers for its blanks', () => {
    const full = larger();
    const template = makeTemplate(full, ['Is A > B?']);
    expect(template.nodes.find((n) => n.id === 'd')).toMatchObject({ label: '', blank: true });
    expect(template.nodes.find((n) => n.id === 'oa')).toMatchObject({ locked: true });
    expect(blankAnswers(full, template)).toEqual({ d: 'Is A > B?' });

    const filled = fillBlanks(template, { d: 'A > B', oa: 'OUTPUT "hacked"' });
    expect(filled.nodes.find((n) => n.id === 'oa')!.label).toBe('OUTPUT A');
    expect(code(filled)).toContain('IF A > B THEN');
    expect(() => makeTemplate(full, ['nope'])).toThrow();
  });
});
