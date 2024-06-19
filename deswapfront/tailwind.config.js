/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green1: "#658864",
        green2: "#B7B78A",
        white1: "#fdf6fd",
        orange: "#bc6c25",
        yellow: "#ecd79b",
        gray1: "#DDDDDD",
        white2: "#EEEEEE",
        gray2: "#d1d1d1",
        black1: "#292524",
        black2: "#78716c",
        customPurple: '#818cf8',
        customLight: '#FFF8EC',
      },
      backgroundOpacity: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
      },
      gridColumn: {
        'carre': 'span 3 / span 4',
      },
    },
  },
  plugins: [],
}
