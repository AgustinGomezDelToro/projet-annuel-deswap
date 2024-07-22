/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colors: {green1: "#658864", green2: "#B7B78A", white1: "#fdf6fd", orange: "#bc6c25", yellow: "#ecd79b", gray1: "#DDDDDD", white2: "#EEEEEE", gray2: "#d1d1d1", black1: "#292524", black2: "#78716c"},
      }
    },
  },
  plugins: [],
}