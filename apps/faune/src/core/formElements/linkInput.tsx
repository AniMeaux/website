import cn from "classnames";
import { BaseLink, BaseLinkProps } from "core/baseLink";
import { ensureArray } from "core/ensureArray";
import { Adornment } from "core/formElements/adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "core/formElements/inputWrapper";
import { StyleProps } from "core/types";
import { FaCaretDown } from "react-icons/fa";

export type LinkInputProps = InputWrapperProps &
  StyleProps &
  Omit<BaseLinkProps, "children"> & {
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
      <BaseLink
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
      </BaseLink>
    </InputWrapper>
  );
}
