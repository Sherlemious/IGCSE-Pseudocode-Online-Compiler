'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  themes,
  type PresetThemeId,
  type ThemeId,
  type ThemeColors,
  type CustomColors,
  DEFAULT_CUSTOM_COLORS,
  deriveThemeColors,
} from './themes';

export const FONT_FAMILIES = {
  'fira-code':       { label: 'Fira Code',       css: '"Fira Code Variable", "Fira Code", monospace' },
  'jetbrains-mono':  { label: 'JetBrains Mono',  css: '"JetBrains Mono", monospace' },
  'source-code-pro': { label: 'Source Code Pro',  css: '"Source Code Pro", monospace' },
  'inconsolata':     { label: 'Inconsolata',      css: '"Inconsolata", monospace' },
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
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_THEME = 'pseudocode-theme';
const STORAGE_KEY_FONT_SIZE = 'pseudocode-font-size';
const STORAGE_KEY_WORD_WRAP = 'pseudocode-word-wrap';
const STORAGE_KEY_FONT_FAMILY = 'pseudocode-font-family';
const STORAGE_KEY_CUSTOM = 'pseudocode-custom-theme';
const DEFAULT_THEME: ThemeId = 'one-dark-pro';
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_FAMILY: FontFamilyId = 'fira-code';

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

function applyThemeColors(colors: ThemeColors) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--color-${key}`, value);
  }
  root.style.setProperty('--color-primary-rgb', hexToRgb(colors.primary));
  root.style.setProperty('--color-warning-rgb', hexToRgb(colors.warning));
  root.style.setProperty('--color-error-rgb', hexToRgb(colors.error));
}

function applyTheme(themeId: ThemeId, customColors: CustomColors) {
  if (themeId === 'custom') {
    applyThemeColors(deriveThemeColors(customColors));
  } else {
    applyThemeColors(themes[themeId as PresetThemeId].colors);
  }
}

function applyFontSize(size: number) {
  document.documentElement.style.setProperty('--editor-font-size', `${size}px`);
}

function applyFontFamily(id: FontFamilyId) {
  document.documentElement.style.setProperty('--editor-font-family', FONT_FAMILIES[id].css);
}

function loadTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY_THEME);
  if (stored === 'custom') return 'custom';
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

function loadCustomColors(): CustomColors {
  const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
  if (stored) {
    try {
      return { ...DEFAULT_CUSTOM_COLORS, ...(JSON.parse(stored) as Partial<CustomColors>) };
    } catch { /* ignore malformed data */ }
  }
  return DEFAULT_CUSTOM_COLORS;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);
  const [wordWrap, setWordWrapState] = useState<boolean>(true);
  const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>(DEFAULT_FONT_FAMILY);
  const [customColors, setCustomColorsState] = useState<CustomColors>(DEFAULT_CUSTOM_COLORS);

  useEffect(() => {
    const savedCustom = loadCustomColors();
    setCustomColorsState(savedCustom);
    setThemeId(loadTheme());
    setFontSizeState(loadFontSize());
    setWordWrapState(loadWordWrap());
    setFontFamilyId(loadFontFamily());
  }, []);

  useEffect(() => {
    applyTheme(themeId, customColors);
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customColors));
    if (themeId === 'custom') {
      applyThemeColors(deriveThemeColors(customColors));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customColors]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    applyFontFamily(fontFamilyId);
    localStorage.setItem(STORAGE_KEY_FONT_FAMILY, fontFamilyId);
  }, [fontFamilyId]);

  const setTheme = (id: ThemeId) => {
    if (id === 'custom' || id in themes) setThemeId(id);
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

  const setCustomColors = (colors: CustomColors) => {
    setCustomColorsState(colors);
  };

  return (
    <ThemeContext.Provider value={{
      themeId, setTheme,
      fontSize, setFontSize,
      wordWrap, setWordWrap,
      fontFamilyId, setFontFamily,
      customColors, setCustomColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
