/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#646cff',
        secondary: '#535bf2',
        darkBg: '#121212',
        cardBg: '#1a1a1a',
        lightCard: '#2a2a2a',
        borderGray: '#333333',
        error: '#fd3939',
        success: '#4caf50',
        adminGold: '#ffcc00',
      },
      animation: {
        'logo-spin': 'logo-spin infinite 20s linear',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        'logo-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(100, 108, 255, 0.2)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}