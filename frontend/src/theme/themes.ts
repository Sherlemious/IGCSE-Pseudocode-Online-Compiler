export type ThemeId = 'electron' | 'midnight-purple' | 'nord' | 'monokai' | 'light';

export interface ThemeColors {
  primary: string;
  'primary-hover': string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  'header-bg': string;
  'header-text': string;
  'light-text': string;
  'dark-text': string;
  border: string;
  'disabled-bg': string;
  warning: string;
  info: string;
  error: string;
  'error-hover': string;
  success: string;
  'code-bg': string;
  'code-text': string;
  // Syntax highlighting colors
  'syntax-keyword': string;
  'syntax-type': string;
  'syntax-string': string;
  'syntax-number': string;
  'syntax-boolean': string;
  'syntax-operator': string;
  'syntax-comment': string;
  'syntax-variable': string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeId, Theme> = {
  electron: {
    id: 'electron',
    label: 'Electron',
    swatch: '#1E1E1E',
    colors: {
      primary: '#007ACC',
      'primary-hover': '#005A9E',
      secondary: '#252526',
      accent: '#0098FF',
      background: '#1E1E1E',
      surface: '#252526',
      'header-bg': '#007ACC',
      'header-text': '#FFFFFF',
      'light-text': '#D4D4D4',
      'dark-text': '#CCCCCC',
      border: '#3E3E42',
      'disabled-bg': '#3E3E42',
      warning: '#D7BA7D',
      info: '#4FC1FF',
      error: '#F48771',
      'error-hover': '#E74856',
      success: '#89D185',
      'code-bg': '#1E1E1E',
      'code-text': '#D4D4D4',
      // VS Code-inspired syntax colors
      'syntax-keyword': '#569CD6',
      'syntax-type': '#4EC9B0',
      'syntax-string': '#CE9178',
      'syntax-number': '#B5CEA8',
      'syntax-boolean': '#569CD6',
      'syntax-operator': '#D4D4D4',
      'syntax-comment': '#6A9955',
      'syntax-variable': '#9CDCFE',
    },
  },
  'midnight-purple': {
    id: 'midnight-purple',
    label: 'Midnight Purple',
    swatch: '#1A1025',
    colors: {
      primary: '#A78BFA',
      'primary-hover': '#8B5CF6',
      secondary: '#2D1B4E',
      accent: '#C4B5FD',
      background: '#1A1025',
      surface: '#2D1B4E',
      'header-bg': '#7C3AED',
      'header-text': '#F5F3FF',
      'light-text': '#F5F3FF',
      'dark-text': '#C4B5FD',
      border: '#4C1D95',
      'disabled-bg': '#553C9A',
      warning: '#FBBF24',
      info: '#67E8F9',
      error: '#F87171',
      'error-hover': '#EF4444',
      success: '#34D399',
      'code-bg': '#2D1B4E',
      'code-text': '#E9D5FF',
      // Vibrant purple theme syntax
      'syntax-keyword': '#C792EA',
      'syntax-type': '#FFCB6B',
      'syntax-string': '#C3E88D',
      'syntax-number': '#F78C6C',
      'syntax-boolean': '#FF5370',
      'syntax-operator': '#89DDFF',
      'syntax-comment': '#7C4DFF',
      'syntax-variable': '#E9D5FF',
    },
  },
  nord: {
    id: 'nord',
    label: 'Nord',
    swatch: '#2E3440',
    colors: {
      primary: '#88C0D0',
      'primary-hover': '#6BAEBF',
      secondary: '#3B4252',
      accent: '#81A1C1',
      background: '#2E3440',
      surface: '#3B4252',
      'header-bg': '#5E81AC',
      'header-text': '#ECEFF4',
      'light-text': '#ECEFF4',
      'dark-text': '#D8DEE9',
      border: '#4C566A',
      'disabled-bg': '#4C566A',
      warning: '#EBCB8B',
      info: '#88C0D0',
      error: '#BF616A',
      'error-hover': '#A3414A',
      success: '#A3BE8C',
      'code-bg': '#3B4252',
      'code-text': '#D8DEE9',
      // Nord color palette syntax
      'syntax-keyword': '#81A1C1',
      'syntax-type': '#8FBCBB',
      'syntax-string': '#A3BE8C',
      'syntax-number': '#B48EAD',
      'syntax-boolean': '#81A1C1',
      'syntax-operator': '#88C0D0',
      'syntax-comment': '#616E88',
      'syntax-variable': '#D8DEE9',
    },
  },
  monokai: {
    id: 'monokai',
    label: 'Monokai',
    swatch: '#272822',
    colors: {
      primary: '#F9A825',
      'primary-hover': '#F57F17',
      secondary: '#3E3D32',
      accent: '#A6E22E',
      background: '#272822',
      surface: '#3E3D32',
      'header-bg': '#49483E',
      'header-text': '#F8F8F2',
      'light-text': '#F8F8F2',
      'dark-text': '#CFCFC2',
      border: '#75715E',
      'disabled-bg': '#595950',
      warning: '#E6DB74',
      info: '#66D9EF',
      error: '#F92672',
      'error-hover': '#D4145A',
      success: '#A6E22E',
      'code-bg': '#3E3D32',
      'code-text': '#F8F8F2',
      // Classic Monokai syntax
      'syntax-keyword': '#F92672',
      'syntax-type': '#66D9EF',
      'syntax-string': '#E6DB74',
      'syntax-number': '#AE81FF',
      'syntax-boolean': '#AE81FF',
      'syntax-operator': '#F92672',
      'syntax-comment': '#75715E',
      'syntax-variable': '#F8F8F2',
    },
  },
  light: {
    id: 'light',
    label: 'Light',
    swatch: '#FFFFFF',
    colors: {
      primary: '#2563EB',
      'primary-hover': '#1D4ED8',
      secondary: '#F1F5F9',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F1F5F9',
      'header-bg': '#2563EB',
      'header-text': '#FFFFFF',
      'light-text': '#1E293B',
      'dark-text': '#475569',
      border: '#CBD5E1',
      'disabled-bg': '#CBD5E1',
      warning: '#D97706',
      info: '#0891B2',
      error: '#DC2626',
      'error-hover': '#B91C1C',
      success: '#16A34A',
      'code-bg': '#F1F5F9',
      'code-text': '#334155',
      // Light theme syntax
      'syntax-keyword': '#0000FF',
      'syntax-type': '#267F99',
      'syntax-string': '#A31515',
      'syntax-number': '#098658',
      'syntax-boolean': '#0000FF',
      'syntax-operator': '#000000',
      'syntax-comment': '#008000',
      'syntax-variable': '#001080',
    },
  },
};
