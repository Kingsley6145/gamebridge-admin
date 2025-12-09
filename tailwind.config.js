/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#BA1E4D',
        orange: '#FF6B35',
        blue: '#4A90E2',
        yellow: '#FFC107',
        green: '#4CAF50',
        teal: '#26A69A',
        indigo: '#3F51B5',
        red: '#E91E63',
        light: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          text: '#1A1A1A',
          textSecondary: '#666666',
          border: '#E0E0E0',
        },
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
          border: '#333333',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
    },
  },
  plugins: [],
}

