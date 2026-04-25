/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cyber': {
          'bg': '#0a0e1a',
          'surface': '#111827',
          'border': '#1e293b',
          'neon': '#00f5ff',
          'neon-dim': '#00bcd4',
          'purple': '#a855f7',
          'purple-dim': '#7c3aed',
          'gold': '#fbbf24',
          'danger': '#ef4444',
          'success': '#10b981',
        }
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        glow: {
          'from': { textShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff' },
          'to': { textShadow: '0 0 5px #00bcd4, 0 0 15px #00bcd4' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.1)',
        'neon-strong': '0 0 30px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 245, 255, 0.3)',
        'purple': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
        'gold': '0 0 20px rgba(251, 191, 36, 0.3)',
        'inner-neon': 'inset 0 0 20px rgba(0, 245, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
