import cn from "classnames";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import * as React from "react";

export type InputProps = StyleProps &
  HtmlInputProps &
  InputWrapperProps & {
    value?: string;
    onChange?: (value: string) => void;
  };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      size,
      hasError,
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
        <input
          {...rest}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(
            getInputClassName({
              disabled,
              size,
              hasError,
              leftAdornment,
              rightAdornment,
            })
          )}
          ref={ref}
        />
      </InputWrapper>
    );
  }
);
