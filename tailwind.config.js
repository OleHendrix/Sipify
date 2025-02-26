/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Inclusief index.html en alle React-componenten
  theme: {
    extend: {
      
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        
      }
    }
  },
  plugins: [],
};
