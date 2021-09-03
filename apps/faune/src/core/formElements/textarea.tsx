import autosize from "autosize";
import cn from "classnames";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import { useLayoutEffect, useRef } from "react";

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
  const textareaElement = useRef<HTMLTextAreaElement>(null!);

  useLayoutEffect(() => {
    const elt = textareaElement.current;
    autosize(elt);

    return () => {
      autosize.destroy(elt);
    };
  }, []);

  useLayoutEffect(() => {
    autosize.update(textareaElement.current);
  });

  return (
    <InputWrapper
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
            hasError,
            leftAdornment,
            rightAdornment,
          })
        )}
      />
    </InputWrapper>
  );
}
