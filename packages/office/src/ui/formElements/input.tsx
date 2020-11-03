import cn from "classnames";
import * as React from "react";
import { BaseInput, getInputClassName } from "./baseInput";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  errorMessage?: string | null;
  infoMessage?: string | null;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export function Input({
  errorMessage,
  infoMessage,
  onChange,
  leftAdornment,
  rightAdornment,
  className,
  disabled,
  ...rest
}: InputProps) {
  return (
    <BaseInput
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
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
        className={cn(
          getInputClassName({
            disabled,
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
