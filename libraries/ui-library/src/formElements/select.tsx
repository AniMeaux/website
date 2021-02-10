import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ChildrenProp, ensureArray, StyleProps } from "../core";
import { Adornment } from "./adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

export type SelectProps<ValueType> = StyleProps &
  ChildrenProp &
  InputWrapperProps & {
    hideDefaultOption?: boolean;
    value?: ValueType | null;
    onChange?: (value: ValueType) => void;
    placeholder?: string;
    id?: string;
  };

export function Select<ValueType = string>({
  size,
  hasError,
  placeholder = "",
  hideDefaultOption = false,
  value,
  onChange,
  leftAdornment,
  rightAdornment,
  children,
  className,
  disabled,
  id,
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
        id={id}
        value={value == null ? "" : String(value)}
        onChange={(event) => {
          onChange?.((event.target.value as any) as ValueType);
        }}
        disabled={disabled}
        className={cn(
          getInputClassName({
            disabled,
            size,
            hasError,
            leftAdornment,
            rightAdornment,
          }),
          "truncate cursor-pointer",
          { "text-black text-opacity-50": value == null }
        )}
      >
        {!hideDefaultOption && (
          <option disabled value="">
            {placeholder}
          </option>
        )}

        {children}
      </select>
    </InputWrapper>
  );
}
