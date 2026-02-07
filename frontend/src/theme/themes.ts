export type ThemeId = 'one-dark-pro' | 'dracula' | 'nord' | 'monokai' | 'github-light';

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
  'one-dark-pro': {
    id: 'one-dark-pro',
    label: 'One Dark Pro',
    swatch: '#282C34',
    colors: {
      primary: '#61AFEF',
      'primary-hover': '#528BCC',
      secondary: '#21252B',
      accent: '#61AFEF',
      background: '#282C34',
      surface: '#21252B',
      'header-bg': '#61AFEF',
      'header-text': '#FFFFFF',
      'light-text': '#ABB2BF',
      'dark-text': '#5C6370',
      border: '#181A1F',
      'disabled-bg': '#2C313A',
      warning: '#E5C07B',
      info: '#61AFEF',
      error: '#E06C75',
      'error-hover': '#BE5046',
      success: '#98C379',
      'code-bg': '#282C34',
      'code-text': '#ABB2BF',
      // One Dark Pro syntax (Atom/VS Code)
      'syntax-keyword': '#C678DD',
      'syntax-type': '#E5C07B',
      'syntax-string': '#98C379',
      'syntax-number': '#D19A66',
      'syntax-boolean': '#D19A66',
      'syntax-operator': '#56B6C2',
      'syntax-comment': '#5C6370',
      'syntax-variable': '#E06C75',
    },
  },
  dracula: {
    id: 'dracula',
    label: 'Dracula',
    swatch: '#282A36',
    colors: {
      primary: '#BD93F9',
      'primary-hover': '#9D79D6',
      secondary: '#21222C',
      accent: '#FF79C6',
      background: '#282A36',
      surface: '#21222C',
      'header-bg': '#BD93F9',
      'header-text': '#F8F8F2',
      'light-text': '#F8F8F2',
      'dark-text': '#6272A4',
      border: '#21222C',
      'disabled-bg': '#44475A',
      warning: '#F1FA8C',
      info: '#8BE9FD',
      error: '#FF5555',
      'error-hover': '#FF6E6E',
      success: '#50FA7B',
      'code-bg': '#282A36',
      'code-text': '#F8F8F2',
      // Dracula Official syntax
      'syntax-keyword': '#FF79C6',
      'syntax-type': '#8BE9FD',
      'syntax-string': '#F1FA8C',
      'syntax-number': '#BD93F9',
      'syntax-boolean': '#BD93F9',
      'syntax-operator': '#FF79C6',
      'syntax-comment': '#6272A4',
      'syntax-variable': '#F8F8F2',
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
      // Nord Official syntax
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
      primary: '#66D9EF',
      'primary-hover': '#4DB8D0',
      secondary: '#3E3D32',
      accent: '#A6E22E',
      background: '#272822',
      surface: '#3E3D32',
      'header-bg': '#66D9EF',
      'header-text': '#272822',
      'light-text': '#F8F8F2',
      'dark-text': '#CFCFC2',
      border: '#75715E',
      'disabled-bg': '#595950',
      warning: '#E6DB74',
      info: '#66D9EF',
      error: '#FD971F',
      'error-hover': '#E08414',
      success: '#A6E22E',
      'code-bg': '#3E3D32',
      'code-text': '#F8F8F2',
      // Classic Monokai syntax (Sublime Text)
      'syntax-keyword': '#66D9EF',
      'syntax-type': '#A6E22E',
      'syntax-string': '#E6DB74',
      'syntax-number': '#AE81FF',
      'syntax-boolean': '#AE81FF',
      'syntax-operator': '#FD971F',
      'syntax-comment': '#75715E',
      'syntax-variable': '#F8F8F2',
    },
  },
  'github-light': {
    id: 'github-light',
    label: 'GitHub Light',
    swatch: '#FFFFFF',
    colors: {
      primary: '#0969DA',
      'primary-hover': '#0550AE',
      secondary: '#F6F8FA',
      accent: '#0969DA',
      background: '#FFFFFF',
      surface: '#F6F8FA',
      'header-bg': '#0969DA',
      'header-text': '#FFFFFF',
      'light-text': '#1F2328',
      'dark-text': '#656D76',
      border: '#D1D9E0',
      'disabled-bg': '#D1D9E0',
      warning: '#BF8700',
      info: '#0969DA',
      error: '#D1242F',
      'error-hover': '#A40E26',
      success: '#1A7F37',
      'code-bg': '#F6F8FA',
      'code-text': '#1F2328',
      // GitHub Light syntax
      'syntax-keyword': '#CF222E',
      'syntax-type': '#0550AE',
      'syntax-string': '#0A3069',
      'syntax-number': '#0550AE',
      'syntax-boolean': '#CF222E',
      'syntax-operator': '#1F2328',
      'syntax-comment': '#57606A',
      'syntax-variable': '#953800',
    },
  },
};
