import cn from "classnames";
import { ensureArray } from "core/ensureArray";
import { Link, LinkProps } from "core/link";
import { StyleProps } from "core/types";
import { Adornment } from "formElements/adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "formElements/inputWrapper";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";

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
          })
        )}
      >
        {value ?? <span className="LinkInput__placeholder">{placeholder}</span>}
      </Link>
    </InputWrapper>
  );
}
