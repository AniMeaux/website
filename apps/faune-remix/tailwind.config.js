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

    spacing: {
      0: "0px",
      0.5: "5px",
      1: "10px",
      2: "20px",
      3: "30px",
      4: "40px",
    },

    borderRadius: {
      none: "0px",
      0.5: "5px",
      1: "10px",
      full: "9999px",
    },

    extend: {
      fontFamily: {
        serif: ['"Open Sans"', ...defaultTheme.fontFamily.serif],
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        white: "#ffffff",
        black: "#000000",
      },

      aspectRatio: {
        "4/3": "4 / 3",
      },

      animation: {
        "loader-pulse": `loader-pulse ${defaultTheme.transitionTimingFunction["in-out"]} 1s infinite`,
      },

      keyframes: {
        "loader-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(2)" },
        },
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

    plugin(({ addVariant }) => {
      // Override hover to make sure it's only applied on supported devices.
      // https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
      addVariant("hover", "@media(any-hover:hover){&:hover}");
      addVariant("group-hover", "@media(any-hover:hover){.group:hover &}");
    }),

    /*
     * In order to preserve a nice vertical rhythm, all text must have a
     * line-height multiple of 20px.
     */
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        ".text-body-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "14px",
          "line-height": "20px",
        },
        ".text-body-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "14px",
          "font-weight": theme("fontWeight.semibold"),
          "line-height": "20px",
        },
        ".text-caption-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "12px",
          "line-height": "20px",
        },
        ".text-caption-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "12px",
          "font-weight": theme("fontWeight.semibold"),
          "line-height": "20px",
        },
        ".text-title-hero-small": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "26px",
          "font-weight": theme("fontWeight.bold"),
          "line-height": "40px",
        },
        ".text-title-hero-large": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "32px",
          "font-weight": theme("fontWeight.bold"),
          "line-height": "40px",
        },
      });
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

    plugin(({ matchUtilities }) => {
      matchUtilities(
        {
          scrollbars: () => ({
            "&::-webkit-scrollbar": {
              width: 0,
              height: 0,
              display: "none",
            },
            "&::-webkit-scrollbar-track-piece": {
              "background-color": "transparent",
            },
          }),
        },
        { values: { none: "none" } }
      );
    }),

    /*
     * Tailwind allows to set `inset` with `ring-inset`, this allow us to unset
     * it.
     */
    plugin(({ addUtilities }) => {
      addUtilities({
        ".ring-outset": {
          "--tw-ring-inset": "",
        },
      });
    }),

    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => ({
            animationDelay: value,
          }),
        },
        { values: theme("transitionDelay") }
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
