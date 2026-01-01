import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Fluent Design Colors
        'ms-blue': {
          DEFAULT: '#0078D4',
          50: '#E6F2FB',
          100: '#CCE4F7',
          200: '#99C9EF',
          300: '#66AEE7',
          400: '#3393DF',
          500: '#0078D4',
          600: '#0060AA',
          700: '#004880',
          800: '#003055',
          900: '#00182B',
        },
        'ms-gray': {
          10: '#FAF9F8',
          20: '#F3F2F1',
          30: '#EDEBE9',
          40: '#E1DFDD',
          50: '#D2D0CE',
          60: '#C8C6C4',
          90: '#A19F9D',
          130: '#605E5C',
          160: '#323130',
          190: '#201F1E',
        },
        'ms-success': '#107C10',
        'ms-warning': '#FFB900',
        'ms-error': '#D13438',
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'fluent-4': '0 1.6px 3.6px 0 rgba(0,0,0,0.132), 0 0.3px 0.9px 0 rgba(0,0,0,0.108)',
        'fluent-8': '0 3.2px 7.2px 0 rgba(0,0,0,0.132), 0 0.6px 1.8px 0 rgba(0,0,0,0.108)',
        'fluent-16': '0 6.4px 14.4px 0 rgba(0,0,0,0.132), 0 1.2px 3.6px 0 rgba(0,0,0,0.108)',
        'fluent-64': '0 25.6px 57.6px 0 rgba(0,0,0,0.22), 0 4.8px 14.4px 0 rgba(0,0,0,0.18)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
