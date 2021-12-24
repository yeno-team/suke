module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    maxWidth: {
      "12": '12px',
      "14": '14px',
      "16": '16px',
      "18": '18px',
      "20": '20px',
      "21": '21px',
      "22": '22px',
      "24": '24px',
      "26": '26px',
      "28": '28px',
      "50": '50px',
      "84": '84px',
      "128": '128px'
    },
    colors: {
      black: "#252B31",
      coolblack: "#171A1F",
      darkblack: "#16191D",
      spaceblack: "#101216",
      coolgray: "#21272E",
      darkgray: "#5E6668",
      gray: "#C1C8C7",
      lightgray: "#CED2D6",
      white: "#F6FAFB",
      orange: "#D49C6B",
      coolorange: "#C86730",
      red: "#A83737",
      brightRed: "#CC4F4F",
      blue: "#408ED6",
      teal: "#339EA5"
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      signika: ['Signika', 'sans-serif'],
      sitara: ['sitara', 'sans-serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
