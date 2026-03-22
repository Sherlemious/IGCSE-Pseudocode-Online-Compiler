'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { themes, type ThemeId } from './themes';

interface ThemeContextValue {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  wordWrap: boolean;
  setWordWrap: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_THEME = 'pseudocode-theme';
const STORAGE_KEY_FONT_SIZE = 'pseudocode-font-size';
const STORAGE_KEY_WORD_WRAP = 'pseudocode-word-wrap';
const DEFAULT_THEME: ThemeId = 'one-dark-pro';
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

function applyTheme(themeId: ThemeId) {
  const theme = themes[themeId];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.colors)) {
    root.style.setProperty(`--color-${key}`, value);
  }

  // Add RGB versions for transparent backgrounds in CodeMirror
  const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);
  const [wordWrap, setWordWrapState] = useState<boolean>(true);

  // Load from localStorage on mount
  useEffect(() => {
    setThemeId(loadTheme());
    setFontSizeState(loadFontSize());
    setWordWrapState(loadWordWrap());
  }, []);

  useEffect(() => {
    applyTheme(themeId);
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  }, [themeId]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
  }, [fontSize]);

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

  return <ThemeContext.Provider value={{ themeId, setTheme, fontSize, setFontSize, wordWrap, setWordWrap }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
