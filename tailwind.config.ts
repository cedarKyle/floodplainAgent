import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cedar: {
          bg: '#0b1220',
          panel: '#111a2a',
          panelSoft: '#1a2538',
          border: '#2a3a57',
          text: '#d7e2f2',
          muted: '#9bb0cc',
          green: '#22c55e',
          yellow: '#f59e0b',
          red: '#ef4444',
          blue: '#38bdf8'
        }
      }
    }
  },
  plugins: []
};

export default config;
