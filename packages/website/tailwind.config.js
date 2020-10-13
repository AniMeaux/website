"use strict";

const { colors, fontFamily } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

const TEXT_COLOR_LIGHT = colors.gray[900];
const TEXT_COLOR_DARK = colors.white;

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      md: "800px",
      lg: "1024px",
    },
    extend: {
      colors: {
        action: {
          green: "#39C957",
          greenLight: "#63d47b",
        },
        blue: {
          50: "#F2F8FC",
          100: "#E6F2F9",
          200: "#BFDDEF",
          300: "#99C9E5",
          400: "#4DA1D2",
          500: "#0078BF",
          600: "#006CAC",
          700: "#004873",
          800: "#003656",
          900: "#002439",
        },
        blueText: {
          50: TEXT_COLOR_LIGHT,
          100: TEXT_COLOR_LIGHT,
          200: TEXT_COLOR_LIGHT,
          300: TEXT_COLOR_LIGHT,
          400: TEXT_COLOR_LIGHT,
          500: TEXT_COLOR_DARK,
          600: TEXT_COLOR_DARK,
          700: TEXT_COLOR_DARK,
          800: TEXT_COLOR_DARK,
          900: TEXT_COLOR_DARK,
        },
        green: {
          50: "#F5FBF6",
          100: "#EBF8ED",
          200: "#CCEDD3",
          300: "#ADE1B9",
          400: "#70CB84",
          500: "#32B54F",
          600: "#2DA347",
          700: "#1E6D2F",
          800: "#175124",
          900: "#0F3618",
        },
        greenText: {
          50: TEXT_COLOR_LIGHT,
          100: TEXT_COLOR_LIGHT,
          200: TEXT_COLOR_LIGHT,
          300: TEXT_COLOR_LIGHT,
          400: TEXT_COLOR_LIGHT,
          500: TEXT_COLOR_LIGHT,
          600: TEXT_COLOR_LIGHT,
          700: TEXT_COLOR_DARK,
          800: TEXT_COLOR_DARK,
          900: TEXT_COLOR_DARK,
        },
        yellow: {
          50: "#FFFCF4",
          100: "#FFF9E8",
          200: "#FFF0C6",
          300: "#FFE7A4",
          400: "#FFD55F",
          500: "#FFC31B",
          600: "#E6B018",
          700: "#997510",
          800: "#73580C",
          900: "#4D3B08",
        },
        yellowText: {
          50: TEXT_COLOR_LIGHT,
          100: TEXT_COLOR_LIGHT,
          200: TEXT_COLOR_LIGHT,
          300: TEXT_COLOR_LIGHT,
          400: TEXT_COLOR_LIGHT,
          500: TEXT_COLOR_LIGHT,
          600: TEXT_COLOR_LIGHT,
          700: TEXT_COLOR_DARK,
          800: TEXT_COLOR_DARK,
          900: TEXT_COLOR_DARK,
        },
        red: {
          50: "#FEF4F4",
          100: "#FDEAE9",
          200: "#FBCAC9",
          300: "#F8AAA8",
          400: "#F26A67",
          500: "#ED2A26",
          600: "#D52622",
          700: "#8E1917",
          800: "#6B1311",
          900: "#470D0B",
        },
        redText: {
          50: TEXT_COLOR_LIGHT,
          100: TEXT_COLOR_LIGHT,
          200: TEXT_COLOR_LIGHT,
          300: TEXT_COLOR_LIGHT,
          400: TEXT_COLOR_LIGHT,
          500: TEXT_COLOR_DARK,
          600: TEXT_COLOR_DARK,
          700: TEXT_COLOR_DARK,
          800: TEXT_COLOR_DARK,
          900: TEXT_COLOR_DARK,
        },
        cyan: {
          50: "#F2FCFC",
          100: "#E6F9F9",
          200: "#BFEFEF",
          300: "#99E5E5",
          400: "#4DD2D2",
          500: "#00BFBF",
          600: "#00ACAC",
          700: "#007373",
          800: "#005656",
          900: "#003939",
        },
        cyanText: {
          50: TEXT_COLOR_LIGHT,
          100: TEXT_COLOR_LIGHT,
          200: TEXT_COLOR_LIGHT,
          300: TEXT_COLOR_LIGHT,
          400: TEXT_COLOR_LIGHT,
          500: TEXT_COLOR_LIGHT,
          600: TEXT_COLOR_LIGHT,
          700: TEXT_COLOR_DARK,
          800: TEXT_COLOR_DARK,
          900: TEXT_COLOR_DARK,
        },
        gray: {
          50: "#F9F9F9",
          100: "#F3F3F3",
          200: "#E1E1E1",
          300: "#CFCFCF",
          400: "#ACACAC",
          500: "#888888",
          600: "#7A7A7A",
          700: "#525252",
          800: "#3D3D3D",
          900: "#292929",
        },
      },
      fontFamily: {
        sans: ['"Open Sans"'].concat(fontFamily.sans),
        serif: ['"Playfair Display"'].concat(fontFamily.serif),
      },
      fontSize: {
        "7xl": "5rem",
      },
      textColor: {
        "default-color": TEXT_COLOR_LIGHT,
      },
      inset: {
        "1/2": "50%",
        "1/1": "100%",
      },
      width: {
        "max-content": "max-content",
      },
      height: {
        "80": "20rem",
        "screen-1/2": "50vh",
        "screen-4/12": "33.333334vh",
        "screen-8/12": "66.666667vh",
      },
      backgroundOpacity: {
        "10": "0.1",
      },
      borderColor: (theme) => ({
        default: theme("colors.gray.100"),
      }),
      flex: {
        "2": "2 2 0%",
      },
    },
  },
  variants: {
    // Allow to move up elements when focused to make sure the focus ring is
    // entirely visible.
    zIndex: variants.zIndex.concat(["focus"]),
  },
  plugins: [],
};
