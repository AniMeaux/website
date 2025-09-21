import type { Config } from "tailwindcss";
import defaultColors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import type { CSSRuleObject } from "tailwindcss/types/config";

export const spacing = {
  "0": "0px",
  "0.25": "3px",
  "0.5": "6px",
  "1": "12px",
  "1.5": "18px",
  "2": "24px",
  "2.5": "30px",
  "3": "36px",
  "4": "48px",
  "5": "60px",
  "6": "72px",
  "8": "96px",
  "10": "120px",
  "12": "144px",
  "14": "168px",
};

export const screens = {
  xs: "475px",
  ...defaultTheme.screens,
};

// Don't spread `...defaultColors` to avoid deprecation warnings.
export const colors = {
  transparent: "transparent",

  prussianBlue: {
    "50": "#eefaff",
    "100": "#dcf6ff",
    "200": "#dcf6ff",
    "300": "#6de4ff",
    "400": "#20d7ff",
    "500": "#00c2ff",
    "600": "#009ddf",
    "700": "#007db4",
    "800": "#006995",
    "900": "#00567a",

    DEFAULT: "#003047",
    "950": "#003047",
  },

  mystic: {
    "50": "#fdf3f5",
    "100": "#fbe8ea",
    "200": "#f8d3db",
    "300": "#f1b0bd",
    "400": "#e98399",

    DEFAULT: "#db5072",
    "500": "#db5072",

    "600": "#c73761",
    "700": "#a82850",
    "800": "#8d2449",
    "900": "#792243",
    "950": "#430e21",
  },

  paleBlue: {
    "50": "#effafc",
    "100": "#d6f3f7",

    DEFAULT: "#bae8f0",
    "200": "#bae8f0",

    "300": "#7ed2e2",
    "400": "#42b6ce",
    "500": "#2699b4",
    "600": "#237c97",
    "700": "#22647c",
    "800": "#245366",
    "900": "#224757",
    "950": "#112d3b",
  },

  alabaster: {
    "50": "#faf7f6",

    DEFAULT: "#f2e8e3",
    "100": "#f2e8e3",

    "200": "#eee1da",
    "300": "#e2cbbf",
    "400": "#cfac9a",
    "500": "#bb8e78",
    "600": "#a5755d",
    "700": "#89604c",
    "800": "#735241",
    "900": "#61483b",
    "950": "#33241c",
  },

  black: defaultColors.black,
  white: defaultColors.white,
};

type FontFamily = {
  family: string;
  fallback: string;
  cssUrl: string;
  variants: {
    style: React.CSSProperties["fontStyle"];
    weight: React.CSSProperties["fontWeight"];
    url: string;
    format: "woff" | "woff2" | "truetype" | "opentype" | "embedded-opentype";
  }[];
};

export const fonts: { serif: FontFamily; sans: FontFamily } = {
  serif: {
    family: "CARAMEL MOCACINO",
    // Impact should be safe for email.
    // https://myemma.com/blog/email-safe-fonts-how-to-stay-compatible-and-on-brand/
    fallback: "Impact",
    cssUrl: "/fonts/caramel-mocacino/font.css",
    variants: [
      {
        style: "normal",
        weight: 400,
        url: "/fonts/caramel-mocacino/caramel-mocacino.otf",
        format: "opentype",
      },
    ],
  },
  sans: {
    family: "Fira Sans",
    fallback: "Arial",
    cssUrl: "/fonts/fira-sans/font.css",
    variants: [
      {
        style: "normal",
        weight: 400,
        url: "/fonts/fira-sans/fira-sans-regular.ttf",
        format: "truetype",
      },
      {
        style: "normal",
        weight: 500,
        url: "/fonts/fira-sans/fira-sans-medium.ttf",
        format: "truetype",
      },
      {
        style: "normal",
        weight: 600,
        url: "/fonts/fira-sans/fira-sans-semi-bold.ttf",
        format: "truetype",
      },
    ],
  },
};

