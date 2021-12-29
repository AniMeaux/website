import {
  InputWrapper,
  InputWrapperProps,
  INPUT_STYLES,
} from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import { forwardRef } from "react";
import styled from "styled-components/macro";

export type InputProps = StyleProps &
  HtmlInputProps &
  InputWrapperProps & {
    value?: string;
    onChange?: (value: string) => void;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "medium",
    hasError = false,
    leftAdornment,
    rightAdornment,
    disabled,
    value,
    onChange,
    className,
    // Should use `"off"` as default value but it is ingored by Chrome.
    // See https://bugs.chromium.org/p/chromium/issues/detail
    // A random value is used to confuse the browser and make sure previous
    // values are never suggested.
    autoComplete = String(Math.random()),
    ...rest
  },
  ref
) {
  return (
    <InputWrapper
      size={size}
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      hasError={hasError}
      className={className}
    >
      <InputNative
        {...rest}
        autoComplete={autoComplete}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        $hasError={hasError}
        $size={size}
        $leftAdornment={leftAdornment}
        $rightAdornment={rightAdornment}
        ref={ref}
      />
    </InputWrapper>
  );
});

const InputNative = styled.input`
  ${INPUT_STYLES};
`;
