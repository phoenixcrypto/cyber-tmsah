import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cyber-dark': '#0a0a0a',
        'cyber-glow': '#00ff88',
        'cyber-neon': '#00ff88',
        'cyber-violet': '#8b5cf6',
        'cyber-green': '#10b981',
        'cyber-blue': '#3b82f6',
        'dark-100': '#ffffff',
        'dark-200': '#e5e7eb',
        'dark-300': '#9ca3af',
        'dark-400': '#6b7280',
        'dark-500': '#374151',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #00ff88, #8b5cf6, #10b981, #3b82f6)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-up-delayed': 'slideUpDelayed 1s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        slideUpDelayed: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        glowPulse: {
          '0%': { 
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.3)' 
          },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 136, 0.5)',
        'cyber-lg': '0 0 30px rgba(0, 255, 136, 0.8)',
        'cyber-xl': '0 0 40px rgba(0, 255, 136, 0.3)',
        'dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 12px 40px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}

export default config