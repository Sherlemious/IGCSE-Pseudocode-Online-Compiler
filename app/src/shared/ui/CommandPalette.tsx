'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CornerDownLeft } from 'lucide-react';

/**
 * Command palette (Ctrl/⌘ K) — the IDE-native decluttering device.
 *
 * Any action that used to need a permanent toolbar slot can register itself
 * here instead, so the visible chrome only carries the frequent controls while
 * the long tail stays one keystroke away. Global actions (navigate, theme,
 * links) live in `GlobalCommands`; page-specific actions (run, debug, open,
 * export) are registered by the compiler page while it is mounted.
 *
 * The look echoes the product's own terminal: a `>` prompt and monospace input,
 * so it reads as "command your IDE" rather than a generic launcher.
 */

export interface Command {
  /** Stable unique id. */
  id: string;
  /** Human label shown in the list. */
  label: string;
  /** Section header the command is filed under. */
  group: string;
  /** Extra search terms (not shown). */
  keywords?: string;
  /** Invoked when the command is chosen. Read latest state via refs. */
  run: () => void;
}

interface CommandContextValue {
  registerCommands: (commands: Command[]) => () => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommands(): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error('useCommands must be used within a CommandProvider');
  return ctx;
}

/**
 * Register commands for the lifetime of the calling component.
 *
 * Pass a plain inline array each render — its `run()` closures may reference
 * component state/handlers directly. Registration happens once on mount (and is
 * cleaned up on unmount); each `run()` is dispatched to the latest closure of
 * the same id via a ref, so commands never go stale and there is no re-register
 * churn on every keystroke.
 */
export function useRegisterCommands(commands: Command[]) {
  const { registerCommands } = useCommands();
  const ref = useRef(commands);
  // Keep the latest closures without touching the ref during render.
  useEffect(() => {
    ref.current = commands;
  });
  useEffect(() => {
    const stable: Command[] = ref.current.map((c) => ({
      id: c.id,
      label: c.label,
      group: c.group,
      keywords: c.keywords,
      run: () => (ref.current.find((x) => x.id === c.id) ?? c).run(),
    }));
    // Register once; run() resolves the latest command by id at call time.
    return registerCommands(stable);
  }, [registerCommands]);
}

const GROUP_ORDER = ['Run', 'Code', 'Open', 'Go to', 'View', 'Links'];

function groupRank(group: string) {
  const i = GROUP_ORDER.indexOf(group);
  return i === -1 ? GROUP_ORDER.length : i;
}

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [sources, setSources] = useState<Map<number, Command[]>>(() => new Map());
  const keyRef = useRef(0);

  const registerCommands = useCallback((commands: Command[]) => {
    const key = keyRef.current++;
    setSources((prev) => {
      const next = new Map(prev);
      next.set(key, commands);
      return next;
    });
    return () => {
      setSources((prev) => {
        const next = new Map(prev);
        next.delete(key);
        return next;
      });
    };
  }, []);

  const commands = useMemo(() => Array.from(sources.values()).flat(), [sources]);

  // Global Ctrl/⌘ K. Capture phase so it fires even over the editor, and
  // preventDefault to stop the browser's own Ctrl+K search-bar shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  const value = useMemo<CommandContextValue>(
    () => ({
      registerCommands,
      openPalette: () => setOpen(true),
      closePalette: () => setOpen(false),
      togglePalette: () => setOpen((o) => !o),
    }),
    [registerCommands],
  );

  return (
    <CommandContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} commands={commands} />
    </CommandContext.Provider>
  );
}

interface PaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

function CommandPalette({ open, onClose, commands }: PaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset query + selection, and focus the input, each time the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const { flat, groups } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? commands.filter((c) =>
          `${c.label} ${c.keywords ?? ''} ${c.group}`.toLowerCase().includes(q),
        )
      : commands;

    const byGroup = new Map<string, Command[]>();
    for (const c of matched) {
      const list = byGroup.get(c.group);
      if (list) list.push(c);
      else byGroup.set(c.group, [c]);
    }

    const orderedGroups = [...byGroup.keys()].sort((a, b) => groupRank(a) - groupRank(b));
    const flatList: Command[] = [];
    const grouped = orderedGroups.map((group) => ({
      group,
      items: byGroup.get(group)!.map((cmd) => {
        const index = flatList.length;
        flatList.push(cmd);
        return { cmd, index };
      }),
    }));
    return { flat: flatList, groups: grouped };
  }, [commands, query]);

  // Selection back to the top whenever the result set changes.
  useEffect(() => setActive(0), [query]);

  const activeIdx = flat.length === 0 ? -1 : Math.min(active, flat.length - 1);

  // Keep the highlighted row in view.
  useEffect(() => {
    if (activeIdx < 0) return;
    listRef.current
      ?.querySelector(`[data-cmd-index="${activeIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const runCommand = useCallback(
    (cmd: Command) => {
      onClose();
      cmd.run();
    },
    [onClose],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = flat[activeIdx];
      if (cmd) runCommand(cmd);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh] bg-black/50"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg flex flex-col overflow-hidden rounded-xl border border-border
          bg-surface shadow-intense motion-safe:animate-fade-in-up"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Prompt — mirrors the terminal's `>` cursor */}
        <div className="flex items-center gap-2 h-11 px-3 border-b border-border">
          <span className="text-primary font-mono text-sm select-none" aria-hidden>
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={activeIdx >= 0 ? `command-opt-${activeIdx}` : undefined}
            className="flex-1 bg-transparent outline-none font-mono text-sm text-light-text
              placeholder:text-dark-text/50"
          />
          <kbd className="text-[10px] text-dark-text/50">Esc</kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-palette-list"
          role="listbox"
          className="max-h-[50vh] overflow-y-auto py-1
            scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
            scrollbar-track-background scrollbar-thumb-rounded-full"
        >
          {flat.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-dark-text/60">No matching commands</div>
          ) : (
            groups.map(({ group, items }) => (
              <div key={group}>
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-text/50">
                  {group}
                </div>
                {items.map(({ cmd, index }) => {
                  const isActive = index === activeIdx;
                  return (
                    <button
                      key={cmd.id}
                      id={`command-opt-${index}`}
                      data-cmd-index={index}
                      role="option"
                      aria-selected={isActive}
                      onMouseMove={() => setActive(index)}
                      onClick={() => runCommand(cmd)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                        isActive ? 'bg-primary/15 text-primary' : 'text-light-text hover:bg-background/50'
                      }`}
                    >
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {isActive && <CornerDownLeft size={12} className="shrink-0 text-primary/60" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Hints */}
        <div className="flex items-center gap-3 h-7 px-3 border-t border-border text-[10px] font-mono text-dark-text/50">
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> run
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
