"use strict";

const { fontFamily } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

const base12 = {
  "1/12": "8.333333%",
  "2/12": "16.666667%",
  "3/12": "25%",
  "4/12": "33.333333%",
  "5/12": "41.666667%",
  "6/12": "50%",
  "7/12": "58.333333%",
  "8/12": "66.666667%",
  "9/12": "75%",
  "10/12": "83.333333%",
  "11/12": "91.666667%",
  "12/12": "100%",
};

const opacities = {
  0: "0",
  3: "0.03",
  4: "0.04",
  5: "0.05",
  10: "0.1",
  20: "0.2",
  30: "0.3",
  40: "0.4",
  50: "0.5",
  60: "0.6",
  70: "0.7",
  80: "0.8",
  90: "0.9",
  100: "1",
};

module.exports = {
  // Paths relative to the application importing it.
  purge: [
    "./src/**/*.{ts,tsx}",
    "../ui-library/**/*.{ts,tsx}",
    "../app-core/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      md: "800px",
      lg: "1024px",
    },
    extend: {
      colors: {
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
      },
      spacing: {
        ...base12,
      },
      fontFamily: {
        sans: ["Roboto"].concat(fontFamily.sans),
        serif: ['"Open Sans"'].concat(fontFamily.serif),
      },
      fontSize: {
        "2xs": "0.625rem",
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
      },
      textColor: (theme) => ({
        "default-color": theme("colors.gray.800"),
      }),
      placeholderColor: (theme) => ({
        "default-color": theme("textColor.default-color"),
      }),
      textOpacity: {
        ...opacities,
      },
      opacity: {
        ...opacities,
      },
      padding: {
        "screen-3/10": "30vh",
      },
      inset: {
        1: "0.25rem",
        4: "1rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        "1/2": "50%",
        "1/1": "100%",
      },
      minWidth: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        button: "10rem",
        "fit-content": "fit-content",
      },
      maxWidth: {
        ...base12,
      },
      maxHeight: {
        ...base12,
      },
      width: {
        18: "4.5rem",
      },
      height: {
        ...base12,
        14: "3.5rem",
        "screen-5/12": "41.666667vh",
      },
      borderColor: {
        DEFAULT: "rgba(0, 0, 0, 0.07)",
      },
      zIndex: {
        "-1": "-1",
      },
    },
  },
  variants: {
    // Allow to move up elements when focused to make sure the focus ring is
    // entirely visible.
    zIndex: variants.zIndex.concat(["focus"]),
    opacity: variants.opacity.concat(["disabled"]),
    cursor: variants.cursor.concat(["disabled"]),
  },
  plugins: [],
};
