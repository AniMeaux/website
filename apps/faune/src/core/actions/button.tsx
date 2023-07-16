import { forwardRef } from "react";
import styled from "styled-components";
import { ACTION_COMMON_STYLES, ActionCommonProps } from "~/core/actions/shared";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ActionCommonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, disabled, ...rest }, ref) {
    return (
      <ButtonElement
        {...rest}
        ref={ref}
        disabled={disabled}
        $variant={variant}
      />
    );
  }
);

const ButtonElement = styled.button`
  ${ACTION_COMMON_STYLES};
`;
