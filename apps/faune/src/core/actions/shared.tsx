import { css } from "styled-components/macro";
import { Styles, theme } from "styles/theme";

type ActionVariant = "primary" | "secondary" | "outlined";
type ActionSize = "small" | "medium";

export type ActionCommonProps = {
  size?: ActionSize;
  variant?: ActionVariant;
  disabled?: boolean;
  isIconOnly?: boolean;
};

const VARIANTS_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[500]};
    color: ${theme.colors.text.contrast};
  `,
  secondary: css``,
  outlined: css`
    background: ${theme.colors.light[1000]};
    box-shadow: inset 0 0 0 1px ${theme.colors.dark[100]};
  `,
};

const VARIANTS_HOVER_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[400]};
  `,
  secondary: css`
    background: ${theme.colors.dark[30]};
  `,
  outlined: css`
    background: ${theme.colors.dark[30]};
  `,
};

const VARIANTS_ACTIVE_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[600]};
  `,
  secondary: css`
    background: ${theme.colors.dark[100]};
  `,
  outlined: css`
    background: ${theme.colors.dark[100]};
  `,
};

type StylesProps = {
  disabled?: boolean;
  $variant?: ActionVariant;
  $size?: ActionSize;
  $isIconOnly?: boolean;
};

const ACTION_SIZES_STYLES: Record<ActionSize, Styles<StylesProps>> = {
  small: css<StylesProps>`
    padding: ${(props) =>
      props.$isIconOnly
        ? theme.spacing.x1
        : `${theme.spacing.x1} ${theme.spacing.x6}`};
  `,
  medium: css<StylesProps>`
    padding: ${(props) =>
      props.$isIconOnly
        ? theme.spacing.x2
        : `${theme.spacing.x2} ${theme.spacing.x12}`};
  `,
};

const DISABLED_STYLES = css`
  opacity: ${theme.opacity.disabled};
`;

export const ACTION_COMMON_STYLES = css<StylesProps>`
  ${(props) => VARIANTS_STYLES[props.$variant ?? "outlined"]};

  @media (hover: hover) {
    &:hover {
      ${(props) =>
        props.disabled
          ? null
          : VARIANTS_HOVER_STYLES[props.$variant ?? "outlined"]};
    }
  }

  &:active {
    ${(props) =>
      props.disabled
        ? null
        : VARIANTS_ACTIVE_STYLES[props.$variant ?? "outlined"]};
  }

  ${(props) => ACTION_SIZES_STYLES[props.$size ?? "medium"]};
  ${(props) => (props.disabled ? DISABLED_STYLES : null)};

  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.title};
  font-weight: 700;
  gap: ${theme.spacing.x2};
`;
