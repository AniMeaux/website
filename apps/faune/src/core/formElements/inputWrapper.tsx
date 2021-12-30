import { ensureArray } from "core/ensureArray";
import { ChildrenProp, StyleProps } from "core/types";
import { createElement } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
} from "styled-components/macro";
import { theme } from "styles/theme";
import { ADORNMENT_SIZE } from "core/formElements/adornment";

export type InputSize = "small" | "medium";

export type InputWrapperProps = {
  disabled?: boolean;
  size?: InputSize;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  hasError?: boolean;
};

export function InputWrapper({
  children,
  disabled = false,
  size = "medium",
  leftAdornment,
  rightAdornment,
  ...rest
}: ChildrenProp & StyleProps & InputWrapperProps) {
  const rightAdornments = ensureArray(rightAdornment);
  const leftAdornments = ensureArray(leftAdornment);

  return (
    <InputWrapperElement {...rest} $isDisabled={disabled}>
      {children}

      {leftAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "left", size },
          ...leftAdornments
        )}

      {rightAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "right", size },
          ...rightAdornments
        )}
    </InputWrapperElement>
  );
}

const InputWrapperElement = styled.span<{ $isDisabled: boolean }>`
  position: relative;
  display: inline-flex;
  opacity: ${(props) => (props.$isDisabled ? theme.opacity.disabled : 1)};
`;

type AdornmentContainerProps = ChildrenProp & {
  side: "left" | "right";
  size: InputSize;
};

const ADORNMENT_CONTAINER_SIDE_STYLES: Record<
  AdornmentContainerProps["side"],
  FlattenSimpleInterpolation
> = {
  left: css`
    left: 0;
  `,
  right: css`
    right: 0;
  `,
};

function AdornmentContainer({ side, size, children }: AdornmentContainerProps) {
  return (
    <AdornmentContainerElement $isSmall={size === "small"} $side={side}>
      {children}
    </AdornmentContainerElement>
  );
}

type AdornmentContainerElementProps = {
  $isSmall: boolean;
  $side: AdornmentContainerProps["side"];
};

const AdornmentContainerElement = styled.span<AdornmentContainerElementProps>`
  pointer-events: none;
  position: absolute;
  top: 0;
  ${(props) => ADORNMENT_CONTAINER_SIDE_STYLES[props.$side]};
  display: flex;
  align-items: center;
  padding: ${(props) =>
    props.$isSmall
      ? `0 ${theme.spacing.x2}`
      : `${theme.spacing.x1} ${theme.spacing.x2}`};
`;

type InputStylesProps = {
  $hasError: boolean;
  $size: InputSize;
  $leftAdornment?: React.ReactNode | React.ReactNode[];
  $rightAdornment?: React.ReactNode | React.ReactNode[];
};

export const INPUT_STYLES = css<InputStylesProps>`
  appearance: none;
  width: 100%;
  min-width: 0;
  border-radius: ${theme.borderRadius.l};
  background: ${(props) =>
    props.$hasError ? theme.colors.alert[50] : theme.colors.dark[30]};

  padding-top: ${(props) =>
    props.$size === "small" ? theme.spacing.x1 : theme.spacing.x2};

  padding-bottom: ${(props) =>
    props.$size === "small" ? theme.spacing.x1 : theme.spacing.x2};

  padding-left: calc(
    ${theme.spacing.x4} +
      ${(props) => ensureArray(props.$leftAdornment).length * ADORNMENT_SIZE}px
  );

  padding-right: calc(
    ${theme.spacing.x4} +
      ${(props) => ensureArray(props.$rightAdornment).length * ADORNMENT_SIZE}px
  );

  line-height: ${theme.typography.lineHeight.multiLine};

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;
