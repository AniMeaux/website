"use strict";

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./pages/**/*.{ts,tsx}"],
  theme: {
    screens: {
      lg: "800px",
    },
    extend: {
      fontFamily: {
        sans: ['"Open Sans"'].concat(fontFamily.sans),
        serif: ['"Playfair Display"'].concat(fontFamily.serif),
      },
      fontSize: {
        hero: "5rem",
      },
    },
  },
  variants: {
    // Allow to move up elements when focused to make sure the focus ring is
    // entirely visible.
    zIndex: ["responsive", "focus"],
  },
  plugins: [],
};
