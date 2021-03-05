import cn from "classnames";
import * as React from "react";
import { StyleProps, HtmlInputProps } from "../core";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

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
      placeholder,
      autoComplete = "off",
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
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value);
          }}
          className={cn(
            getInputClassName({
              disabled,
              size,
              hasError,
              leftAdornment,
              rightAdornment,
            }),
            "placeholder-black placeholder-opacity-50"
          )}
          ref={ref}
        />
      </InputWrapper>
    );
  }
);
