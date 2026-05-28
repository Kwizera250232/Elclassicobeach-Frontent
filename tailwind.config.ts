import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#dbc89a',
        cream: '#f7efe0',
        ocean: '#0f3b57',
        abyss: '#081b2a',
        sunset: '#f19658',
        coral: '#df6e47',
        gold: '#d9aa4b',
      },
      boxShadow: {
        glow: '0 20px 80px rgba(241, 150, 88, 0.22)',
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
