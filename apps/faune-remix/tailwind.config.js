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
      5: "50px",
      6: "60px",
      7: "70px",
      8: "80px",
      9: "90px",
      10: "100px",
    },

    borderRadius: {
      none: "0px",
      0.5: "5px",
      1: "10px",
      full: "9999px",
    },

    boxShadow: {
      ambient: "0px 8px 20px rgba(0, 0, 0, 0.06)",
    },

    extend: {
      flex: {
        2: "2 2 0%",
      },

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

      ringWidth: {
        5: "5px",
      },
    },
  },

  plugins: [
    plugin(({ addVariant }) => {
      // Override focus-visible to make sure it supports the `.focus-visible`
      // class.
      // We also don't want touch screens devices to have visible focus.
      // They usally don't have input mechanism that can hover over elements so
      // we check that.
      // https://tailwindcss.com/docs/plugins#adding-variants
      addVariant(
        "focus-visible",
        "@media(any-hover:hover){&:is(:focus-visible, .focus-visible)}"
      );
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
        ".text-title-section-small": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "16px",
          "font-weight": theme("fontWeight.bold"),
          "line-height": "20px",
        },
        ".text-title-section-large": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "18px",
          "font-weight": theme("fontWeight.bold"),
          "line-height": "20px",
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
          scrollbars: (value) => {
            if (value === "none") {
              return {
                "&::-webkit-scrollbar": {
                  width: 0,
                  height: 0,
                  display: "none",
                },
                "&::-webkit-scrollbar-track-piece": {
                  "background-color": "transparent",
                },
              };
            }

            return {
              "&::-webkit-scrollbar": {
                width: "5px",
                height: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                "background-color": theme("colors.gray.200"),
              },
            };
          },
        },
        {
          values: {
            none: "none",
            custom: "custom",
          },
        }
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
