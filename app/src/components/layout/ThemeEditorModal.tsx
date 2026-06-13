'use client';

import { useState, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw, Check } from 'lucide-react';
import {
  type CustomColors,
  type CustomColorKey,
  type PresetThemeId,
  DEFAULT_CUSTOM_COLORS,
  themes,
  presetToCustomColors,
} from '../../theme/themes';

interface Props {
  colors: CustomColors;
  onSave: (colors: CustomColors) => void;
  onClose: () => void;
}

const PRESET_ORDER: PresetThemeId[] = ['one-dark-pro', 'dracula', 'nord', 'monokai', 'github-light'];

const UI_COLORS: Array<{ key: CustomColorKey; label: string }> = [
  { key: 'background',  label: 'Background' },
  { key: 'surface',     label: 'Surface'    },
  { key: 'primary',     label: 'Primary'    },
  { key: 'light-text',  label: 'Text'       },
  { key: 'border',      label: 'Border'     },
];

const SYNTAX_COLORS: Array<{ key: CustomColorKey; label: string }> = [
  { key: 'syntax-keyword',  label: 'Keyword'  },
  { key: 'syntax-type',     label: 'Type'     },
  { key: 'syntax-string',   label: 'String'   },
  { key: 'syntax-number',   label: 'Number'   },
  { key: 'syntax-boolean',  label: 'Boolean'  },
  { key: 'syntax-operator', label: 'Operator' },
  { key: 'syntax-comment',  label: 'Comment'  },
  { key: 'syntax-variable', label: 'Variable' },
];

export default function ThemeEditorModal({ colors, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<CustomColors>(colors);

  // Sync draft when colors prop changes (e.g. switching to custom while modal is open)
  useEffect(() => { setDraft(colors); }, [colors]);

  const setColor = useCallback((key: CustomColorKey, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  }, []);

  function handleImport(id: string) {
    if (id && id in themes) setDraft(presetToCustomColors(id as PresetThemeId));
  }

  function handleApply() {
    onSave(draft);
    onClose();
  }

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Custom theme editor"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative z-10 bg-surface border border-border rounded-2xl shadow-intense w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-light-text">Custom Theme</h2>
            <p className="text-xs text-dark-text mt-0.5">Pick colors, see the preview update live</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              defaultValue=""
              onChange={(e) => { handleImport(e.target.value); e.currentTarget.value = ''; }}
              className="text-xs bg-background border border-border text-dark-text rounded-lg px-2.5 py-1.5 outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="" disabled>Import from preset…</option>
              {PRESET_ORDER.map(id => (
                <option key={id} value={id}>{themes[id].label}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-dark-text hover:text-light-text hover:bg-border/30 transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-pretty">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Color pickers */}
            <div className="flex-1 min-w-0 space-y-5">
              <ColorSection title="Editor" items={UI_COLORS} draft={draft} setColor={setColor} />
              <ColorSection title="Syntax Highlighting" items={SYNTAX_COLORS} draft={draft} setColor={setColor} />
            </div>

            {/* Live preview */}
            <div className="lg:w-64 flex-shrink-0">
              <p className="text-[10px] font-semibold text-dark-text uppercase tracking-wider mb-2">Preview</p>
              <CodePreview colors={draft} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={() => setDraft(DEFAULT_CUSTOM_COLORS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dark-text hover:text-light-text border border-border hover:border-border/60 bg-background transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover transition-colors"
          >
            <Check size={12} />
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}

// ── Color section ────────────────────────────────────────────

function ColorSection({
  title,
  items,
  draft,
  setColor,
}: {
  title: string;
  items: Array<{ key: CustomColorKey; label: string }>;
  draft: CustomColors;
  setColor: (key: CustomColorKey, value: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-dark-text uppercase tracking-wider mb-3">{title}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {items.map(({ key, label }) => (
          <ColorSwatch
            key={key}
            colorKey={key}
            label={label}
            value={draft[key]}
            onChange={(v) => setColor(key, v)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Color swatch with native color picker ────────────────────

function ColorSwatch({
  colorKey,
  label,
  value,
  onChange,
}: {
  colorKey: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputId = useId();
  const [text, setText] = useState(value);

  useEffect(() => { setText(value); }, [value]);

  function handleTextChange(v: string) {
    setText(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  }

  return (
    <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2.5 py-2 hover:border-border/60 transition-colors">
      <label htmlFor={inputId} className="relative cursor-pointer flex-shrink-0" aria-label={`Pick ${label} color`}>
        <div
          className="w-7 h-7 rounded-md border border-white/15 shadow-sm transition-transform hover:scale-105"
          style={{ backgroundColor: value }}
        />
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => { onChange(e.target.value); setText(e.target.value); }}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-dark-text leading-none mb-1 truncate">{label}</p>
        <input
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => setText(value)} // reset if invalid on blur
          className="w-full bg-transparent text-[11px] font-mono text-light-text outline-none"
          maxLength={7}
          spellCheck={false}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}

// ── Live code preview ────────────────────────────────────────

function CodePreview({ colors: c }: { colors: CustomColors }) {
  return (
    <div
      className="rounded-xl p-4 text-[13px] leading-relaxed overflow-hidden font-mono"
      style={{ backgroundColor: c.background, border: `1px solid ${c.border}` }}
    >
      <Line>
        <T k="syntax-keyword" c={c}>DECLARE</T>
        <T k="light-text" c={c}> x : </T>
        <T k="syntax-type" c={c}>INTEGER</T>
      </Line>
      <Line>
        <T k="syntax-variable" c={c}>x</T>
        <T k="syntax-operator" c={c}> &lt;- </T>
        <T k="syntax-number" c={c}>42</T>
      </Line>
      <Line>
        <T k="syntax-comment" c={c}>{'// a comment'}</T>
      </Line>
      <Line>&nbsp;</Line>
      <Line>
        <T k="syntax-keyword" c={c}>IF</T>
        <T k="light-text" c={c}> x </T>
        <T k="syntax-operator" c={c}>&gt;</T>
        <T k="syntax-number" c={c}> 10 </T>
        <T k="syntax-keyword" c={c}>THEN</T>
      </Line>
      <Line>
        <T k="light-text" c={c}>{'   '}</T>
        <T k="syntax-keyword" c={c}>OUTPUT</T>
        <T k="syntax-string" c={c}> "hello"</T>
      </Line>
      <Line>
        <T k="syntax-keyword" c={c}>ENDIF</T>
      </Line>
      <Line>&nbsp;</Line>
      <Line>
        <T k="syntax-keyword" c={c}>FOR</T>
        <T k="syntax-variable" c={c}> i</T>
        <T k="syntax-operator" c={c}> &lt;- </T>
        <T k="syntax-number" c={c}>1</T>
        <T k="syntax-keyword" c={c}> TO </T>
        <T k="syntax-number" c={c}>5</T>
      </Line>
      <Line>
        <T k="light-text" c={c}>{'   '}</T>
        <T k="syntax-keyword" c={c}>RETURN</T>
        <T k="syntax-boolean" c={c}> TRUE</T>
      </Line>
      <Line>
        <T k="syntax-keyword" c={c}>NEXT</T>
        <T k="syntax-variable" c={c}> i</T>
      </Line>
    </div>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return <div className="whitespace-pre">{children}</div>;
}

function T({ k, c, children }: { k: CustomColorKey; c: CustomColors; children: React.ReactNode }) {
  return <span style={{ color: c[k] }}>{children}</span>;
}
