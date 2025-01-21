module.exports = {
  darkMode: 'class', // Dark mode toggled manually via class
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark Mode Default Colors
        primary: '#06B6D4', // Cool Indigo
        secondary: '#F43F5E', // Vibrant Pink-Red
        accent: '#10B981', // Emerald Green
        background: '#18181B', // Near Black Background
        'light-text': '#E4E4E7', // Soft Light Text
        'dark-text': '#A1A1AA', // Muted Light Text
        warning: '#F87171', // Soft Red for warnings
        info: '#34D399', // Bright Green for information
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'], // Clean sans-serif fonts
        mono: ['Fira Code', 'Courier New', 'monospace'], // For code blocks
      },
      spacing: {
        128: '32rem', // Large custom spacing
        144: '36rem', // Extra large custom spacing
      },
      boxShadow: {
        cool: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)', // Subtle shadow
        intense: '0 10px 20px rgba(0, 0, 0, 0.2)', // Stronger shadow for highlights
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
