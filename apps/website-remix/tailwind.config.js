const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Open Sans"', ...defaultTheme.fontFamily.serif],
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      // Override focus-visible to make sure it supports the `.focus-visible`
      // class.
      // https://tailwindcss.com/docs/plugins#adding-variants
      addVariant("focus-visible", "&:is(:focus-visible, .focus-visible)");
    }),
  ],
};
