"use strict";

const { colors, fontFamily } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

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
      fontFamily: {
        sans: ['"Open Sans"'].concat(fontFamily.sans),
        serif: ['"Playfair Display"'].concat(fontFamily.serif),
      },
      fontSize: {
        "7xl": "5rem",
      },
      textColor: {
        default: colors.gray[900],
      },
      inset: {
        "1/2": "50%",
        "1/1": "100%",
      },
      width: {
        "max-content": "max-content",
      },
      height: {
        "screen-1/2": "50vh",
        "screen-8/12": "66.666667vh",
      },
      backgroundOpacity: {
        "10": "0.1",
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
