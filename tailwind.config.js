"use strict";

const { fontFamily } = require("tailwindcss/defaultTheme");
const { variants } = require("tailwindcss/defaultConfig");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.{ts,tsx}"],
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
      inset: {
        "1/1": "100%",
      },
      width: {
        "max-content": "max-content",
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
