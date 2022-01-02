import autosize from "autosize";
import {
  InputWrapper,
  InputWrapperProps,
  INPUT_STYLES,
} from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";

export type TextareaProps = StyleProps &
  Omit<HtmlInputProps, "role" | "type"> &
  Omit<InputWrapperProps, "size"> & {
    value?: string;
    onChange?: (value: string) => void;
    rows?: number;
  };

export function Textarea({
  hasError = false,
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
      <TextareaElement
        {...rest}
        ref={textareaElement}
        disabled={disabled}
        value={value}
        rows={rows}
        onChange={(event) => onChange?.(event.target.value)}
        $hasError={hasError}
        $leftAdornment={leftAdornment}
        $rightAdornment={rightAdornment}
      />
    </InputWrapper>
  );
}

const TextareaElement = styled.textarea`
  ${INPUT_STYLES};
`;
