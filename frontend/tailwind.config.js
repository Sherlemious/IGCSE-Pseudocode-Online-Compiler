module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Main Theme Colors
        primary: '#778DA9',
        secondary: '#1E293B',
        accent: '#778DA9',

        // Background Colors
        background: '#0D1B2A',
        surface: '#1E293B',

        // Text Colors
        'light-text': '#F8FAFC',
        'dark-text': '#E0E1DD',

        // Status Colors
        warning: '#F59E0B', // Warm amber for warnings
        info: '#06B6D4', // Cyan for information
        error: '#EF4444', // Red for errors
        success: '#22C55E', // Green for success

        // Code Block Colors
        'code-bg': '#1E293B', // Darker blue for code blocks
        'code-text': '#E2E8F0', // Lighter gray for code text
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
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
