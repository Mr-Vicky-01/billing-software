import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          50: 'hsl(225, 18%, 18%)',
          100: 'hsl(225, 20%, 16%)',
          200: 'hsl(225, 20%, 13%)',
          300: 'hsl(225, 22%, 11%)',
          400: 'hsl(225, 25%, 8%)',
          500: 'hsl(225, 28%, 6%)',
        },
        accent: {
          DEFAULT: 'hsl(38, 90%, 55%)',
          hover: 'hsl(38, 92%, 48%)',
          muted: 'hsl(38, 40%, 40%)',
          subtle: 'hsla(38, 90%, 55%, 0.08)',
          glow: 'hsla(38, 90%, 55%, 0.25)',
        },
        ivory: {
          DEFAULT: 'hsl(40, 15%, 92%)',
          muted: 'hsl(225, 12%, 70%)',
          dim: 'hsl(225, 15%, 45%)',
        },
      },
      animation: {
        'reveal-up': 'reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-down': 'slide-down 0.3s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px hsla(38, 90%, 55%, 0.25)' },
          '50%': { boxShadow: '0 0 30px hsla(38, 90%, 55%, 0.25), 0 0 60px hsla(38, 90%, 55%, 0.1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'dark': '0 4px 20px hsla(0, 0%, 0%, 0.3), 0 1px 4px hsla(0, 0%, 0%, 0.2)',
        'dark-lg': '0 10px 40px hsla(0, 0%, 0%, 0.4), 0 4px 12px hsla(0, 0%, 0%, 0.3)',
        'dark-xl': '0 20px 60px hsla(0, 0%, 0%, 0.5), 0 8px 20px hsla(0, 0%, 0%, 0.3)',
        'glow-amber': '0 0 20px hsla(38, 90%, 55%, 0.25), 0 0 60px hsla(38, 90%, 55%, 0.08)',
        'glow-sm': '0 0 10px hsla(38, 90%, 55%, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
