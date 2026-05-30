'use client';

import * as Popover from '@radix-ui/react-popover';
import { Settings, Minus, Plus, Check, WrapText } from 'lucide-react';
import { themes, type ThemeId, useTheme, FONT_FAMILIES, type FontFamilyId } from '../../theme';

const themeOrder: ThemeId[] = ['one-dark-pro', 'dracula', 'nord', 'monokai', 'github-light'];
const fontOrder: FontFamilyId[] = ['fira-code', 'jetbrains-mono', 'source-code-pro', 'inconsolata'];

export default function SettingsPanel() {
  const { themeId, setTheme, fontSize, setFontSize, wordWrap, setWordWrap, fontFamilyId, setFontFamily } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-1 rounded hover:bg-white/10 transition duration-200" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-xl bg-surface border border-border p-4 shadow-intense space-y-5"
          sideOffset={8}
          align="end"
        >
          {/* Theme selector */}
          <div>
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Theme</h3>
            <div className="grid grid-cols-5 gap-2">
              {themeOrder.map((id) => {
                const theme = themes[id];
                const isActive = id === themeId;
                return (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className="flex flex-col items-center gap-1 group"
                    aria-label={theme.label}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                        ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:scale-110'}`}
                      style={{
                        backgroundColor: theme.swatch,
                        border: id === 'github-light' ? '2px solid var(--color-border)' : undefined,
                      }}
                    >
                      {isActive && (
                        <Check className="h-4 w-4" style={{ color: id === 'github-light' ? '#1E293B' : '#FFFFFF' }} />
                      )}
                    </div>
                    <span className="text-[10px] text-dark-text leading-tight text-center">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Font family picker */}
          <div>
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Font</h3>
            <div className="grid grid-cols-2 gap-2">
              {fontOrder.map((id) => {
                const font = FONT_FAMILIES[id];
                const isActive = id === fontFamilyId;
                return (
                  <button
                    key={id}
                    onClick={() => setFontFamily(id)}
                    className={`relative text-left px-3 py-2.5 rounded-lg border transition-all ${
                      isActive
                        ? 'border-primary/60 bg-primary/8 ring-1 ring-primary/30'
                        : 'border-border bg-background hover:border-border/80 hover:bg-border/10'
                    }`}
                  >
                    <span
                      className="block text-sm text-light-text leading-snug mb-1 truncate"
                      style={{ fontFamily: font.css }}
                    >
                      x &lt;- x + 1
                    </span>
                    <span className="block text-[10px] text-dark-text leading-tight truncate">{font.label}</span>
                    {isActive && (
                      <span className="absolute top-1.5 right-1.5">
                        <Check className="h-3 w-3 text-primary" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Font size control */}
          <div>
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Font Size</h3>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setFontSize(fontSize - 1)}
                disabled={fontSize <= 12}
                className="p-1.5 rounded-md bg-background border border-border hover:border-border/80 transition disabled:opacity-40"
                aria-label="Decrease font size"
              >
                <Minus className="h-3.5 w-3.5 text-light-text" />
              </button>
              <span className="text-light-text font-mono text-sm min-w-[3ch] text-center">{fontSize}px</span>
              <button
                onClick={() => setFontSize(fontSize + 1)}
                disabled={fontSize >= 24}
                className="p-1.5 rounded-md bg-background border border-border hover:border-border/80 transition disabled:opacity-40"
                aria-label="Increase font size"
              >
                <Plus className="h-3.5 w-3.5 text-light-text" />
              </button>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Word wrap toggle */}
          <div>
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Editor</h3>
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border hover:border-border/80 transition"
              aria-label="Toggle word wrap"
            >
              <span className="flex items-center gap-2 text-xs text-dark-text">
                <WrapText className="h-3.5 w-3.5" />
                Word Wrap
              </span>
              <div className={`w-8 h-4 rounded-full transition-colors relative ${wordWrap ? 'bg-primary' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          <Popover.Arrow className="fill-surface" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
