import plugin from "tailwindcss/plugin";

export default plugin(
  ({ matchUtilities, addUtilities, theme }) => {
    // So we can get the opacity using a custom property.
    matchUtilities(
      { opacity: (value) => ({ "--tw-opacity": value }) },
      { values: theme("opacity") },
    );

    matchUtilities(
      { "animation-opacity": (value) => ({ "--tw-animation-opacity": value }) },
      { values: theme("opacity") },
    );

    matchUtilities(
      { "animation-duration": (value) => ({ animationDuration: value }) },
      { values: theme("transitionDuration") },
    );

    matchUtilities(
      {
        "animation-translate-y": (value) => ({
          "--tw-animation-translate-y": value,
        }),
      },
      {
        values: theme("translate"),
        supportsNegativeValues: true,
      },
    );

    // Somehow required for our custom keyframes to be found.
    addUtilities({
      "@keyframes enter": theme("keyframes.enter"),
      "@keyframes exit": theme("keyframes.exit"),
    });

    addUtilities({
      ".animation-enter": {
        animationName: "enter",
        animationTimingFunction: theme("transitionTimingFunction.out"),
      },
      ".animation-exit": {
        animationName: "exit",
        animationTimingFunction: theme("transitionTimingFunction.in"),
      },
    });
  },
  {
    theme: {
      extend: {
        // If an `--tw-animation-*` is not defined, fallback to the current
        // value to make sure the animation is a NOP.
        keyframes: {
          enter: {
            from: {
              opacity: "var(--tw-animation-opacity, var(--tw-opacity, 1))",
              transform:
                "translate(var(--tw-translate-x), var(--tw-animation-translate-y, var(--tw-translate-y))) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
            },
          },
          exit: {
            to: {
              opacity: "var(--tw-animation-opacity, var(--tw-opacity, 1))",
              transform:
                "translate(var(--tw-translate-x), var(--tw-animation-translate-y, var(--tw-translate-y))) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))",
            },
          },
        },
      },
    },
  },
);
