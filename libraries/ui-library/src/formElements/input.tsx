import cn from "classnames";
import * as React from "react";
import { BaseInput, BaseInputProps, getInputClassName } from "./baseInput";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> &
  BaseInputProps & {
    onChange?: React.Dispatch<React.SetStateAction<string>>;
    refProp?: React.RefObject<HTMLInputElement>;
  };

export function Input({
  errorMessage,
  hasError,
  infoMessage,
  onChange,
  leftAdornment,
  rightAdornment,
  disabled,
  refProp,
  className,
  ...rest
}: InputProps) {
  return (
    <BaseInput
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
            hasError,
            errorMessage,
            leftAdornment,
            rightAdornment,
          }),
          "placeholder-opacity-70 placeholder-default-color"
        )}
      />
    </BaseInput>
  );
}
