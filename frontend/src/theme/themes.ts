export type ThemeId = 'dark-navy' | 'midnight-purple' | 'nord' | 'monokai' | 'light';

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
}

export interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
  colors: ThemeColors;
}

export const themes: Record<ThemeId, Theme> = {
  'dark-navy': {
    id: 'dark-navy',
    label: 'Dark Navy',
    swatch: '#0D1B2A',
    colors: {
      primary: '#778DA9',
      'primary-hover': '#5C7A99',
      secondary: '#1E293B',
      accent: '#778DA9',
      background: '#0D1B2A',
      surface: '#1E293B',
      'header-bg': '#778DA9',
      'header-text': '#F8FAFC',
      'light-text': '#F8FAFC',
      'dark-text': '#E0E1DD',
      border: '#334155',
      'disabled-bg': '#475569',
      warning: '#F59E0B',
      info: '#06B6D4',
      error: '#EF4444',
      'error-hover': '#DC2626',
      success: '#22C55E',
      'code-bg': '#1E293B',
      'code-text': '#E2E8F0',
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
    },
  },
};
