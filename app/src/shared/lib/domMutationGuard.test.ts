import { describe, expect, it } from 'vitest';
import { DOM_MUTATION_GUARD_SCRIPT, installDomMutationGuard } from './domMutationGuard';

// Just enough of a DOM (vitest runs in node) to reproduce what browser
// translation does to React's nodes.
class FakeNode {
  parentNode: FakeNode | null = null;
  childNodes: FakeNode[] = [];
  constructor(public name: string) {}

  removeChild(child: FakeNode): FakeNode {
    const i = this.childNodes.indexOf(child);
    if (i === -1) throw new Error("NotFoundError: Failed to execute 'removeChild'");
    this.childNodes.splice(i, 1);
    child.parentNode = null;
    return child;
  }

  insertBefore(node: FakeNode, ref: FakeNode | null): FakeNode {
    if (node.parentNode) node.parentNode.removeChild(node);
    if (ref === null) {
      this.childNodes.push(node);
    } else {
      const i = this.childNodes.indexOf(ref);
      if (i === -1) throw new Error("NotFoundError: Failed to execute 'insertBefore'");
      this.childNodes.splice(i, 0, node);
    }
    node.parentNode = this;
    return node;
  }

  append(...nodes: FakeNode[]): this {
    for (const n of nodes) this.insertBefore(n, null);
    return this;
  }

  get names(): string[] {
    return this.childNodes.map((n) => n.name);
  }
}

function guarded() {
  class Node extends FakeNode {}
  const reports: string[] = [];
  installDomMutationGuard(Node.prototype as unknown as globalThis.Node, (op) => reports.push(op));
  return { Node, reports };
}

/** Translate replaces a text node with a `<font>` wrapping its translation. */
function translate(text: FakeNode, font: FakeNode) {
  const parent = text.parentNode!;
  parent.insertBefore(font, text);
  parent.removeChild(text);
}

describe('installDomMutationGuard', () => {
  it('still throws without the guard (the crash it prevents)', () => {
    const button = new FakeNode('button').append(new FakeNode('svg'));
    const label = new FakeNode('"Run"');
    button.append(label);
    translate(label, new FakeNode('font'));
    expect(() => button.removeChild(label)).toThrow(/removeChild/);
  });

  it('ignores removing a node translation already detached', () => {
    const { Node, reports } = guarded();
    const button = new Node('button');
    const label = new Node('"Run"');
    button.append(new Node('svg'), label);
    translate(label, new Node('font'));

    expect(button.removeChild(label)).toBe(label);
    expect(button.names).toEqual(['svg', 'font']);
    expect(reports).toEqual(['removeChild']);
  });

  it('removes a node that was moved into a wrapper from where it is now', () => {
    const { Node, reports } = guarded();
    const div = new Node('div');
    const text = new Node('"Process finished"');
    const wrapper = new Node('font');
    div.append(wrapper);
    wrapper.append(text);

    div.removeChild(text);
    expect(wrapper.names).toEqual([]);
    expect(reports).toEqual(['removeChild']);
  });

  it('inserts before the moved node’s ancestor that is still a child', () => {
    const { Node, reports } = guarded();
    const div = new Node('div');
    const text = new Node('"Running"');
    const wrapper = new Node('font');
    div.append(new Node('a'), wrapper, new Node('b'));
    wrapper.append(text);

    div.insertBefore(new Node('new'), text);
    expect(div.names).toEqual(['a', 'new', 'font', 'b']);
    expect(reports).toEqual(['insertBefore']);
  });

  it('appends when the reference node is gone entirely', () => {
    const { Node, reports } = guarded();
    const div = new Node('div');
    const text = new Node('"Stop"');
    div.append(text, new Node('kbd'));
    translate(text, new Node('font'));

    div.insertBefore(new Node('new'), text);
    expect(div.names).toEqual(['font', 'kbd', 'new']);
    expect(reports).toEqual(['insertBefore']);
  });

  it('leaves normal removes and inserts alone', () => {
    const { Node, reports } = guarded();
    const div = new Node('div');
    const a = new Node('a');
    const b = new Node('b');
    div.append(a, b);
    div.insertBefore(new Node('x'), b);
    div.removeChild(a);
    expect(div.names).toEqual(['x', 'b']);
    expect(reports).toEqual([]);
  });

  it('installs once', () => {
    class Node extends FakeNode {}
    const reports: string[] = [];
    const proto = Node.prototype as unknown as globalThis.Node;
    installDomMutationGuard(proto, (op) => reports.push(op));
    installDomMutationGuard(proto, (op) => reports.push(op));
    const div = new Node('div');
    div.removeChild(new Node('stray'));
    expect(reports).toEqual(['removeChild']);
  });
});

describe('DOM_MUTATION_GUARD_SCRIPT', () => {
  it('runs standalone and dispatches the window event', () => {
    class Node extends FakeNode {}
    const events: unknown[] = [];
    const window = { dispatchEvent: (e: { detail: unknown }) => events.push(e.detail) };
    class CustomEvent {
      constructor(public type: string, public init: { detail: unknown }) {}
      get detail() {
        return this.init.detail;
      }
    }
    new Function('Node', 'window', 'CustomEvent', DOM_MUTATION_GUARD_SCRIPT)(Node, window, CustomEvent);

    const div = new Node('div');
    expect(() => div.removeChild(new Node('stray'))).not.toThrow();
    expect(events).toEqual(['removeChild']);
  });
});
