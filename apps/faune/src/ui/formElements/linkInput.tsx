import cn from "classnames";
import { ensureArray } from "core/ensureArray";
import { Link, LinkProps } from "core/link";
import { StyleProps } from "core/types";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { Adornment } from "ui/formElements/adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "ui/formElements/inputWrapper";

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
