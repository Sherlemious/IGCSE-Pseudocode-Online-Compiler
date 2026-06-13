'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  themes,
  type PresetThemeId,
  type ActiveThemeId,
  type ThemeColors,
  type CustomColors,
  type SavedTheme,
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
  themeId: ActiveThemeId;
  setTheme: (id: ActiveThemeId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  wordWrap: boolean;
  setWordWrap: (v: boolean) => void;
  fontFamilyId: FontFamilyId;
  setFontFamily: (id: FontFamilyId) => void;
  /** The signed-in user's saved custom themes (empty when signed out). */
  customThemes: SavedTheme[];
  /** True while the initial DB fetch of custom themes is in flight. */
  themesLoading: boolean;
  /** Whether a user is signed in (custom themes are a signed-in-only feature). */
  isSignedIn: boolean;
  createTheme: (name: string, colors: CustomColors) => Promise<SavedTheme | null>;
  updateTheme: (id: string, data: { name?: string; colors?: CustomColors }) => Promise<boolean>;
  deleteTheme: (id: string) => Promise<boolean>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY_THEME = 'pseudocode-theme';
const STORAGE_KEY_FONT_SIZE = 'pseudocode-font-size';
const STORAGE_KEY_WORD_WRAP = 'pseudocode-word-wrap';
const STORAGE_KEY_FONT_FAMILY = 'pseudocode-font-family';
const STORAGE_KEY_ACTIVE_COLORS = 'pseudocode-active-colors'; // first-paint cache for active custom theme
const STORAGE_KEY_LEGACY_CUSTOM = 'pseudocode-custom-theme';  // pre-multi-theme single custom theme
const DEFAULT_THEME: PresetThemeId = 'one-dark-pro';
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

function applyFontSize(size: number) {
  document.documentElement.style.setProperty('--editor-font-size', `${size}px`);
}

function applyFontFamily(id: FontFamilyId) {
  document.documentElement.style.setProperty('--editor-font-family', FONT_FAMILIES[id].css);
}

function isPreset(id: string): id is PresetThemeId {
  return id in themes;
}

function loadTheme(): ActiveThemeId {
  return localStorage.getItem(STORAGE_KEY_THEME) ?? DEFAULT_THEME;
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

function parseStoredColors(raw: string | null): CustomColors | null {
  if (!raw) return null;
  try {
    return { ...DEFAULT_CUSTOM_COLORS, ...(JSON.parse(raw) as Partial<CustomColors>) };
  } catch {
    return null;
  }
}

/** Cached colours of the active custom theme (falls back to the legacy single theme). */
function loadActiveColors(): CustomColors | null {
  return (
    parseStoredColors(localStorage.getItem(STORAGE_KEY_ACTIVE_COLORS)) ??
    parseStoredColors(localStorage.getItem(STORAGE_KEY_LEGACY_CUSTOM))
  );
}

// ── API helpers ──────────────────────────────────────────────

async function apiCreateTheme(name: string, colors: CustomColors): Promise<SavedTheme | null> {
  const res = await fetch('/api/themes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, colors }),
  });
  if (!res.ok) return null;
  const { theme } = (await res.json()) as { theme: SavedTheme };
  return theme;
}

async function apiUpdateTheme(
  id: string,
  data: { name?: string; colors?: CustomColors },
): Promise<SavedTheme | null> {
  const res = await fetch(`/api/themes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const { theme } = (await res.json()) as { theme: SavedTheme };
  return theme;
}

async function apiDeleteTheme(id: string): Promise<boolean> {
  const res = await fetch(`/api/themes/${id}`, { method: 'DELETE' });
  return res.ok;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const isSignedIn = status === 'authenticated';

  const [themeId, setThemeId] = useState<ActiveThemeId>(DEFAULT_THEME);
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE);
  const [wordWrap, setWordWrapState] = useState<boolean>(true);
  const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>(DEFAULT_FONT_FAMILY);
  const [customThemes, setCustomThemes] = useState<SavedTheme[]>([]);
  const [themesLoading, setThemesLoading] = useState<boolean>(true);

  // Load locally-persisted preferences on mount.
  useEffect(() => {
    setThemeId(loadTheme());
    setFontSizeState(loadFontSize());
    setWordWrapState(loadWordWrap());
    setFontFamilyId(loadFontFamily());
  }, []);

  // Fetch the user's saved themes when auth state resolves; migrate any legacy theme.
  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated') {
      setCustomThemes([]);
      setThemesLoading(false);
      // A custom theme can't be active while signed out — fall back to the default preset.
      setThemeId((prev) => (isPreset(prev) ? prev : DEFAULT_THEME));
      return;
    }

    let cancelled = false;
    setThemesLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/themes');
        if (!res.ok) throw new Error('fetch failed');
        let { themes: list } = (await res.json()) as { themes: SavedTheme[] };

        // One-time migration of the pre-multi-theme single custom theme.
        if (list.length === 0) {
          const legacy = parseStoredColors(localStorage.getItem(STORAGE_KEY_LEGACY_CUSTOM));
          if (legacy) {
            const created = await apiCreateTheme('My Theme', legacy);
            if (created) {
              list = [created];
              localStorage.removeItem(STORAGE_KEY_LEGACY_CUSTOM);
            }
          }
        }

        if (cancelled) return;
        setCustomThemes(list);
        setThemeId((prev) => {
          if (isPreset(prev)) return prev;
          if (prev === 'custom') return list[0]?.id ?? DEFAULT_THEME; // legacy selection
          return list.some((t) => t.id === prev) ? prev : DEFAULT_THEME;
        });
      } catch {
        if (!cancelled) setCustomThemes([]);
      } finally {
        if (!cancelled) setThemesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  // Apply the active theme's colours whenever the selection or the theme list changes.
  useEffect(() => {
    if (isPreset(themeId)) {
      applyThemeColors(themes[themeId].colors);
    } else {
      const active = customThemes.find((t) => t.id === themeId);
      if (active) {
        applyThemeColors(deriveThemeColors(active.colors));
        localStorage.setItem(STORAGE_KEY_ACTIVE_COLORS, JSON.stringify(active.colors));
      } else if (themesLoading) {
        // Still loading from the DB — paint the cached colours to avoid a flash.
        const cached = loadActiveColors();
        if (cached) applyThemeColors(deriveThemeColors(cached));
      } else {
        // Selected theme no longer exists — fall back to the default preset.
        applyThemeColors(themes[DEFAULT_THEME].colors);
      }
    }
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  }, [themeId, customThemes, themesLoading]);

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    applyFontFamily(fontFamilyId);
    localStorage.setItem(STORAGE_KEY_FONT_FAMILY, fontFamilyId);
  }, [fontFamilyId]);

  const setTheme = useCallback(
    (id: ActiveThemeId) => {
      if (isPreset(id) || customThemes.some((t) => t.id === id)) setThemeId(id);
    },
    [customThemes],
  );

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

  const createTheme = useCallback(async (name: string, colors: CustomColors) => {
    const created = await apiCreateTheme(name, colors);
    if (!created) {
      toast.error('Could not save theme');
      return null;
    }
    setCustomThemes((prev) => [...prev, created]);
    return created;
  }, []);

  const updateTheme = useCallback(
    async (id: string, data: { name?: string; colors?: CustomColors }) => {
      const updated = await apiUpdateTheme(id, data);
      if (!updated) {
        toast.error('Could not update theme');
        return false;
      }
      setCustomThemes((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    },
    [],
  );

  const deleteTheme = useCallback(async (id: string) => {
    const ok = await apiDeleteTheme(id);
    if (!ok) {
      toast.error('Could not delete theme');
      return false;
    }
    setCustomThemes((prev) => prev.filter((t) => t.id !== id));
    setThemeId((prev) => (prev === id ? DEFAULT_THEME : prev));
    return true;
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeId, setTheme,
        fontSize, setFontSize,
        wordWrap, setWordWrap,
        fontFamilyId, setFontFamily,
        customThemes, themesLoading, isSignedIn,
        createTheme, updateTheme, deleteTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
