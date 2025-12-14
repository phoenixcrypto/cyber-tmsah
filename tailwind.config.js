/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  // JIT mode is enabled by default in Tailwind CSS v3+
  theme: {
    extend: {
      colors: {
        // Cyber TMSAH Theme Colors
        'primary-black': '#080808',
        'primary-white': '#f9fafb',
        'cyber-dark': '#080808',
        'cyber-neon': '#ff3b40',
        'cyber-red': {
          DEFAULT: '#ff3b40',
          strong: '#ff1f28',
          soft: '#ff6c73',
          muted: '#a3292d',
        },
        'cyber-violet': '#ffe4e6',
        'cyber-green': '#ff757b',
        'cyber-blue': '#ffeef1',
        'surface': {
          0: '#040404',
          1: '#080808',
          2: '#101010',
          3: '#171717',
          4: '#1e1e1e',
        },
        'dark': {
          100: '#f9fafb',
          200: '#f3f3f3',
          300: '#d1d1d1',
          400: '#9b9b9b',
          500: '#6b6b6b',
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, var(--surface-0), var(--surface-2))',
      },
      boxShadow: {
        'cyber-strong': '0 35px 80px rgba(0, 0, 0, 0.55)',
        'cyber-soft': '0 25px 45px rgba(0, 0, 0, 0.35)',
        'cyber-glow': '0 0 35px rgba(255, 59, 64, 0.45)',
        'cyber-glow-soft': '0 0 25px rgba(255, 59, 64, 0.25)',
        'neon': '0 0 20px rgba(255, 59, 64, 0.5), 0 0 40px rgba(255, 59, 64, 0.3)',
        'neon-strong': '0 0 30px rgba(255, 59, 64, 0.7), 0 0 60px rgba(255, 59, 64, 0.4)',
        'neon-ultra': '0 0 40px rgba(255, 59, 64, 0.8), 0 0 80px rgba(255, 59, 64, 0.5), 0 0 120px rgba(255, 59, 64, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-in-down': 'slideInDown 0.6s ease-out',
        'shimmer-box': 'shimmerBox 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(-50%) scale(1)' },
          '50%': { opacity: '0.6', transform: 'translateX(-50%) scale(1.1)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmerBox: {
          '0%, 100%': { left: '-100%' },
          '50%': { left: '100%' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'elastic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}

