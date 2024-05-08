import { tailwindAnimation } from "@animeaux/tailwind-animation";
import type { Config } from "tailwindcss";
import defaultColors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import type { CSSRuleObject } from "tailwindcss/types/config";

export const spacing = {
  0: "0px",
  0.25: "2.5px",
  0.5: "5px",
  1: "10px",
  1.5: "15px",
  2: "20px",
  3: "30px",
  4: "40px",
  4.5: "45px",
  5: "50px",
  6: "60px",
  6.5: "65px",
  7: "70px",
  8: "80px",
  9: "90px",
  10: "100px",
  13: "130px",
};

export const screens = {
  xs: "475px",
  ...defaultTheme.screens,
};

// Don't spread `...defaultColors` to avoid deprecation warnings.
export const colors = {
  black: defaultColors.black,
  blue: defaultColors.blue,
  gray: defaultColors.gray,
  green: defaultColors.green,
  inherit: defaultColors.inherit,
  inheritBg: "var(--background-color)",
  orange: defaultColors.orange,
  pink: defaultColors.pink,
  red: defaultColors.red,
  transparent: defaultColors.transparent,
  white: defaultColors.white,
  yellow: defaultColors.yellow,
};

export default {
  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    colors,
    screens,
    spacing,

    borderRadius: {
      none: "0px",
      0.5: "5px",
      1: "10px",
      1.5: "15px",
      2: "20px",
      full: "9999px",
    },

    extend: {
      boxShadow: {
        "popover-md": "0px 15px 80px -10px rgba(0, 0, 0, 0.3)",
        "popover-sm": "0px 10px 40px -10px rgba(0, 0, 0, 0.2)",
      },

      flex: {
        2: "2 2 0%",
      },

      fontFamily: {
        serif: ['"Open Sans"', ...defaultTheme.fontFamily.serif],
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "A4-landscape": "29.7 / 21",
      },

      ringWidth: {
        5: "5px",
      },

      animation: {
        "spin-spinner": "spin 1.5s linear infinite",
        "stroke-spinner": "stroke 2s ease-in-out infinite",
      },

      keyframes: {
        stroke: {
          "0%": {
            "stroke-dasharray": "1, 300",
            "stroke-dashoffset": "0",
          },
          "50%": {
            "stroke-dasharray": "150, 300",
            // Yep, that's right!
            // Computed by: circle.getTotalLength().
            "stroke-dashoffset": "-175.6449737548828 / 4",
          },
          "100%": {
            "stroke-dasharray": "150, 300",
            "stroke-dashoffset": "-175.6449737548828",
          },
        },
      },
    },
  },

  plugins: [
    tailwindAnimation,

    plugin(({ addVariant }) => {
      // Override focus-visible to make sure it supports the `.focus-visible`
      // class.
      // We also don't want touch screens devices to have visible focus.
      // They usally don't have input mechanism that can hover over elements so
      // we check that.
      // https://tailwindcss.com/docs/plugins#adding-variants
      addVariant(
        "focus-visible",
        "@media(any-hover:hover){&:is(:focus-visible, .focus-visible)}",
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
        ".text-code-default": {
          "font-family": theme("fontFamily.mono"),
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
          "bg-var": (value) => ({
            "--background-color": value,
          }),
        },
        { values: flattenColorPalette(theme("colors")) },
      );
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
        { values: theme("spacing") },
      );
    }),

    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "top-safe": (value) => createSafePosition("top", value),
          "right-safe": (value) => createSafePosition("right", value),
          "bottom-safe": (value) => createSafePosition("bottom", value),
          "left-safe": (value) => createSafePosition("left", value),
        },
        { values: theme("spacing") },
      );
    }),

    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          scrollbars: (value): CSSRuleObject => {
            if (value === "none") {
              return {
                "&::-webkit-scrollbar": {
                  width: "0",
                  height: "0",
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
        },
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
} satisfies Config;

function createSafePadding(
  side: "top" | "right" | "bottom" | "left",
  value: string,
) {
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

function createSafePosition(
  side: "top" | "right" | "bottom" | "left",
  value: string,
) {
  const envVariable = {
    top: "safe-area-inset-top",
    right: "safe-area-inset-right",
    bottom: "safe-area-inset-bottom",
    left: "safe-area-inset-left",
  }[side];

  return {
    [side]: [
      // Fallback value for browsers that don't support `env`.
      `${value}`,
      `calc(${value} + env(${envVariable}, 0))`,
    ],
  };
}

type Colors = { [key: string]: string | Colors };

/**
 * Copied from Tailwind's flattenColorPalette because types are not exported.
 *
 * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.3.3/src/util/flattenColorPalette.js
 */
function flattenColorPalette(colors: Colors = {}): Record<string, string> {
  return Object.assign(
    {},
    ...Object.entries(colors).flatMap(([key, value]) => {
      if (typeof value === "object") {
        return Object.entries(flattenColorPalette(value)).map(
          ([childKey, value]) => ({
            [key + (childKey === "DEFAULT" ? "" : `-${childKey}`)]: value,
          }),
        );
      }

      return [{ [`${key}`]: value }];
    }),
  );
}
