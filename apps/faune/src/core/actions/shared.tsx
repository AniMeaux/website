import { css } from "styled-components/macro";
import { Styles, theme } from "styles/theme";

type ActionVariant = "primary" | "outlined";

export type ActionCommonProps = {
  variant?: ActionVariant;
  disabled?: boolean;
};

const VARIANTS_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[500]};
    border-color: ${theme.colors.primary[500]};
    color: ${theme.colors.text.contrast};
  `,
  outlined: css`
    background: ${theme.colors.light[1000]};
    border-color: ${theme.colors.dark[100]};
  `,
};

const VARIANTS_HOVER_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[400]};
    border-color: ${theme.colors.primary[400]};
  `,
  outlined: css`
    background: ${theme.colors.dark[30]};
  `,
};

const VARIANTS_ACTIVE_STYLES: Record<ActionVariant, Styles> = {
  primary: css`
    background: ${theme.colors.primary[600]};
    border-color: ${theme.colors.primary[600]};
  `,
  outlined: css`
    background: ${theme.colors.dark[100]};
  `,
};

type StylesProps = {
  $variant?: ActionVariant;
  disabled?: boolean;
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

  ${(props) => (props.disabled ? DISABLED_STYLES : null)};

  padding: ${theme.spacing.x2} ${theme.spacing.x12};
  border-radius: ${theme.borderRadius.full};
  border-width: 1px;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.title};
  line-height: ${theme.typography.lineHeight.multiLine};
  font-weight: 700;
  gap: ${theme.spacing.x2};
`;
