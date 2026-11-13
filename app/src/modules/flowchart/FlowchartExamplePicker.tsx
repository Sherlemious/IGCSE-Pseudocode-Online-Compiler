'use client';

// The flowchart builder's example browser: search, categories, and a live
// preview of the drawing (or its pseudocode) before it replaces the canvas.
// Same shell as the playground's ExamplePicker.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Code2, GitBranch, Search, Workflow, X } from 'lucide-react';
import type { FlowchartDoc } from '@/modules/interpreter/converters/flowchartDoc';
import FlowchartDiagram from './FlowchartDiagram';
import { FLOWCHART_CATEGORIES, FLOWCHART_EXAMPLES, type FlowchartExample } from './examples';
import { flowchartFromCode } from './importCode';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (example: FlowchartExample, doc: FlowchartDoc) => void;
};

const matches = (ex: FlowchartExample, q: string) =>
  !q ||
  [ex.title, ex.category, ex.description, ...ex.concepts].some((s) => s.toLowerCase().includes(q));

export default function FlowchartExamplePicker({ open, onOpenChange, onLoad }: Props) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(FLOWCHART_EXAMPLES[0].id);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'diagram' | 'code'>('diagram');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => FLOWCHART_EXAMPLES.filter((ex) => matches(ex, q)), [q]);
  // The order arrow keys walk: visible (non-collapsed) rows, top to bottom.
  const visible = useMemo(
    () =>
      FLOWCHART_CATEGORIES.flatMap((cat) =>
        q || !collapsed.has(cat) ? filtered.filter((ex) => ex.category === cat) : [],
      ),
    [filtered, collapsed, q],
  );
  const selected = FLOWCHART_EXAMPLES.find((ex) => ex.id === selectedId) ?? null;
  const selectedDoc = useMemo(() => (selected ? flowchartFromCode(selected.code).doc : null), [selected]);
  const boxCount = selectedDoc?.nodes.length ?? 0;

  // Fresh state each time it opens; the first example is previewed straight away.
  useEffect(() => {
    if (!open) return;
    setSearch('');
    setCollapsed(new Set());
    setSelectedId(FLOWCHART_EXAMPLES[0].id);
    setView('diagram');
    setMobileView('list');
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);

  // Searching keeps a matching example in the preview.
  useEffect(() => {
    if (q && filtered.length && !filtered.some((ex) => ex.id === selectedId)) setSelectedId(filtered[0].id);
  }, [q, filtered, selectedId]);

  const load = useCallback(() => {
    if (!selected || !selectedDoc) return;
    onLoad(selected, selectedDoc);
    onOpenChange(false);
  }, [selected, selectedDoc, onLoad, onOpenChange]);

  const move = useCallback(
    (delta: number) => {
      if (!visible.length) return;
      const i = visible.findIndex((ex) => ex.id === selectedId);
      const next = visible[Math.max(0, Math.min(visible.length - 1, (i < 0 ? -1 : i) + delta))];
      setSelectedId(next.id);
      listRef.current?.querySelector(`[data-example="${next.id}"]`)?.scrollIntoView({ block: 'nearest' });
    },
    [visible, selectedId],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        load();
      }
    };
    const onDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, move, load, onOpenChange]);

  const toggleCategory = (cat: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });

  if (!open || typeof document === 'undefined') return null;

  const scroller =
    'scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover scrollbar-track-background scrollbar-thumb-rounded-full';

  const browser = (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
      <div className="p-2 border-b border-border shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-dark-text" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search: loop, CASE, search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search flowchart examples"
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-background border border-border rounded focus:border-primary focus:outline-none text-light-text placeholder:text-dark-text"
          />
        </div>
      </div>

      <div ref={listRef} className={`flex-1 overflow-y-auto py-1 ${scroller}`} role="listbox" aria-label="Flowchart examples">
        {FLOWCHART_CATEGORIES.map((category) => {
          const items = filtered.filter((ex) => ex.category === category);
          if (!items.length) return null;
          const expanded = !!q || !collapsed.has(category);
          return (
            <div key={category}>
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                aria-expanded={expanded}
                className="w-full flex items-center gap-1 px-2 py-1.5 md:py-1 text-xs font-semibold text-dark-text hover:text-light-text hover:bg-surface/50 transition-colors"
              >
                <ChevronRight size={12} className={`shrink-0 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`} />
                <span className="uppercase tracking-wider truncate">{category}</span>
                <span className="text-dark-text/60 font-normal ml-auto">{items.length}</span>
              </button>
              {expanded && (
                <div className="ml-2">
                  {items.map((ex) => {
                    const isSel = ex.id === selectedId;
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        role="option"
                        aria-selected={isSel}
                        data-example={ex.id}
                        onClick={() => {
                          setSelectedId(ex.id);
                          setMobileView('detail');
                        }}
                        onDoubleClick={() => {
                          const doc = flowchartFromCode(ex.code).doc;
                          if (!doc) return;
                          onLoad(ex, doc);
                          onOpenChange(false);
                        }}
                        className={`w-full flex items-start gap-1.5 px-3 py-1.5 text-xs rounded-sm text-left transition-colors ${
                          isSel ? 'bg-primary/15 text-primary' : 'text-light-text hover:bg-surface'
                        }`}
                      >
                        <Workflow size={12} className={`shrink-0 mt-0.5 ${isSel ? 'text-primary' : 'text-dark-text'}`} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{ex.title}</span>
                          <span className="block truncate text-[11px] text-dark-text">{ex.concepts.join(' · ')}</span>
                        </span>
                        <ChevronRight size={12} className="shrink-0 mt-0.5 text-dark-text/40 md:hidden" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {!filtered.length && (
          <div className="px-4 py-6 text-center text-xs text-dark-text">No examples match &ldquo;{search}&rdquo;</div>
        )}
      </div>

      <div className="hidden md:block shrink-0 border-t border-border px-3 py-1.5 text-[11px] text-dark-text">
        ↑ ↓ to browse · Enter to load
      </div>
    </div>
  );

  const tabBtn = (id: 'diagram' | 'code', label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setView(id)}
      aria-pressed={view === id}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
        view === id ? 'bg-background text-light-text' : 'text-dark-text hover:text-light-text'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const preview = selected ? (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 min-w-0">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="md:hidden text-dark-text hover:text-light-text mr-1 -ml-1 p-0.5 rounded"
            aria-label="Back to examples"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="min-w-0 truncate text-xs font-semibold text-light-text">{selected.title}</span>
          <span className="hidden shrink-0 text-xs text-dark-text sm:inline">— {selected.category}</span>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-surface p-0.5">
          {tabBtn('diagram', 'Flowchart', <GitBranch size={12} />)}
          {tabBtn('code', 'Pseudocode', <Code2 size={12} />)}
        </div>
        <button
          type="button"
          onClick={load}
          className="hidden md:flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs font-medium rounded bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
        >
          Load
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="shrink-0 border-b border-border px-3 py-2 space-y-1.5">
        <p className="text-xs text-light-text leading-relaxed">{selected.description}</p>
        <div className="flex flex-wrap items-center gap-1">
          {selected.concepts.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSearch(c)}
              title={`Show examples about ${c}`}
              className="rounded-full border border-border px-2 py-0.5 text-[11px] text-dark-text hover:text-primary hover:border-primary/40 transition-colors"
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-dark-text">{boxCount} boxes</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-2">
        {view === 'diagram' ? (
          selectedDoc && (
            <FlowchartDiagram
              key={selected.id}
              doc={selectedDoc}
              className="h-full min-h-[16rem]"
              ariaLabel={`Flowchart: ${selected.title}`}
            />
          )
        ) : (
          <pre
            style={{ fontSize: 'var(--editor-font-size)' }}
            className={`h-full min-h-[16rem] overflow-auto rounded-lg border border-border p-3 font-mono leading-relaxed text-light-text ${scroller}`}
          >
            <code>{selected.code}</code>
          </pre>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-3 py-2 grid gap-2 sm:grid-cols-2 text-[11px]">
        <div className="min-w-0">
          <div className="uppercase tracking-wider text-dark-text mb-0.5">Try it with</div>
          <div className="font-mono text-light-text truncate">{selected.inputs.length ? selected.inputs.join(', ') : '—'}</div>
        </div>
        <div className="min-w-0">
          <div className="uppercase tracking-wider text-dark-text mb-0.5">Output</div>
          <div className="font-mono text-light-text truncate">{selected.output.split('\n').join(' ⏎ ')}</div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          onClick={load}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover transition-colors"
        >
          Load flowchart
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-dark-text">
      <Workflow size={32} className="opacity-30" />
      <div className="text-sm">Select an example to preview</div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[80] flex h-dvh max-h-dvh w-full min-w-0 flex-col bg-black/60 md:items-center md:justify-center md:p-3">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Flowchart examples"
        className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background shadow-intense pt-[env(safe-area-inset-top)] md:h-[85vh] md:max-w-5xl md:rounded-md md:border md:border-border md:pt-0"
      >
        <div className="h-10 md:h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
            <Workflow className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Flowchart examples</span>
            <span className="text-xs text-dark-text">({filtered.length})</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-dark-text hover:text-light-text p-1 rounded hover:bg-background transition-colors"
            aria-label="Close examples"
          >
            <X size={16} className="md:w-3.5 md:h-3.5" />
          </button>
        </div>

        <div className="hidden min-h-0 min-w-0 flex-1 md:flex">
          <div className="flex w-72 shrink-0 flex-col min-h-0 min-w-0 border-r border-border">{browser}</div>
          {preview}
        </div>
        <div className="flex min-h-0 min-w-0 w-full flex-1 overflow-hidden md:hidden">
          {mobileView === 'list' ? browser : preview}
        </div>
      </div>
    </div>,
    document.body,
  );
}
