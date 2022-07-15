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
      colors: {
        white: "#ffffff",
        black: "#000000",
        blue: { base: "#0078bf" },
        green: { base: "#32b54f" },
        yellow: { base: "#ffc31b", darker: "#fab800" },
        red: { base: "#ed2a26" },
        cyan: { base: "#00bfbf" },
        pink: { base: "#ed266e" },
      },
      dropShadow: {
        base: "0px 8px 20px rgba(0, 0, 0, 0.06)",
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
