import cn from "classnames";
import * as React from "react";
import { BaseInput, BaseInputProps, getInputClassName } from "./baseInput";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "size"
> &
  BaseInputProps & {
    onChange?: React.Dispatch<React.SetStateAction<string>>;
    refProp?: React.MutableRefObject<HTMLInputElement>;
  };

export function Input({
  size,
  errorMessage,
  hasError,
  infoMessage,
  leftAdornment,
  rightAdornment,
  disabled,
  onChange,
  refProp,
  className,
  ...rest
}: InputProps) {
  return (
    <BaseInput
      size={size}
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      hasError={hasError}
      errorMessage={errorMessage}
      infoMessage={infoMessage}
      className={className}
    >
      <input
        {...rest}
        disabled={disabled}
        onChange={(event) => {
          if (onChange != null) {
            onChange(event.target.value);
          }
        }}
        ref={refProp}
        className={cn(
          getInputClassName({
            size,
            hasError,
            errorMessage,
            leftAdornment,
            rightAdornment,
          }),
          "placeholder-opacity-50 placeholder-black"
        )}
      />
    </BaseInput>
  );
}
