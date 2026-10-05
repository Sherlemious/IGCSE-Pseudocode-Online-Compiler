/**
 * Browser translation (Chrome/Edge "Translate this page", Safari) swaps React's
 * text nodes for its own `<font>` nodes. When React later removes or inserts
 * next to a node it still remembers, the DOM throws NotFoundError
 * ("removeChild … not a child of this node") during commit, and the page falls
 * to the error boundary. That was the whole removeChild / insertBefore cluster
 * in Error Tracking: every hit was a translated playground clicking Run.
 *
 * The guard keeps the page alive instead: removing a node that has already
 * moved removes it from wherever it is now, and inserting before a node that
 * has moved inserts before its nearest ancestor still under this parent (or
 * appends). Both paths only run on a mismatch, which React never causes itself.
 * Workaround from facebook/react#11538.
 *
 * Must stay self-contained: the root layout inlines it with `toString()` so it
 * runs before any React chunk.
 */
export function installDomMutationGuard(proto: Node, report: (op: 'removeChild' | 'insertBefore') => void): void {
  const guarded = proto as Node & { __domMutationGuard?: boolean };
  if (guarded.__domMutationGuard) return;
  guarded.__domMutationGuard = true;

  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      report('removeChild');
      if (child.parentNode) removeChild.call(child.parentNode, child);
      return child;
    }
    return removeChild.call(this, child) as T;
  };

  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) {
      report('insertBefore');
      let anchor: Node | null = ref;
      while (anchor && anchor.parentNode !== this) anchor = anchor.parentNode;
      return insertBefore.call(this, node, anchor) as T;
    }
    return insertBefore.call(this, node, ref) as T;
  };
}

/** Window event the inline guard dispatches; `detail` is the op. */
export const DOM_MUTATION_GUARDED_EVENT = 'dom-mutation-guarded';

/** Inline `<script>` body for the root layout's `<head>`. */
export const DOM_MUTATION_GUARD_SCRIPT = `(${installDomMutationGuard.toString()})(Node.prototype, function (op) {
  try { window.dispatchEvent(new CustomEvent(${JSON.stringify(DOM_MUTATION_GUARDED_EVENT)}, { detail: op })); } catch (e) {}
});`;
