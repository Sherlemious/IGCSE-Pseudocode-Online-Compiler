'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  Link2,
  Share2,
  Table2,
  Terminal,
  FileCode,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePostHog } from 'posthog-js/react';
import type { OutputEntry, TraceRow } from '@/modules/interpreter/core/types';
import { editorCodeUrl } from '@/modules/compiler/editorShare';
import {
  canNativeShareFiles,
  captureExportCard,
  copyImageBlob,
  downloadBlob,
  pngFileName,
  shareImageBlob,
} from '@/modules/compiler/exportImage';
import ExportCard from './ExportCard';

export type ExportLayout = 'snippet' | 'run' | 'trace' | 'lab';
export type OutputPaneTab = 'terminal' | 'trace' | 'python' | 'flowchart';

interface ExportSections {
  code: boolean;
  terminal: boolean;
  trace: boolean;
}

const LAYOUT_SECTIONS: Record<ExportLayout, ExportSections> = {
  snippet: { code: true, terminal: false, trace: false },
  run: { code: true, terminal: true, trace: false },
  trace: { code: true, terminal: false, trace: true },
  lab: { code: true, terminal: true, trace: true },
};

const LAYOUTS: { id: ExportLayout; label: string }[] = [
  { id: 'snippet', label: 'Snippet' },
  { id: 'run', label: 'Run' },
  { id: 'trace', label: 'Trace sheet' },
  { id: 'lab', label: 'Lab' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  fileName: string;
  entries: OutputEntry[];
  traceRows: TraceRow[];
  outputTab?: OutputPaneTab;
}

function hasTerminalTranscript(entries: OutputEntry[]): boolean {
  return entries.some(
    (e) => e.kind === 'output' || e.kind === 'error' || (e.kind === 'input' && e.submitted),
  );
}

function pickDefaultLayout(
  outputTab: OutputPaneTab | undefined,
  hasTerminal: boolean,
  hasTrace: boolean,
): ExportLayout {
  if (outputTab === 'trace' && hasTrace) return 'trace';
  if (hasTerminal) return 'run';
  return 'snippet';
}

function applyLayout(
  layout: ExportLayout,
  hasTerminal: boolean,
  hasTrace: boolean,
): ExportSections {
  const next = { ...LAYOUT_SECTIONS[layout] };
  if (!hasTerminal) next.terminal = false;
  if (!hasTrace) next.trace = false;
  if (!next.code && !next.terminal && !next.trace) next.code = true;
  return next;
}

export default function ExportStudio({
  open,
  onOpenChange,
  code,
  fileName,
  entries,
  traceRows,
  outputTab,
}: Props) {
  const ph = usePostHog();
  const cardRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<ExportSections>(LAYOUT_SECTIONS.snippet);
  const [busy, setBusy] = useState<'copy' | 'download' | 'share' | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const hasTerminal = hasTerminalTranscript(entries);
  const hasTrace = traceRows.length > 0;

  useEffect(() => {
    setCanShare(canNativeShareFiles());
  }, []);

  useEffect(() => {
    if (!open) return;
    const next = pickDefaultLayout(outputTab, hasTerminal, hasTrace);
    setSections(applyLayout(next, hasTerminal, hasTrace));
    setBusy(null);
    setCopiedImage(false);
  }, [open, outputTab, hasTerminal, hasTrace]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const filename = useMemo(() => pngFileName(fileName), [fileName]);

  const activeLayout = useMemo((): ExportLayout | null => {
    for (const { id } of LAYOUTS) {
      const s = applyLayout(id, hasTerminal, hasTrace);
      if (s.code === sections.code && s.terminal === sections.terminal && s.trace === sections.trace) {
        return id;
      }
    }
    return null;
  }, [sections, hasTerminal, hasTrace]);

  const chooseLayout = (id: ExportLayout) => {
    setSections(applyLayout(id, hasTerminal, hasTrace));
  };

  const toggleSection = (key: keyof ExportSections) => {
    setSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.code && !next.terminal && !next.trace) return prev;
      return next;
    });
  };

  const track = useCallback(
    (method: string, completed = false) => {
      ph?.capture(completed ? 'share_completed' : 'share_clicked', {
        method,
        context: 'export_card',
      });
    },
    [ph],
  );

  const capture = useCallback(async () => {
    const node = cardRef.current;
    if (!node) throw new Error('Export card is not ready');
    return captureExportCard(node);
  }, []);

  // Open-intent: did the student actually open Export Studio (vs. just complete an export)?
  useEffect(() => {
    if (open) ph?.capture('export_studio_opened');
  }, [open, ph]);

  const handleCopyImage = async () => {
    track('image_copy');
    setBusy('copy');
    const blobPromise = capture();
    try {
      await copyImageBlob(blobPromise);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
      toast.success('Image copied to clipboard');
      track('image_copy', true);
    } catch {
      try {
        const blob = await blobPromise;
        downloadBlob(blob, filename);
        toast.success('Clipboard blocked — downloaded PNG instead');
      } catch {
        toast.error('Could not capture the card');
      }
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = async () => {
    track('image_download');
    setBusy('download');
    try {
      const blob = await capture();
      downloadBlob(blob, filename);
      toast.success('PNG downloaded');
      track('image_download', true);
    } catch {
      toast.error('Could not capture the card');
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    track('image_native');
    setBusy('share');
    try {
      const blob = await capture();
      await shareImageBlob(blob, filename, fileName);
      track('image_native', true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      toast.error('Could not share the image');
    } finally {
      setBusy(null);
    }
  };

  const handleCopyLink = () => {
    track('code_link');
    navigator.clipboard.writeText(editorCodeUrl(code)).then(() => {
      toast.success('Link to your code copied to clipboard');
      track('code_link', true);
    }).catch(() => { /* clipboard unavailable */ });
  };

  if (!open) return null;

  const layoutAvailable: Record<ExportLayout, boolean> = {
    snippet: true,
    run: hasTerminal,
    trace: hasTrace,
    lab: hasTerminal && hasTrace,
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-surface border border-border rounded-lg shadow-intense w-full max-w-[960px] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="export-studio-title"
      >
        <div className="h-9 border-b border-border flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon size={13} className="text-primary" />
            <span id="export-studio-title" className="text-xs font-semibold tracking-wider text-light-text uppercase">
              Export as image
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-dark-text hover:text-light-text p-0.5 rounded hover:bg-background transition-colors"
            aria-label="Close export studio"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-3 py-2.5 border-b border-border/60 shrink-0 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {LAYOUTS.map((item) => {
              const available = layoutAvailable[item.id];
              const active = activeLayout === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => available && chooseLayout(item.id)}
                  disabled={!available}
                  title={!available ? 'Run the program first' : undefined}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-150
                    ${active
                      ? 'bg-primary/15 border-primary/50 text-primary'
                      : available
                        ? 'bg-background border-border text-dark-text hover:border-primary/30 hover:text-light-text'
                        : 'bg-background border-border text-dark-text/40 cursor-not-allowed'
                    }`}
                >
                  {active && <Check size={9} />}
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SectionToggle
              icon={<FileCode size={11} />}
              label="Code"
              checked={sections.code}
              onChange={() => toggleSection('code')}
            />
            <SectionToggle
              icon={<Terminal size={11} />}
              label="Terminal"
              checked={sections.terminal}
              disabled={!hasTerminal}
              hint="Run the program first"
              onChange={() => toggleSection('terminal')}
            />
            <SectionToggle
              icon={<Table2 size={11} />}
              label="Trace"
              checked={sections.trace}
              disabled={!hasTrace}
              hint="Run the program first"
              onChange={() => toggleSection('trace')}
            />
          </div>
        </div>

        <div
          className="flex-1 min-h-0 overflow-auto scrollbar-pretty flex justify-center items-start p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.28)' }}
        >
          <ExportCard
            ref={cardRef}
            code={code}
            fileName={fileName}
            entries={entries}
            traceRows={traceRows}
            showCode={sections.code}
            showTerminal={sections.terminal}
            showTrace={sections.trace}
          />
        </div>

        <div className="border-t border-border px-3 py-2.5 flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopyImage}
            disabled={busy !== null}
            className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs font-medium
              bg-primary text-on-primary hover:bg-primary-hover transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copiedImage ? <Check size={13} /> : <Copy size={13} />}
            {busy === 'copy' ? 'Capturing…' : copiedImage ? 'Copied' : 'Copy image'}
          </button>
          <button
            onClick={handleDownload}
            disabled={busy !== null}
            className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs
              bg-background border border-border text-light-text hover:border-primary/40 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            {busy === 'download' ? 'Capturing…' : 'Download PNG'}
          </button>
          {canShare && (
            <button
              onClick={handleShare}
              disabled={busy !== null}
              className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs
                bg-background border border-border text-light-text hover:border-primary/40 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={13} />
              {busy === 'share' ? 'Capturing…' : 'Share…'}
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 h-8 rounded-md text-xs
              bg-background border border-border text-dark-text hover:text-light-text hover:border-primary/40 transition-colors ml-auto"
          >
            <Link2 size={13} />
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionToggle({
  icon,
  label,
  checked,
  disabled,
  hint,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  checked: boolean;
  disabled?: boolean;
  hint?: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-1.5 text-[11px] select-none ${
        disabled ? 'text-dark-text/40 cursor-not-allowed' : 'text-dark-text cursor-pointer hover:text-light-text'
      }`}
      title={disabled ? hint : undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="accent-[var(--color-primary)]"
      />
      <span className="shrink-0">{icon}</span>
      {label}
    </label>
  );
}
