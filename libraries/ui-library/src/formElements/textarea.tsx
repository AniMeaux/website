import autosize from "autosize";
import cn from "classnames";
import * as React from "react";
import { HtmlInputProps, StyleProps } from "../core";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

export type TextareaProps = StyleProps &
  Omit<HtmlInputProps, "role" | "type"> &
  Omit<InputWrapperProps, "size"> & {
    value?: string;
    onChange?: (value: string) => void;
    rows?: number;
  };

export function Textarea({
  hasError,
  leftAdornment,
  rightAdornment,
  className,
  style,
  value,
  onChange,
  rows = 3,
  disabled,
  ...rest
}: TextareaProps) {
  const textareaElement = React.useRef<HTMLTextAreaElement>(null!);

  React.useLayoutEffect(() => {
    const elt = textareaElement.current;
    autosize(elt);

    return () => {
      autosize.destroy(elt);
    };
  }, []);

  React.useLayoutEffect(() => {
    autosize.update(textareaElement.current);
  });

  return (
    <InputWrapper
      size="dynamic"
      disabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      hasError={hasError}
      className={className}
      style={style}
    >
      <textarea
        {...rest}
        ref={textareaElement}
        disabled={disabled}
        value={value}
        rows={rows}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          getInputClassName({
            disabled,
            size: "dynamic",
            hasError,
            leftAdornment,
            rightAdornment,
          }),
          "py-2 placeholder-black placeholder-opacity-50"
        )}
      />
    </InputWrapper>
  );
}
