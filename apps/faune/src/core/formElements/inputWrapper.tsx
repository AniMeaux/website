import { ensureArray } from "core/ensureArray";
import { ChildrenProp, StyleProps } from "core/types";
import { createElement } from "react";
import styled, {
  css,
  FlattenSimpleInterpolation,
} from "styled-components/macro";
import { theme } from "styles/theme";
import { ADORNMENT_SIZE } from "core/formElements/adornment";

export type InputWrapperProps = {
  disabled?: boolean;
  leftAdornment?: React.ReactNode | React.ReactNode[];
  rightAdornment?: React.ReactNode | React.ReactNode[];
  hasError?: boolean;
};

export function InputWrapper({
  children,
  disabled = false,
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
        createElement(AdornmentContainer, { side: "left" }, ...leftAdornments)}

      {rightAdornments.length > 0 &&
        createElement(
          AdornmentContainer,
          { side: "right" },
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

function AdornmentContainer({ side, children }: AdornmentContainerProps) {
  return (
    <AdornmentContainerElement $side={side}>
      {children}
    </AdornmentContainerElement>
  );
}

type AdornmentContainerElementProps = {
  $side: AdornmentContainerProps["side"];
};

const AdornmentContainerElement = styled.span<AdornmentContainerElementProps>`
  pointer-events: none;
  position: absolute;
  top: 0;
  ${(props) => ADORNMENT_CONTAINER_SIDE_STYLES[props.$side]};
  display: flex;
  align-items: center;
  padding: ${theme.spacing.x1} ${theme.spacing.x2};
`;

type InputStylesProps = {
  $hasError: boolean;
  $leftAdornment?: React.ReactNode | React.ReactNode[];
  $rightAdornment?: React.ReactNode | React.ReactNode[];
};

export const INPUT_STYLES = css<InputStylesProps>`
  appearance: none;
  width: 100%;
  min-width: 0;
  border-radius: ${theme.borderRadius.l};
  border: 1px solid ${theme.colors.dark[100]};
  background: ${(props) => (props.$hasError ? theme.colors.alert[50] : null)};

  padding-top: ${theme.spacing.x2};
  padding-bottom: ${theme.spacing.x2};

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
