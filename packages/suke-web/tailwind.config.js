module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      black: "#252B31",
      coolblack: "#171A1F",
      coolgray : "#374151",
      darkblack: "#16191D",
      spaceblack: "#101216",
      darkgray: "#5E6668",
      gray: "#C1C8C7",
      lightgray: "#CED2D6",
      white: "#F6FAFB",
      orange: "#D49C6B",
      coolorange: "#C86730",
      red: "#A83737",
      brightRed: "#CC4F4F",
      blue: "#408ED6",
      teal: "#339EA5",
      transparent : "#ffffff00",
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      signika: ['Signika', 'sans-serif'],
      sitara: ['sitara', 'sans-serif']
    },
    backgroundImage : {
      "blah" : "url('./assets/blah.png')" 
    }
  },
  variants: {
    extend: {
      visibility : ["group-hover"]
    }
  },
  plugins: [],
}
