'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { themes, type ThemeId } from './themes';

export const FONT_FAMILIES = {
  'fira-code':       { label: 'Fira Code',       css: '"Fira Code Variable", "Fira Code", monospace' },
  'jetbrains-mono':  { label: 'JetBrains Mono',  css: 'var(--font-jetbrains-mono), monospace' },
  'source-code-pro': { label: 'Source Code Pro',  css: 'var(--font-source-code-pro), monospace' },
  'inconsolata':     { label: 'Inconsolata',      css: 'var(--font-inconsolata), monospace' },
} as const;

export type FontFamilyId = keyof typeof FONT_FAMILIES;

interface ThemeContextValue {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  wordWrap: boolean;
  setWordWrap: (v: boolean) => void;
  fontFamilyId: FontFamilyId;
  setFontFamily: (id: FontFamilyId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_THEME = 'pseudocode-theme';
const STORAGE_KEY_FONT_SIZE = 'pseudocode-font-size';
const STORAGE_KEY_WORD_WRAP = 'pseudocode-word-wrap';
const STORAGE_KEY_FONT_FAMILY = 'pseudocode-font-family';
const DEFAULT_THEME: ThemeId = 'one-dark-pro';
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_FAMILY: FontFamilyId = 'fira-code';

function applyTheme(themeId: ThemeId) {
  const theme = themes[themeId];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--color-${key}`, value);
  }

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  };

  root.style.setProperty('--color-primary-rgb', hexToRgb(theme.colors.primary));
  root.style.setProperty('--color-warning-rgb', hexToRgb(theme.colors.warning));
  root.style.setProperty('--color-error-rgb', hexToRgb(theme.colors.error));
}

function applyFontSize(size: number) {
  document.documentElement.style.setProperty('--editor-font-size', `${size}px`);
}

function applyFontFamily(id: FontFamilyId) {
  document.documentElement.style.setProperty('--editor-font-family', FONT_FAMILIES[id].css);
}

function loadTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY_THEME);
  if (stored && stored in themes) return stored as ThemeId;
  return DEFAULT_THEME;
}

function loadFontSize(): number {
  const stored = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) return parsed;
  }
  return DEFAULT_FONT_SIZE;
}

function loadWordWrap(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY_WORD_WRAP);
  if (stored !== null) return stored === 'true';
  return true;
}

function loadFontFamily(): FontFamilyId {
  const stored = localStorage.getItem(STORAGE_KEY_FONT_FAMILY);
  if (stored && stored in FONT_FAMILIES) return stored as FontFamilyId;
  return DEFAULT_FONT_FAMILY;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);
  const [wordWrap, setWordWrapState] = useState<boolean>(true);
  const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>(DEFAULT_FONT_FAMILY);

  useEffect(() => {
    setThemeId(loadTheme());
    setFontSizeState(loadFontSize());
    setWordWrapState(loadWordWrap());
    setFontFamilyId(loadFontFamily());
  }, []);

  useEffect(() => {
    applyTheme(themeId);
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  }, [themeId]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    applyFontFamily(fontFamilyId);
    localStorage.setItem(STORAGE_KEY_FONT_FAMILY, fontFamilyId);
  }, [fontFamilyId]);

  const setTheme = (id: ThemeId) => {
    if (id in themes) setThemeId(id);
  };

  const setFontSize = (size: number) => {
    const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size));
    setFontSizeState(clamped);
  };

  const setWordWrap = (v: boolean) => {
    setWordWrapState(v);
    localStorage.setItem(STORAGE_KEY_WORD_WRAP, String(v));
  };

  const setFontFamily = (id: FontFamilyId) => {
    if (id in FONT_FAMILIES) setFontFamilyId(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, fontSize, setFontSize, wordWrap, setWordWrap, fontFamilyId, setFontFamily }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
