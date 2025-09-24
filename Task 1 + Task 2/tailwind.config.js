/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        customTeal: '#2c7a7b' // soft, earthy teal
      },
      fontFamily: {
        merri: ['Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}

