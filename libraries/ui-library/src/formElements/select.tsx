import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { Adornment } from "./adornment";
import { BaseInput, BaseInputProps, getInputClassName } from "./baseInput";

export type SelectProps<ValueType> = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value" | "size"
> &
  BaseInputProps & {
    value?: ValueType | null;
    onChange?: (value: ValueType) => void;
  };

export function Select<ValueType = string>({
  size,
  hasError,
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
}: SelectProps<ValueType>) {
  if (rightAdornment == null) {
    rightAdornment = (
      <Adornment>
        <FaCaretDown />
      </Adornment>
    );
  }

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
      <select
        {...rest}
        value={value == null ? "" : String(value)}
        onChange={(event) => {
          if (onChange != null) {
            onChange((event.target.value as any) as ValueType);
          }
        }}
        disabled={disabled}
        className={cn(
          getInputClassName({
            size,
            hasError,
            errorMessage,
            leftAdornment,
            rightAdornment,
          }),
          "truncate cursor-pointer",
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
