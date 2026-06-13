'use client';

import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import { Settings, Minus, Plus, Check, WrapText, ChevronRight, LogIn, Accessibility } from 'lucide-react';
import {
  themes,
  type PresetThemeId,
  useTheme,
  FONT_FAMILIES,
  type FontFamilyId,
} from '../../theme';

const themeOrder: PresetThemeId[] = ['one-dark-pro', 'dracula', 'nord', 'monokai', 'github-light'];
const fontOrder: FontFamilyId[] = ['fira-code', 'jetbrains-mono', 'source-code-pro', 'inconsolata'];

export default function SettingsPanel() {
  const {
    themeId, setTheme,
    fontSize, setFontSize,
    wordWrap, setWordWrap,
    fontFamilyId, setFontFamily,
    dyslexicFont, setDyslexicFont,
    customThemes, isSignedIn,
  } = useTheme();

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

            {/* Preset swatches */}
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

            {/* Custom themes — quick switch (managed in profile) */}
            {isSignedIn ? (
              <div className="mt-3 space-y-1.5">
                {customThemes.length > 0 && (
                  <div className="max-h-36 overflow-y-auto scrollbar-pretty space-y-1 pr-0.5">
                    {customThemes.map((theme) => {
                      const isActive = theme.id === themeId;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setTheme(theme.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                            isActive
                              ? 'border-primary/50 bg-primary/8 text-primary'
                              : 'border-border bg-background text-dark-text hover:text-light-text hover:border-border/60'
                          }`}
                          aria-pressed={isActive}
                        >
                          <span className="flex flex-shrink-0 rounded overflow-hidden border border-white/10">
                            <span className="w-2 h-4" style={{ backgroundColor: theme.colors.background }} />
                            <span className="w-2 h-4" style={{ backgroundColor: theme.colors.primary }} />
                            <span className="w-2 h-4" style={{ backgroundColor: theme.colors['syntax-keyword'] }} />
                          </span>
                          <span className="font-medium truncate">{theme.name}</span>
                          {isActive && <Check className="h-3 w-3 ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                <Link
                  href="/profile"
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dark-text hover:text-primary transition-colors"
                >
                  <ChevronRight size={12} />
                  Manage themes…
                </Link>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="mt-3 w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-dark-text hover:text-primary transition-colors"
              >
                <LogIn size={12} />
                Sign in to create custom themes
              </Link>
            )}
          </div>

          <div className="border-t border-border/50" />

          {/* Font family picker */}
          <div>
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Font</h3>
            {dyslexicFont && (
              <p className="text-[10px] text-warning/80 mb-2 leading-relaxed">
                Dyslexia-friendly font is on — it overrides this selection.
              </p>
            )}
            <div className={`grid grid-cols-2 gap-2 ${dyslexicFont ? 'opacity-40 pointer-events-none' : ''}`} aria-disabled={dyslexicFont}>
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

          {/* Editor toggles */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-dark-text uppercase tracking-wider mb-3">Editor</h3>
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border hover:border-border/80 transition"
              aria-label="Toggle word wrap"
              aria-pressed={wordWrap}
            >
              <span className="flex items-center gap-2 text-xs text-dark-text">
                <WrapText className="h-3.5 w-3.5" />
                Word Wrap
              </span>
              <div className={`w-8 h-4 rounded-full transition-colors relative ${wordWrap ? 'bg-primary' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </button>
            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border hover:border-border/80 transition"
              aria-label="Toggle dyslexia-friendly font"
              aria-pressed={dyslexicFont}
            >
              <span className="flex items-center gap-2 text-xs text-dark-text">
                <Accessibility className="h-3.5 w-3.5" />
                Dyslexia-friendly font
              </span>
              <div className={`w-8 h-4 rounded-full transition-colors relative ${dyslexicFont ? 'bg-primary' : 'bg-border'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${dyslexicFont ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          <Popover.Arrow className="fill-surface" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
