"use strict";

const { colors, fontFamily } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

const TEXT_COLOR_LIGHT = colors.gray[900];

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
      fontFamily: {
        sans: ["Roboto"].concat(fontFamily.sans),
        serif: ['"Open Sans"'].concat(fontFamily.serif),
      },
      fontSize: {
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
      },
      textColor: {
        "default-color": TEXT_COLOR_LIGHT,
      },
      borderColor: (theme) => ({
        default: "rgba(0, 0, 0, 0.07)",
      }),
    },
  },
  variants: {
    // Allow to move up elements when focused to make sure the focus ring is
    // entirely visible.
    zIndex: variants.zIndex.concat(["focus"]),
  },
  plugins: [],
};
