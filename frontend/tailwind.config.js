module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'header-bg': 'var(--color-header-bg)',
        'header-text': 'var(--color-header-text)',
        'light-text': 'var(--color-light-text)',
        'dark-text': 'var(--color-dark-text)',
        border: 'var(--color-border)',
        'disabled-bg': 'var(--color-disabled-bg)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        error: 'var(--color-error)',
        'error-hover': 'var(--color-error-hover)',
        success: 'var(--color-success)',
        'code-bg': 'var(--color-code-bg)',
        'code-text': 'var(--color-code-text)',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['"Fira Code Variable"', 'Fira Code', 'Courier New', 'monospace'],
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      boxShadow: {
        cool: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        intense: '0 10px 20px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
