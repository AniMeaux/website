const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        serif: ['"Open Sans"', ...defaultTheme.fontFamily.serif],
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        white: "#ffffff",
        black: "#000000",
        blue: { light: "#008bdb", base: "#0078bf" },
        green: { base: "#32b54f" },
        yellow: { base: "#ffc31b", darker: "#fab800" },
        red: { light: "#fef4f4", base: "#ed2a26" },
        cyan: { base: "#00bfbf" },
        pink: { base: "#ed266e" },
        facebook: "#3774dc",
        instagram: "#ad3d7a",
        linkedin: "#2c66bc",
        twitter: "#499be9",
      },
      boxShadow: {
        base: "0px 8px 20px rgba(0, 0, 0, 0.06)",
      },
      spacing: () => ({
        // We cannot use the `theme` parameter because referencing the `spacing`
        // values ends in a infinite recursion: `theme("spacing.4")`.

        // The values in the formula are defined by:
        // - A page takes 90% of the width, 5% spacing on each side.
        // - Left and right spacing cannot go under spacing 4 (16px).
        // - The page should not exceed LG (1024px).
        page: `max(${defaultTheme.spacing[4]}, 5%, (100% - ${defaultTheme.screens.lg}) / 2)`,

        // 72px
        18: "4.5rem",
        // 120px
        30: "7.5rem",
      }),
      aspectRatio: {
        "4/3": "4 / 3",
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

    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "p-safe": (value) => ({
            ...createSafePadding("top", value),
            ...createSafePadding("right", value),
            ...createSafePadding("bottom", value),
            ...createSafePadding("left", value),
          }),
          "px-safe": (value) => ({
            ...createSafePadding("right", value),
            ...createSafePadding("left", value),
          }),
          "py-safe": (value) => ({
            ...createSafePadding("top", value),
            ...createSafePadding("bottom", value),
          }),
          "pt-safe": (value) => createSafePadding("top", value),
          "pr-safe": (value) => createSafePadding("right", value),
          "pb-safe": (value) => createSafePadding("bottom", value),
          "pl-safe": (value) => createSafePadding("left", value),
        },
        { values: theme("spacing") }
      );
    }),
  ],
};

/**
 * @param {"top" | "right" | "bottom" | "left"} side
 * @param {string} value
 */
function createSafePadding(side, value) {
  const name = {
    top: "paddingTop",
    right: "paddingRight",
    bottom: "paddingBottom",
    left: "paddingLeft",
  }[side];

  const envVariable = {
    top: "safe-area-inset-top",
    right: "safe-area-inset-right",
    bottom: "safe-area-inset-bottom",
    left: "safe-area-inset-left",
  }[side];

  return {
    [name]: [
      // Fallback value for browsers that don't support `env`.
      `${value}`,
      `calc(${value} + env(${envVariable}, 0))`,
    ],
  };
}
