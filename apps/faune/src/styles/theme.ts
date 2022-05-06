import {
  createGlobalStyle,
  css,
  FlattenInterpolation,
  keyframes,
  ThemedStyledProps,
} from "styled-components";
import { ScreenSize } from "~/core/screenSize";

export type Styles<PropType = {}> = FlattenInterpolation<
  ThemedStyledProps<PropType, any>
>;

export function setFocusColor(color: string) {
  return `--focus-color: ${color};`;
}

const colors = {
  red: {
    "50": "#ffebee",
    "100": "#ffcdd2",
    "200": "#ef9a9a",
    "300": "#e57373",
    "400": "#ef5350",
    "500": "#f44336",
    "600": "#e53935",
    "700": "#d32f2f",
    "800": "#c62828",
    "900": "#b71c1c",
    a100: "#ff8a80",
    a200: "#ff5252",
    a400: "#ff1744",
    a700: "#d50000",
  },
  blue: {
    "50": "#e2f2fd",
    "100": "#bcdefb",
    "200": "#90caf9",
    "300": "#65b5f6",
    "400": "#42a5f5",
    "500": "#2094f3",
    "600": "#1f89e5",
    "700": "#1975d2",
    "800": "#1565c1",
    "900": "#0d48a0",
    a100: "#80b0ff",
    a200: "#4287ff",
    a400: "#2977ff",
    a700: "#2962ff",
  },
  lightBlue: {
    "50": "#e1f5fe",
    "100": "#b3e5fc",
    "200": "#81d4fa",
    "300": "#4fc3f7",
    "400": "#29b6f6",
    "500": "#03a9f4",
    "600": "#039be5",
    "700": "#0288d1",
    "800": "#0277bd",
    "900": "#01579b",
    a100: "#80d8ff",
    a200: "#40c4ff",
    a400: "#00b0ff",
    a700: "#0091ea",
  },
  green: {
    "50": "#e8f5e9",
    "100": "#c8e6c9",
    "200": "#a5d6a7",
    "300": "#81c784",
    "400": "#66bb6a",
    "500": "#4caf50",
    "600": "#43a047",
    "700": "#388e3c",
    "800": "#2e7d32",
    "900": "#1b5e20",
    a100: "#b9f6ca",
    a200: "#69f0ae",
    a400: "#00e676",
    a700: "#00c853",
  },
  amber: {
    "50": "#fff8e1",
    "100": "#ffecb3",
    "200": "#ffe082",
    "300": "#ffd54f",
    "400": "#ffca28",
    "500": "#ffc107",
    "600": "#ffb300",
    "700": "#ffa000",
    "800": "#ff8f00",
    "900": "#ff6f00",
    a100: "#ffe57f",
    a200: "#ffd740",
    a400: "#ffc400",
    a700: "#ffab00",
  },
  dark: {
    "30": "rgba(0, 0, 0, 0.03)",
    "50": "rgba(0, 0, 0, 0.05)",
    "100": "rgba(0, 0, 0, 0.1)",
    "200": "rgba(0, 0, 0, 0.2)",
    "300": "rgba(0, 0, 0, 0.3)",
    "400": "rgba(0, 0, 0, 0.4)",
    "500": "rgba(0, 0, 0, 0.5)",
    "600": "rgba(0, 0, 0, 0.6)",
    "700": "rgba(0, 0, 0, 0.7)",
    "800": "rgba(0, 0, 0, 0.8)",
    "900": "rgba(0, 0, 0, 0.9)",
  },
  light: {
    "400": "rgba(255, 255, 255, 0.4)",
    "800": "rgba(255, 255, 255, 0.8)",
    "1000": "rgba(255, 255, 255, 1)",
  },
};