const theme: Config = {
  content: ["./src/**/*.{ts,tsx}"],

  plugins: [
    pluginAnimation(),
    pluginChildren(),
    pluginCustomScrollbar(),
    pluginFocus(),
    pluginFocusVisibleWithin(),
    pluginGridDynamicColumns(),
    pluginIconSizes(),
    pluginMediaHover(),
    pluginSafePadding(),
    pluginStrokeDashoffset(),
    pluginTagSelectors(),
    pluginTextStyles(),
  ],

  theme: {
    borderRadius: {
      ...spacing,
      none: "0",
      full: "9999px",
    },

    colors,

    screens,

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

    transitionDuration: {
      fast: "50ms",
      normal: "100ms",
      slow: "150ms",
      "very-slow": "1s",
    },

    zIndex: {
      // Just to create a new stacking context.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/z-index
      "stacking-context": "0",

      "just-above": "1",
      header: "20",
      modal: "30",
    },

    extend: {
      animation: {
        "spinner-spin": "spin 1.5s linear infinite",
        "spinner-stroke": "spinner-stroke 2s ease-in-out infinite",

        "radix-collapsible-content-open":
          "radix-collapsible-content-open 150ms ease-in-out",
        "radix-collapsible-content-close":
          "radix-collapsible-content-close 150ms ease-in-out",
      },

      aspectRatio: {
        "4/3": "4 / 3",
        "3/4": "3 / 4",
        "16/10": "16 / 10",
      },

      boxShadow: {
        modal: "0px 15px 80px -10px rgba(0, 0, 0, 0.3)",
      },

      data: {
        visible: "visible=true",
        opened: "state=open",
        closed: "state=closed",
        top: "side=top",
        bottom: "side=bottom",
      },

      fontFamily: {
        serif: [fonts.serif.family, fonts.serif.fallback],
        sans: [fonts.sans.family, fonts.sans.fallback],
      },

      gridTemplateColumns: {
        "1-auto": "repeat(1, auto)",
        "2-auto": "repeat(2, auto)",
        "auto-fr": "auto minmax(0, 1fr)",
        "auto-fr-auto": "auto minmax(0, 1fr) auto",
        "fr-auto": "minmax(0, 1fr) auto",
        "fr-2-auto": "minmax(0, 1fr) auto auto",
        "fr-auto-fr": "minmax(0, 1fr) auto minmax(0, 1fr)",
      },

      keyframes: {
        "spinner-stroke": {
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

        "radix-collapsible-content-open": {
          "0%": { height: "0px" },
          "100%": { height: "var(--radix-collapsible-content-height)" },
        },

        "radix-collapsible-content-close": {
          "0%": { height: "var(--radix-collapsible-content-height)" },
          "100%": { height: "0px" },
        },
      },

      opacity: {
        disabled: "0.5",
      },
    },
  },
};

export default theme;

/**
 * Animation plugin inspired from tailwindcss-animate but:
 * - Without overriding transition utilities.
 * - With custom properties as fallbacks to avoid enter or exit style
 *   missmatch.
 * - With symetrical enter and exit animations.
 * - With _current_ styles for the ones that should only be set during the
 *   animation (`animation-fill-mode: none;`)
 *
 * @see https://github.com/jamiebuilds/tailwindcss-animate
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode#none
 * @example
 * // Opacity
 * "data-opened:animation-enter data-closed:animation-exit animation-opacity-0"
 *
 * // Height
 * "data-opened:animation-enter data-closed:animation-exit animation-h-0 animation-current-h-[var(--radix-accordion-content-height)] animation-current-overflow-hidden"
 */
function pluginAnimation() {
  return plugin(
    ({ matchUtilities, addUtilities, theme }) => {
      matchUtilities(
        {
          "animation-h": (value) => ({
            "--tw-animation-h": value,
          }),

          "animation-current-h": (value) => ({
            "--tw-animation-current-h": value,
          }),
        },
        { values: theme("height") },
      );

      matchUtilities(
        {
          "animation-opacity": (value) => ({
            "--tw-animation-opacity": value,
          }),

          "animation-current-opacity": (value) => ({
            "--tw-animation-current-opacity": value,
          }),
        },
        { values: theme("opacity") },
      );

      matchUtilities(
        {
          "animation-duration": (value) => ({
            "--tw-animation-duration": value,
          }),
        },
        { values: theme("transitionDuration") },
      );

      matchUtilities(
        {
          "animation-translate-x": (value) => ({
            "--tw-animation-translate-x": value,
          }),

          "animation-translate-y": (value) => ({
            "--tw-animation-translate-y": value,
          }),
        },
        {
          values: theme("translate"),
          supportsNegativeValues: true,
        },
      );

      matchUtilities(
        {
          "animation-overflow": (value) => ({
            "--tw-animation-overflow": value,
          }),

          "animation-current-overflow": (value) => ({
            "--tw-animation-current-overflow": value,
          }),
        },
        {
          values: {
            auto: "auto",
            clip: "clip",
            hidden: "hidden",
            scroll: "scroll",
            visible: "visible",
          },
        },
      );

      // Somehow required for our custom keyframes to be found.
      addUtilities({
        "@keyframes enter": theme("keyframes.enter"),
        "@keyframes exit": theme("keyframes.exit"),
      });

      addUtilities({
        ".animation-enter": {
          animationDuration: `var(--tw-animation-duration, ${theme(
            "transitionDuration.normal",
          )})`,
          animationName: "enter",
          animationTimingFunction: theme("transitionTimingFunction.out"),
        },

        ".animation-exit": {
          animationDuration: `var(--tw-animation-duration, ${theme(
            "transitionDuration.normal",
          )})`,
          animationName: "exit",
          animationTimingFunction: theme("transitionTimingFunction.in"),
        },
      });
    },
    {
      // Keep this here for a better code collocation.
      theme: {
        extend: {
          keyframes: () => {
            // If an `--tw-animation-*` is not defined, fallback to the current
            // value to make sure the animation is a NOP.
            const animationCss = {
              overflow:
                "var(--tw-animation-overflow, var(--tw-animation-current-overflow, initial))",
              height:
                "var(--tw-animation-h, var(--tw-animation-current-h, initial))",
              opacity:
                "var(--tw-animation-opacity, var(--tw-animation-current-opacity, initial))",

              // Keep other transformations so we don't break the styles.
              transform: [
                "translate(var(--tw-animation-translate-x, var(--tw-translate-x)), var(--tw-animation-translate-y, var(--tw-translate-y)))",
                "rotate(var(--tw-rotate))",
                "skewX(var(--tw-skew-x))",
                "skewY(var(--tw-skew-y))",
                "scaleX(var(--tw-scale-x))",
                "scaleY(var(--tw-scale-y))",
              ].join(" "),
            } satisfies CSSRuleObject;

            // Current styles that should only be set during the animation
            // (because the animation-fill-mode is `none` by default).
            // If the target element set them permanently, it would either
            // break the animation or the element styles.
            const currentCss = {
              overflow: "var(--tw-animation-current-overflow, initial)",
              height: "var(--tw-animation-current-h, initial)",
              opacity: "var(--tw-animation-current-opacity, initial)",

              transform: [
                "translate(var(--tw-translate-x), var(--tw-translate-y))",
                "rotate(var(--tw-rotate))",
                "skewX(var(--tw-skew-x))",
                "skewY(var(--tw-skew-y))",
                "scaleX(var(--tw-scale-x))",
                "scaleY(var(--tw-scale-y))",
              ].join(" "),
            } satisfies CSSRuleObject;

            return {
              enter: { from: animationCss, to: currentCss },
              exit: { from: currentCss, to: animationCss },
            };
          },
        },
      },
    },
  );
}

function pluginChildren() {
  return plugin(({ addVariant }) => {
    addVariant("children", "& > *");
  });
}

/**
 * Custom scrollbars.
 *
 * @example
 * scrollbars-none
 * scrollbars-custom
 */
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
              width: "3px",
              height: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              "background-color": theme("colors.alabaster.300"),
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
  return plugin(({ addUtilities, theme }) => {
    addUtilities({
      ".focus-compact": {
        "outline-color": theme("colors.mystic.DEFAULT"),
        "outline-offset": "0px",
        "outline-style": "solid",
        "outline-width": "3px",
      },

      ".focus-spaced": {
        "outline-color": theme("colors.mystic.DEFAULT"),
        "outline-offset": "2px",
        "outline-style": "solid",
        "outline-width": "3px",
      },
    });
  });
}

