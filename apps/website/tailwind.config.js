const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

// Color gradiants generated from Material Design.
// https://material.io/design/color/the-color-system.html#tools-for-picking-colors

const brandBlue = {
  50: "#e1f5fe",
  100: "#b3e6fc",
  200: "#81d5fb",
  300: "#4fc5f8",
  400: "#29b8f8",
  500: "#01abf6",
  600: "#019de7",
  700: "#008ad3",
  // Closest to primary #0078bf.
  800: "#0079bf",
  900: "#00599d",
};

const brandGreen = {
  50: "#e7f6e9",
  100: "#c5e8c9",
  200: "#9fdaa7",
  300: "#76cc84",
  400: "#56c069",
  // Closest to primary #32b54f.
  500: "#32b54e",
  600: "#28a645",
  700: "#1b933a",
  800: "#0c822f",
  900: "#00631a",
};

const brandYellow = {
  50: "#fff8e2",
  100: "#ffecb5",
  200: "#ffe185",
  300: "#ffd654",
  400: "#ffcb31",
  // Closest to primary #ffc31b.
  500: "#ffc21b",
  600: "#ffb415",
  700: "#fea213",
  800: "#fe9112",
  900: "#fd720f",
};

const brandRed = {
  50: "#ffeaed",
  100: "#ffcbcf",
  200: "#f59794",
  300: "#ed6d6b",
  400: "#f74a44",
  500: "#fb3625",
  // Closest to primary #ed2a26.
  600: "#ed2926",
  700: "#db1c20",
  800: "#ce1019",
  900: "#c00008",
};

const brandCyan = {
  50: "#def4f5",
  100: "#abe3e4",
  200: "#6fd2d2",
  // Closest to primary #00bfbf.
  300: "#00bfbf",
  400: "#00b0af",
  500: "#00a19d",
  600: "#00948f",
  700: "#00837d",
  800: "#00736d",
  900: "#00574e",
};

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
        brandBlue: {
          lightest: brandBlue[50],
          lighter: brandBlue[700],
          DEFAULT: brandBlue[800],
        },
        brandGreen: {
          lightest: brandGreen[50],
          DEFAULT: brandGreen[500],
        },
        brandYellow: {
          lightest: brandYellow[50],
          DEFAULT: brandYellow[500],
          darker: brandYellow[700],
        },
        brandRed: {
          lightest: brandRed[50],
          DEFAULT: brandRed[600],
        },
        brandCyan: {
          lightest: brandCyan[50],
          DEFAULT: brandCyan[300],
        },
        showBrandBlue: {
          lightest: "#c5e9ee",
          darker: "#39605a",
          darkest: "#203532",
        },
        facebook: "#3774dc",
        instagram: "#ad3d7a",
        linkedin: "#2c66bc",
        twitter: "#499be9",
      },

      boxShadow: {
        base: "0px 8px 20px rgba(0, 0, 0, 0.06)",
      },

      spacing: {
        // We cannot use the `theme` parameter because referencing the `spacing`
        // values ends in a infinite recursion: `theme("spacing.4")`.

        // The values in the formula are defined by:
        // - A page takes 90% of the width, 5% spacing on each side.
        // - Left and right spacing cannot go under spacing 4 (16px).
        // - The page should not exceed LG or MD (1024px or 768px).
        // Wrap the value in a `calc` so tailwind can negate it.
        page: `calc(max(${defaultTheme.spacing[4]}, 5vw, (100% - ${defaultTheme.screens.lg}) / 2))`,
        article: `calc(max(${defaultTheme.spacing[4]}, 5vw, (100% - ${defaultTheme.screens.md}) / 2))`,

        // 72px
        18: "4.5rem",
        // 120px
        30: "7.5rem",
      },

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

    plugin(({ addVariant }) => {
      // Override hover to make sure it's only applied on supported devices.
      // https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
      addVariant("hover", "@media(any-hover:hover){&:hover}");
      addVariant("group-hover", "@media(any-hover:hover){.group:hover &}");
    }),

    /*
     * In order to preserve a nice vertical rhythm, all text must have a size
     * multiple of 24px:
     *
     *   font-size * line-height = X * 24px
     */
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        ".text-body-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "16px",
          "line-height": 1.5,
        },
        ".text-body-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-weight": theme("fontWeight.medium"),
          "font-size": "16px",
          "line-height": 1.5,
        },
        ".text-caption-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "14px",
          "line-height": 1.7143,
        },
        ".text-code-default": {
          "font-family": theme("fontFamily.mono"),
          "font-size": "14px",
          "font-weight": theme("fontWeight.semibold"),
          "line-height": 1.7143,
        },
        ".text-title-item": {
          "font-family": theme("fontFamily.serif"),
          "font-weight": theme("fontWeight.bold"),
          "font-size": "16px",
          "line-height": 1.5,
        },
        ".text-title-hero-large": {
          "font-family": theme("fontFamily.serif"),
          "font-weight": theme("fontWeight.semibold"),
          "font-size": "60px",
          "line-height": 1.2,
        },
        ".text-title-hero-small": {
          "font-family": theme("fontFamily.serif"),
          "font-weight": theme("fontWeight.semibold"),
          "font-size": "40px",
          "line-height": 1.2,
        },
        ".text-title-section-large": {
          "font-family": theme("fontFamily.serif"),
          "font-weight": theme("fontWeight.semibold"),
          "font-size": "40px",
          "line-height": 1.2,
        },
        ".text-title-section-small": {
          "font-family": theme("fontFamily.serif"),
          "font-weight": theme("fontWeight.bold"),
          "font-size": "20px",
          "line-height": 1.2,
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

    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "rounded-bubble": (value) => ({
            borderTopLeftRadius: value[0],
            borderTopRightRadius: value[1],
            borderBottomRightRadius: value[0],
            borderBottomLeftRadius: value[1],
          }),
          "rounded-bubble-b": (value) => ({
            borderBottomRightRadius: value[0],
            borderBottomLeftRadius: value[1],
          }),
        },
        {
          values: {
            sm: [theme("spacing.3"), theme("spacing[1.5]")],
            md: [theme("spacing.6"), theme("spacing.3")],
            lg: [theme("spacing.12"), theme("spacing.6")],
            xl: [theme("spacing.24"), theme("spacing.12")],
          },
        }
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
