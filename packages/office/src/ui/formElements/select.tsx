import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { Adornment } from "./adornment";
import { BaseInput, getInputClassName } from "./baseInput";

export type SelectProps<ValueType> = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  errorMessage?: string | null;
  infoMessage?: string | null;
  value?: ValueType | null;
  onChange?: React.Dispatch<React.SetStateAction<ValueType | null>>;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

export function Select<ValueType = string>({
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
        value={value == null ? "" : String(value)}
        onChange={(event) => {
          if (onChange != null) {
            onChange((event.target.value as any) as ValueType);
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