/**
 * Alias of `has-[:focus-visible]`.
 *
 * @see https://stackoverflow.com/a/76115257
 */
function pluginFocusVisibleWithin() {
  return plugin(({ addVariant }) => {
    addVariant("focus-visible-within", "&:has(:focus-visible)");
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
 * Alias of `text-[<size>]` for usage in icon component because it feels
 * more natural to use `icon-<size>` than `text-[<size>]`.
 */
function pluginIconSizes() {
  return plugin(({ matchUtilities }) => {
    matchUtilities(
      { icon: (value) => ({ "font-size": value }) },
      {
        values: {
          "12": "12px",
          "16": "16px",
          "24": "24px",
          "48": "48px",
          "64": "64px",
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

function pluginStrokeDashoffset() {
  return plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      { "stroke-dashoffset": (value) => ({ "stroke-dashoffset": value }) },
      { values: theme("spacing") },
    );
  });
}

function pluginTagSelectors() {
  return plugin(({ addVariant }) => {
    addVariant("is-link", "&:is(a)");
  });
}

/**
 * In order to preserve a nice vertical rhythm, all text must have a size
 * multiple of 24px.
 */
function pluginTextStyles() {
  return plugin(({ addUtilities, theme }) => {
    addUtilities({
      ".text-caption-uppercase-default": {
        "font-family": theme("fontFamily.sans"),
        "font-weight": theme("fontWeight.normal"),
        "font-size": "14px",
        "line-height": "24px",
        "text-transform": "uppercase",
      },
      ".text-caption-lowercase-default": {
        "font-family": theme("fontFamily.sans"),
        "font-weight": theme("fontWeight.normal"),
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
        "font-weight": theme("fontWeight.normal"),
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
        "font-weight": theme("fontWeight.normal"),
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
        "font-weight": theme("fontWeight.normal"),
        "font-size": "26px",
        "line-height": "24px",
        "text-transform": "uppercase",
      },
      ".text-title-small": {
        "font-family": theme("fontFamily.serif"),
        "font-weight": theme("fontWeight.normal"),
        "font-size": "52px",
        "line-height": "48px",
        "text-transform": "uppercase",
      },
      ".text-title-large": {
        "font-family": theme("fontFamily.serif"),
        "font-weight": theme("fontWeight.normal"),
        "font-size": "52px",
        "line-height": "48px",
        "text-transform": "uppercase",
      },
      ".text-hero-small": {
        "font-family": theme("fontFamily.serif"),
        "font-weight": theme("fontWeight.normal"),
        "font-size": "79px",
        "line-height": "72px",
        "text-transform": "uppercase",
      },
      ".text-hero-large": {
        "font-family": theme("fontFamily.serif"),
        "font-weight": theme("fontWeight.normal"),
        "font-size": "79px",
        "line-height": "72px",
        "text-transform": "uppercase",
      },
    });
  });
}
