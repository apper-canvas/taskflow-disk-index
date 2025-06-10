/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B21B6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] 
      },
      animation: {
        'completion-burst': 'completion-burst 0.6s ease-out forwards',
        'task-scale-down': 'task-scale-down 0.3s ease-out forwards',
        'checkbox-fill': 'checkbox-fill 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
      },
      keyframes: {
        'completion-burst': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(0.95)', opacity: '0.9' }
        },
        'task-scale-down': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0.7' }
        },
        'checkbox-fill': {
          '0%': { backgroundColor: 'transparent', transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { backgroundColor: '#10B981', transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}