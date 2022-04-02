import {
  InputWrapper,
  InputWrapperProps,
  INPUT_STYLES,
} from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import { forwardRef } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";

export type InputProps = StyleProps &
  HtmlInputProps &
  InputWrapperProps & {
    value?: string;
    onChange?: (value: string) => void;
    hasError?: boolean;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    hasError = false,
    leftAdornment,
    rightAdornment,
    disabled,
    value,
    onChange,
    className,
    // Should use `"off"` as default value but it is ingored by Chrome.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=587466
    // A random value is used to confuse the browser and make sure previous
    // values are never suggested.
    autoComplete = String(Math.random()),
    ...rest
  },
  ref
) {
  return (
    <InputWrapper
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      className={className}
    >
      <InputNative
        {...rest}
        autoComplete={autoComplete}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        $hasError={hasError}
        $leftAdornment={leftAdornment}
        $rightAdornment={rightAdornment}
        ref={ref}
      />
    </InputWrapper>
  );
});

const InputNative = styled.input`
  ${INPUT_STYLES};

  &[type="date"] {
    gap: ${theme.spacing.x2};
  }

  /* Safari >= 15, Chrome >= 99 */
  &::-webkit-datetime-edit,
  &::-webkit-datetime-edit-fields-wrapper,
  &::-webkit-datetime-edit-year-field,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-hour-field,
  &::-webkit-datetime-edit-minute-field,
  &::-webkit-datetime-edit-second-field,
  &::-webkit-datetime-edit-millisecond-field,
  &::-webkit-datetime-edit-meridiem-field {
    padding: 0;
  }

  &::-webkit-calendar-picker-indicator {
    margin: 0;
  }

  /* iOS >= 15 */
  &::-webkit-date-and-time-value {
    text-align: left;
  }
`;
