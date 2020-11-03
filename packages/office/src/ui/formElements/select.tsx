import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { Adornment } from "./adornment";
import { BaseInput, getInputClassName } from "./baseInput";

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  errorMessage?: string | null;
  infoMessage?: string | null;
  value?: string | null;
  onChange?: React.Dispatch<React.SetStateAction<string | null>>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export function Select({
  errorMessage,
  infoMessage,
  placeholder,
  value,
  onChange,
  leftAdornment,
  rightAdornment,
  children,
  className,
  disabled,
  ...rest
}: SelectProps) {
  return (
    <BaseInput
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={
        rightAdornment ?? (
          <Adornment>
            <FaCaretDown />
          </Adornment>
        )
      }
      errorMessage={errorMessage}
      infoMessage={infoMessage}
      className={className}
    >
      <select
        {...rest}
        value={value ?? ""}
        onChange={(event) => {
          if (onChange != null) {
            onChange(event.target.value);
          }
        }}
        disabled={disabled}
        className={cn(
          getInputClassName({
            disabled,
            errorMessage,
            leftAdornment,
            rightAdornment,
          }),
          "appearance-none truncate cursor-pointer",
          { "text-opacity-70": value == null }
        )}
      >
        <option disabled value="">
          {placeholder}
        </option>

        {children}
      </select>
    </BaseInput>
  );
}
