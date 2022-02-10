module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        big: '1.35em'
      },
      margin: {
        '17': '4.15em',
        '18': '4.6em',
        '15.8rem': '15.8rem',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '3/20': '15%'
      },
      spacing: {
        '1.5px': '1.5px',
        '0.5': '0.2rem',
        '1.2': '0.33rem',
        '1.5': '0.430rem',
        '93p': '93%',
        '95p': '95%',
        '17': '4.15rem',
        '1/2': '50%',
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
        '100': '25rem',
        '110': '28rem',
        '120':'30rem'
      },
      width: {
        'reallybig': '60rem',
        'toobig': '150rem',
        '32' : '32px',
        '128': '35rem',
        '46': '11.5rem'
      },
      height: {
        'big': '50rem',
        '32' : '32px',
        '30p': '30%'
      }
    },
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
      "128": '128px',
      "300": '300px'
    },
    colors: {
      black: "#252B31",
      coolblack: "#171A1F",
      coolgray : "#374151",
      darkblack: "#16191D",
      newblack: "#1F2329",
      spaceblack: "#101216",
      greatblack: "#0E0E0E",
      darkgray: "#5E6668",
      gray: "#C1C8C7",
      lightgray: "#d9dbde",
      white: "#F6FAFB",
      reallywhite: "#FFFFFF",
      orange: "#D49C6B",
      coolorange: "#e08938",
      red: "#A83737",
      brightRed: "#CC4F4F",
      blue: "#408ED6",
      teal: "#339EA5",
      darkblue : "#003366",
      transparent : "#ffffff00",
      green: "#1DBC60",
      bettergreen: '#169A5B'
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      signika: ['Signika', 'sans-serif'],
      sitara: ['sitara', 'sans-serif']
    },
    backgroundImage : {}
  },
  variants: {
    extend: {
      visibility : ["group-hover"]
    }
  },
  plugins: [],
}