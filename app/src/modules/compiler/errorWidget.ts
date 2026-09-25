/**
 * The last run's error, shown as a block right under the offending line — where
 * the student is already looking — with a one-click fix when there is one.
 * Half of re-runs after an error used identical code (Sept 2026), so the terminal
 * alone wasn't getting the message across.
 */
import { EditorView, Decoration, WidgetType, type DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, Annotation, type EditorState } from '@codemirror/state';
import type { ErrorInfo } from '@/modules/interpreter/useInterpreter';

export interface InlineErrorSpec {
  info: ErrorInfo;
  onFix: () => void;
  onShowExample: () => void;
}

export const setInlineError = StateEffect.define<InlineErrorSpec | null>();

/** Marks the transaction that applies a quick fix (it must not hide the widget). */
export const quickFixAnnotation = Annotation.define<boolean>();

class InlineErrorWidget extends WidgetType {
  constructor(readonly spec: InlineErrorSpec) {
    super();
  }

  eq(other: InlineErrorWidget) {
    const a = this.spec.info;
    const b = other.spec.info;
    return (
      a.message === b.message &&
      a.line === b.line &&
      a.fix?.id === b.fix?.id &&
      !!a.fixApplied === !!b.fixApplied &&
      a.unchanged === b.unchanged
    );
  }

  toDOM(view: EditorView) {
    const { info, onFix, onShowExample } = this.spec;
    const root = document.createElement('div');
    root.className = `cm-inline-error${info.fixApplied ? ' cm-inline-error-applied' : ''}`;
    root.setAttribute('role', 'status');

    if (info.fixApplied) {
      root.textContent = '✓ Fixed — press Run to check it works.';
      return root;
    }

    const newline = info.message.indexOf('\n');
    const summary = newline === -1 ? info.message : info.message.slice(0, newline);
    const detail = newline === -1 ? '' : info.message.slice(newline + 1);

    const head = document.createElement('div');
    head.className = 'cm-inline-error-head';
    const icon = document.createElement('span');
    icon.className = 'cm-inline-error-icon';
    icon.textContent = '!';
    const text = document.createElement('span');
    text.textContent = summary;
    head.append(icon, text);
    root.append(head);

    if (info.unchanged) {
      const note = document.createElement('div');
      note.className = 'cm-inline-error-note';
      note.textContent = 'You ran the same code again — change this line first.';
      root.append(note);
    }

    const actions = document.createElement('div');
    actions.className = 'cm-inline-error-actions';
    if (info.fix) {
      const fix = document.createElement('button');
      fix.type = 'button';
      fix.className = 'cm-inline-error-fix';
      fix.textContent = `Fix it: ${info.fix.label.replace(/^Change to: /, '')}`;
      fix.title = info.fix.label;
      fix.addEventListener('mousedown', (e) => e.preventDefault());
      fix.addEventListener('click', () => onFix());
      actions.append(fix);
    }
    if (detail.trim()) {
      const pre = document.createElement('pre');
      pre.className = 'cm-inline-error-detail';
      pre.textContent = detail;
      pre.hidden = true;
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'cm-inline-error-toggle';
      toggle.textContent = 'Show example';
      toggle.addEventListener('mousedown', (e) => e.preventDefault());
      toggle.addEventListener('click', () => {
        pre.hidden = !pre.hidden;
        toggle.textContent = pre.hidden ? 'Show example' : 'Hide example';
        view.requestMeasure();
        if (!pre.hidden) onShowExample();
      });
      actions.append(toggle);
      root.append(actions, pre);
    } else if (info.fix) {
      root.append(actions);
    }
    return root;
  }

  ignoreEvent() {
    return true;
  }
}

function build(spec: InlineErrorSpec | null, state: EditorState): DecorationSet {
  if (!spec) return Decoration.none;
  const lineNo = Math.min(spec.info.line, state.doc.lines);
  if (lineNo < 1) return Decoration.none;
  const line = state.doc.line(lineNo);
  return Decoration.set([
    Decoration.widget({ widget: new InlineErrorWidget(spec), block: true, side: 1 }).range(line.to),
  ]);
}

export const inlineErrorField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const e of tr.effects) if (e.is(setInlineError)) return build(e.value, tr.state);
    if (!tr.docChanged) return deco;
    // The student started editing: the message is about code that no longer exists.
    return tr.annotation(quickFixAnnotation) ? deco.map(tr.changes) : Decoration.none;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const inlineErrorTheme = EditorView.theme({
  '.cm-inline-error': {
    margin: '2px 0.75rem 6px 0.75rem',
    padding: '6px 10px',
    borderLeft: '3px solid var(--color-error)',
    borderRadius: '4px',
    backgroundColor: 'rgba(var(--color-error-rgb), 0.08)',
    color: 'var(--color-light-text)',
    fontSize: '0.9em',
    lineHeight: '1.45',
    whiteSpace: 'normal',
  },
  '.cm-inline-error-applied': {
    borderLeftColor: 'var(--color-success)',
    backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)',
    color: 'var(--color-success)',
  },
  '.cm-inline-error-head': {
    display: 'flex',
    gap: '0.5em',
    alignItems: 'baseline',
  },
  '.cm-inline-error-icon': {
    color: 'var(--color-error)',
    fontWeight: '700',
  },
  '.cm-inline-error-note': {
    marginTop: '2px',
    color: 'var(--color-error)',
    fontSize: '0.92em',
  },
  '.cm-inline-error-actions': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '6px',
  },
  '.cm-inline-error-fix': {
    padding: '2px 10px',
    borderRadius: '4px',
    border: '1px solid var(--color-primary)',
    backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)',
    color: 'var(--color-primary)',
    fontFamily: 'var(--editor-font-family)',
    fontSize: '0.95em',
    cursor: 'pointer',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '.cm-inline-error-fix:hover': {
    backgroundColor: 'rgba(var(--color-primary-rgb), 0.28)',
  },
  '.cm-inline-error-toggle': {
    padding: '2px 4px',
    border: 'none',
    background: 'none',
    color: 'var(--color-dark-text)',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    fontSize: '0.92em',
    cursor: 'pointer',
  },
  '.cm-inline-error-toggle:hover': {
    color: 'var(--color-light-text)',
  },
  '.cm-inline-error-detail': {
    margin: '6px 0 0',
    whiteSpace: 'pre-wrap',
    fontFamily: 'var(--editor-font-family)',
    color: 'var(--color-light-text)',
    opacity: '0.85',
  },
});