export const theme = {
  spacing: {
    x1: "4px",
    x2: "8px",
    x3: "12px",
    x4: "16px",
    x6: "24px",
    x8: "32px",
    x10: "40px",
    x12: "48px",
  },
  colors: {
    ...colors,
    primary: colors.blue,
    alert: colors.red,
    warning: colors.amber,
    success: colors.green,
    background: {
      primary: colors.light[1000],
      secondary: colors.dark[30],
    },
    separator: colors.dark[50],
    text: {
      primary: colors.dark[800],
      secondary: colors.dark[600],
      contrast: colors.light[1000],
    },
  },
  typography: {
    lineHeight: {
      monoLine: "1.2",
      multiLine: "1.5",
    },
    fontFamily: {
      title: '"Open Sans", serif',
      body: '"Roboto", sans-serif',
    },
  },
  borderRadius: {
    m: "12px",
    l: "20px",
    full: "9999px",
  },
  components: {
    bottomNavHeight: "56px",
  },
  animation: {
    ease: {
      exit: "cubic-bezier(0.4, 0, 1, 1)",
      enter: "cubic-bezier(0, 0, 0.2, 1)",
      move: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    duration: {
      fast: "100ms",
      slow: "200ms",
    },
    fadeIn: keyframes`
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    `,
    fadeOut: keyframes`
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    `,
    scaleIn: keyframes`
      0% {
        transform: scale3d(0.5, 0.5, 1);
      }

      100% {
        transform: scale3d(1, 1, 1);
      }
    `,
    scaleOut: keyframes`
      0% {
        transform: scale3d(1, 1, 1);
      }
      
      100% {
        transform: scale3d(0.5, 0.5, 1);
      }
    `,
    scaleInY: keyframes`
      0% {
        transform: scale3d(1, 0.5, 1);
      }

      100% {
        transform: scale3d(1, 1, 1);
      }
    `,
    scaleOutY: keyframes`
      0% {
        transform: scale3d(1, 1, 1);
      }
      
      100% {
        transform: scale3d(1, 0.5, 1);
      }
    `,
    bottomSlideIn: keyframes`
      0% {
        transform: translate3d(0, 100%, 0);
      }

      100% {
        transform: translate3d(0, 0, 0);
      }
    `,
    bottomSlideOut: keyframes`
      0% {
        transform: translate3d(0, 0, 0);
      }

      100% {
        transform: translate3d(0, 100%, 0);
      }
    `,
    rightSlideIn: keyframes`
      0% {
        transform: translate3d(100%, 0, 0);
      }

      100% {
        transform: translate3d(0, 0, 0);
      }
    `,
    rightSlideOut: keyframes`
      0% {
        transform: translate3d(0, 0, 0);
      }

      100% {
        transform: translate3d(100%, 0, 0);
      }
    `,
  },
  shadow: {
    m: "0 2px 8px 0 rgba(0, 0, 0, 0.15)",
  },
  zIndex: {
    header: "20",
    navigation: "20",
    modal: "30",
    snackbar: "40",
    progressBar: "40",
  },
  opacity: {
    disabled: "0.6",
  },
  // Use inclusive ranges to support both min-width and max-width syntax:
  // @media (max-width: ${theme.screenSizes.s.end}) {}
  // @media (min-width: ${theme.screenSizes.m.start}) {}
  screenSizes: {
    small: {
      start: "0px",
      end: `${ScreenSize.MEDIUM - 1}px`,
    },
    medium: {
      start: `${ScreenSize.MEDIUM}px`,
      end: `${ScreenSize.LARGE - 1}px`,
    },
    large: {
      start: `${ScreenSize.LARGE}px`,
      end: `${Number.MAX_SAFE_INTEGER}px`,
    },
  },
};

export const ELLIPSIS_STYLES = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    /* Disable bark background on link/button on tap. */
    -webkit-tap-highlight-color: transparent;
  }

  html {
    background: ${theme.colors.background.primary};
    font-size: 16px;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: ${theme.typography.fontFamily.body};
    font-size: 1rem;
    line-height: ${theme.typography.lineHeight.monoLine};
    color: ${theme.colors.text.primary};
  }

  a:focus,
  input:focus,
  textarea:focus,
  select:focus,
  button:focus,
  [tabindex]:focus {
    outline: none;
  }

  @media (hover: hover) {
    a.focus-visible,
    a:focus-visible,
    input.focus-visible,
    input:focus-visible,
    textarea.focus-visible,
    textarea:focus-visible,
    select.focus-visible,
    select:focus-visible,
    button.focus-visible,
    button:focus-visible,
    [tabindex].focus-visible,
    [tabindex]:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-color, ${theme.colors.primary.a400});
    }
  }

  strong {
    font-weight: 600;
  }
`;

export const ResetStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button,
  select,
  input,
  textarea {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    text-align: left;
    color: inherit;
    resize: none;
  }

  button:not([disabled]),
  select:not([disabled]),
  input[type="checkbox"]:not([disabled]),
  input[type="radio"]:not([disabled]) {
    cursor: pointer;
  }

  button[disabled],
  select[disabled],
  input[type="checkbox"][disabled],
  input[type="radio"][disabled] {
    cursor: default;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul {
    margin: 0;
    padding: 0;
    font: inherit;
    font-weight: inherit;
  }

  ul {
    list-style: none;
  }

  address {
    font-style: normal;
  }

  hr {
    margin: 0;
    border: 0;
    box-sizing: inherit;
  }
`;
