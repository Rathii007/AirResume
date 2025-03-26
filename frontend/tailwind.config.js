/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        silver: {
          100: "#E5E5E5",
          200: "#D3D3D3",
          300: "#C0C0C0",
          400: "#A9A9A9",
          500: "#808080",
        },
      },
    },
  },
  plugins: [],
};