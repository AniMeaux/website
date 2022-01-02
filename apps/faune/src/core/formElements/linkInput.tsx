import { BaseLink, BaseLinkProps } from "core/baseLink";
import { ensureArray } from "core/ensureArray";
import { Adornment } from "core/formElements/adornment";
import {
  InputWrapper,
  InputWrapperProps,
  INPUT_STYLES,
} from "core/formElements/inputWrapper";
import { StyleProps } from "core/types";
import { FaCaretDown } from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";

export type LinkInputProps = InputWrapperProps &
  StyleProps &
  Omit<BaseLinkProps, "children"> & {
    value?: string | null;
    placeholder?: string;
  };

export function LinkInput({
  hasError = false,
  leftAdornment,
  rightAdornment,
  disabled,
  className,
  value,
  placeholder,
  ...rest
}: LinkInputProps) {
  rightAdornment = [
    ...ensureArray(rightAdornment),
    <Adornment>
      <FaCaretDown />
    </Adornment>,
  ];

  return (
    <InputWrapper
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      hasError={hasError}
      className={className}
    >
      <InputElement
        {...rest}
        disabled={disabled}
        $hasError={hasError}
        $leftAdornment={leftAdornment}
        $rightAdornment={rightAdornment}
      >
        {value ?? <Placeholder>{placeholder}</Placeholder>}
      </InputElement>
    </InputWrapper>
  );
}

const InputElement = styled(BaseLink)`
  ${INPUT_STYLES};
`;

const Placeholder = styled.span`
  color: ${theme.colors.text.secondary};

  &::after {
    /* Force a min-height. */
    content: " ";
  }
`;
