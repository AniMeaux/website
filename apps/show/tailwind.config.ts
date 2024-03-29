import defaultColors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export const spacing = {
  0: "0px",
  0.5: "6px",
  1: "12px",
  1.5: "18px",
  2: "24px",
  2.5: "30px",
  3: "36px",
  4: "48px",
  5: "60px",
  6: "72px",
  8: "96px",
  10: "120px",
  14: "168px",
};

export const screens = {
  xs: "475px",
  ...defaultTheme.screens,
};

// Don't spread `...defaultColors` to avoid deprecation warnings.
export const colors = {
  transparent: "transparent",
  inheritBg: "var(--background-color)",
  prussianBlue: {
    DEFAULT: "#003047",
  },
  mystic: {
    DEFAULT: "#db5072",
  },
  paleBlue: {
    DEFAULT: "#bae8f0",
  },
  alabaster: {
    DEFAULT: "#f2e8e3",
  },

  black: defaultColors.black,
  white: defaultColors.white,
};

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./src/**/*.{ts,tsx}"],

  theme: {
    screens,
    colors,

    spacing: {
      ...spacing,

      // The values in the formula are defined by:
      // - A page takes 90% of the width, 5% spacing on each side.
      // - Left and right spacing cannot go under 16px.
      // - The page should not exceed LG or SM (1024px or 640px).
      // Wrap the value in a `calc` so tailwind can negate it.
      "page-normal": `calc(max(16px, 5vw, (100vw - ${defaultTheme.screens.lg}) / 2))`,
      "page-narrow": `calc(max(16px, 5vw, (100vw - ${defaultTheme.screens.sm}) / 2))`,
    },

    borderRadius: {
      ...spacing,
      none: "0",
      full: "9999px",
    },

    extend: {
      fontFamily: {
        serif: ['"CARAMEL MOCACINO"', ...defaultTheme.fontFamily.serif],
        sans: ["Fira Sans", ...defaultTheme.fontFamily.sans],
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "16/10": "16 / 10",
      },

      animation: {
        "radix-collapsible-content-open":
          "radix-collapsible-content-open 150ms ease-in-out",
        "radix-collapsible-content-close":
          "radix-collapsible-content-close 150ms ease-in-out",
      },

      keyframes: {
        "radix-collapsible-content-open": {
          "0%": { height: "0px" },
          "100%": { height: "var(--radix-collapsible-content-height)" },
        },
        "radix-collapsible-content-close": {
          "0%": { height: "var(--radix-collapsible-content-height)" },
          "100%": { height: "0px" },
        },
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
        "@media(any-hover:hover){&:is(:focus-visible, .focus-visible)}",
      );
    }),

    plugin(({ addVariant, matchVariant }) => {
      // Override hover to make sure it's only applied on supported devices.
      // https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants
      addVariant("hover", "@media(any-hover:hover){&:hover}");
      // https://github.com/tailwindlabs/tailwindcss/discussions/9788#discussioncomment-4098439
      matchVariant(
        "group",
        (_, { modifier }) => {
          const suffix = modifier == null ? "" : `\\/${modifier}`;
          return `@media(any-hover:hover){:merge(.group${suffix}):hover &}`;
        },
        { values: { hover: "hover" } },
      );
    }),

    /*
     * In order to preserve a nice vertical rhythm, all text must have a size
     * multiple of 24px.
     */
    plugin(({ addUtilities, theme }) => {
      addUtilities({
        ".text-caption-uppercase-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "14px",
          "line-height": "24px",
          "text-transform": "uppercase",
        },
        ".text-caption-lowercase-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "14px",
          "line-height": "24px",
        },
        ".text-caption-lowercase-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-weight": theme("fontWeight.medium"),
          "font-size": "14px",
          "line-height": "24px",
        },
        ".text-body-uppercase-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "16px",
          "line-height": "24px",
          "text-transform": "uppercase",
        },
        ".text-body-uppercase-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-weight": theme("fontWeight.semibold"),
          "font-size": "16px",
          "line-height": "24px",
          "text-transform": "uppercase",
        },
        ".text-body-lowercase-default": {
          "font-family": theme("fontFamily.sans"),
          "font-size": "16px",
          "line-height": "24px",
        },
        ".text-body-lowercase-emphasis": {
          "font-family": theme("fontFamily.sans"),
          "font-weight": theme("fontWeight.medium"),
          "font-size": "16px",
          "line-height": "24px",
        },
        ".text-title-item": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "24px",
          "line-height": "24px",
          "text-transform": "uppercase",
        },
        ".text-title-small": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "48px",
          "line-height": "48px",
          "text-transform": "uppercase",
        },
        ".text-title-large": {
          "font-family": theme("fontFamily.serif"),
          "font-size": "48px",
          "line-height": "48px",
          "text-transform": "uppercase",
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
        { "stroke-dashoffset": (value) => ({ "stroke-dashoffset": value }) },
        { values: theme("spacing") },
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
  ],
};

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
