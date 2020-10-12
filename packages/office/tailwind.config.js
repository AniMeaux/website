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
      fontFamily: {
        sans: ["Roboto"].concat(fontFamily.sans),
        serif: ['"Open Sans"'].concat(fontFamily.serif),
      },
      textColor: {
        "default-color": TEXT_COLOR_LIGHT,
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
