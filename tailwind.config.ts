import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#080D17',
          900: '#0D1421',
          800: '#111B2E',
          750: '#162038',
          700: '#1D2B47',
          600: '#253554',
          500: '#3A4F6E',
          400: '#5A7399',
          300: '#8AAAC8',
          200: '#C5D9EC',
        },
        teal: {
          600: '#0D9488',
          500: '#14B8A6',
          400: '#2DD4BF',
          300: '#5EEAD4',
        },
        blue: {
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
        },
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-dot':  'pulse-dot 2s ease infinite',
        'marquee':    'marquee 28s linear infinite',
        'fade-up':    'fade-up 0.6s ease both',
        'spin-slow':  'spin 20s linear infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-dot': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
        marquee:     { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'fade-up':   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
