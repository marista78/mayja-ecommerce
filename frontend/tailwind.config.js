/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6e7e9',
          100: '#cdcfd2',
          200: '#9b9fa6',
          300: '#696f79',
          400: '#373f4d',
          500: '#011222', // Official Navy
          600: '#01101f',
          700: '#010d19',
          800: '#010a13',
          900: '#00070d',
        },
        secondary: {
          50: '#fff3e8',
          100: '#ffe1c7',
          200: '#ffc18f',
          300: '#ffa157',
          400: '#ff811f',
          500: '#FC7D14', // Official Orange/Gold
          600: '#e37012',
          700: '#bd5d0f',
          800: '#974a0c',
          900: '#713709',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}