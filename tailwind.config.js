/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'velvet-red': '#8B0000',
        'neon-pink': '#FF1493',
        'neon-blue': '#00FFFF',
        'cigarette-burn': '#3D2817',
        'beer-stain': '#D4A574',
        'grimy-gold': '#FFD700',
      },
      fontFamily: {
        'neon': ['"Press Start 2P"', 'cursive'],
        'retro': ['"VT323"', 'monospace'],
      },
      animation: {
        'neon-flicker': 'flicker 2s infinite',
        'coin-flip': 'flip 1.8s ease-in-out',
        'stripper-rotate': 'rotate 0.5s ease-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
          '75%': { opacity: 0.9 },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg) translateY(0px)' },
          '50%': { transform: 'rotateY(1800deg) translateY(-100px)' },
          '100%': { transform: 'rotateY(3600deg) translateY(0px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(36deg)' },
        },
      },
    },
  },
  plugins: [],
}
