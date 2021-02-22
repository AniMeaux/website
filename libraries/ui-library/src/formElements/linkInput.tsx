import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ensureArray, Link, LinkProps, StyleProps } from "../core";
import { Adornment } from "./adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

export type LinkInputProps = InputWrapperProps &
  StyleProps &
  Omit<LinkProps, "children"> & {
    value?: string | null;
    placeholder?: string;
  };

export function LinkInput({
  size,
  hasError,
  leftAdornment,
  rightAdornment,
  disabled,
  className,
  value,
  placeholder,
  ...rest
}: LinkInputProps) {
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
      <Link
        {...rest}
        disabled={disabled}
        className={cn(
          getInputClassName({
            disabled,
            hasError,
            size,
            leftAdornment,
            rightAdornment,
          }),
          "text-left flex items-center"
        )}
      >
        {value ?? (
          <span className="text-black text-opacity-50">{placeholder}</span>
        )}
      </Link>
    </InputWrapper>
  );
}
