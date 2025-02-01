import { tailwindAnimation } from "@animeaux/tailwind-animation";
import containerQueries from "@tailwindcss/container-queries";
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

const theme: Config = {
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
      animation: {
        "spin-spinner": "spin 1.5s linear infinite",
        "stroke-spinner": "stroke 2s ease-in-out infinite",
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "3/4": "3 / 4",
        "A4-landscape": "29.7 / 21",
      },

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

      gridTemplateColumns: {
        "2-auto": "repeat(2, auto)",
        "fr-auto": "minmax(0, 1fr) auto",
        "auto-fr": "auto minmax(0, 1fr)",
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

      ringWidth: {
        5: "5px",
      },
    },
  },

  plugins: [
    tailwindAnimation,
    containerQueries,
    pluginCustomScrollbar(),
    pluginFocus(),
    pluginFocusVisible(),
    pluginGridDynamicColumns(),
    pluginHover(),
    pluginIconSizes(),
    pluginMediaHover(),
    pluginRingOutset(),
    pluginSafePadding(),
    pluginSafePosition(),
    pluginTextStyles(),
  ],
};

export default theme;

function pluginCustomScrollbar() {
  return plugin(({ matchUtilities, theme }) => {
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
  });
}

function pluginFocus() {
  return plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "focus-compact": (value) => ({
          "outline-color": value,
          "outline-offset": "0px",
          "outline-style": "solid",
          "outline-width": "3px",
        }),

        "focus-spaced": (value) => ({
          "outline-color": value,
          "outline-offset": "2px",
          "outline-style": "solid",
          "outline-width": "3px",
        }),
      },
      { values: flattenColorPalette(theme("colors")) },
    );
  });
}

/**
 * Override focus-visible because we don't want touch screens devices to have
 * visible focus.
 * They usally don't have input mechanism that can hover over elements so we
 * check that.
 *
 * @see https://tailwindcss.com/docs/plugins#adding-variants
 */
function pluginFocusVisible() {
  return plugin(({ addVariant }) => {
    addVariant("focus-visible", "@media(any-hover:hover){&:focus-visible}");
  });
}

function pluginGridDynamicColumns() {
  return plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "grid-auto-fill-cols": (value) => ({
          "grid-template-columns": `repeat(auto-fill, minmax(${value}, 1fr))`,
        }),
      },
      {
        values: theme("minWidth"),
        type: ["length"],
      },
    );
  });
}

/**
 * Override hover to make sure it's only applied on supported devices.
 *
 * @see https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
 */
function pluginHover() {
  return plugin(({ addVariant }) => {
    addVariant("hover", "@media(any-hover:hover){&:hover}");
  });
}

/**
 * Alias of `text-[<size>]` for usage in icon component because it feels
 * more natural to use `icon-<size>` than `text-[<size>]`.
 */
function pluginIconSizes() {
  return plugin(({ matchUtilities }) => {
    matchUtilities(
      { icon: (value) => ({ "font-size": value }) },
      {
        values: {
          "10": "10px",
          "20": "20px",
          "80": "80px",
          "120": "120px",
        },
      },
    );
  });
}

/**
 * Alias of `[@media(any-hover:hover)]:`.
 */
function pluginMediaHover() {
  return plugin(({ addVariant }) => {
    addVariant("can-hover", "@media(any-hover:hover){&}");
  });
}

function pluginSafePadding() {
  return plugin(({ matchUtilities, theme }) => {
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
  });
}

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

function pluginSafePosition() {
  return plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        "top-safe": (value) => createSafePosition("top", value),
        "right-safe": (value) => createSafePosition("right", value),
        "bottom-safe": (value) => createSafePosition("bottom", value),
        "left-safe": (value) => createSafePosition("left", value),
      },
      { values: theme("spacing") },
    );
  });
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

/**
 * Tailwind allows to set `inset` with `ring-inset`, this allow us to unset it.
 */
function pluginRingOutset() {
  return plugin(({ addUtilities }) => {
    addUtilities({
      ".ring-outset": {
        "--tw-ring-inset": "",
      },
    });
  });
}

/**
 * In order to preserve a nice vertical rhythm, all text must have a line-height
 * multiple of 20px.
 */
function pluginTextStyles() {
  return plugin(({ addUtilities, theme }) => {
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
  });
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
