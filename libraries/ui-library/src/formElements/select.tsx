import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ChildrenProp, StyleProps } from "../core/types";
import { ensureArray } from "../ensureArray";
import { Adornment } from "./adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

export type SelectProps<ValueType> = StyleProps &
  ChildrenProp &
  InputWrapperProps & {
    value?: ValueType | null;
    onChange?: (value: ValueType) => void;
    placeholder: string;
  };

export function Select<ValueType = string>({
  size,
  hasError,
  placeholder,
  value,
  onChange,
  leftAdornment,
  rightAdornment,
  children,
  className,
  disabled,
}: SelectProps<ValueType>) {
  rightAdornment = [
    ...ensureArray(rightAdornment),
    <Adornment>
      <FaCaretDown />
    </Adornment>,
  ];

  return (
    <InputWrapper
      size={size}
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      hasError={hasError}
      className={className}
    >
      <select
        value={value == null ? "" : String(value)}
        onChange={(event) => {
          onChange?.((event.target.value as any) as ValueType);
        }}
        disabled={disabled}
        className={cn(
          getInputClassName({
            size,
            hasError,
            leftAdornment,
            rightAdornment,
          }),
          "truncate cursor-pointer",
          { "text-black text-opacity-50": value == null }
        )}
      >
        <option disabled value="">
          {placeholder}
        </option>

        {children}
      </select>
    </InputWrapper>
  );
}
