import autosize from "autosize";
import { forwardRef, useRef } from "react";
import invariant from "tiny-invariant";
import { asBooleanAttribute } from "~/core/attributes";
import { ensureArray } from "~/core/ensureArray";
import {
  inputClassName,
  InputWrapper,
  InputWrapperProps,
} from "~/core/formElements/inputWrapper";
import { useLayoutEffect } from "~/core/useLayoutEffect";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    leftAdornment?: InputWrapperProps["leftAdornment"];
    rightAdornment?: InputWrapperProps["rightAdornment"];
    hasError?: boolean;
  };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      hasError = false,
      leftAdornment,
      rightAdornment,
      rows = 3,
      disabled,
      className,
      // Should use `"off"` as default value but it is ingored by Chrome.
      // See https://bugs.chromium.org/p/chromium/issues/detail?id=587466
      // A random value is used to confuse the browser and make sure previous
      // values are never suggested.
      autoComplete = String(Math.random()),
      ...rest
    },
    propRef
  ) {
    invariant(typeof propRef !== "function", "Only object ref are supported.");
    const localRef = useRef<HTMLTextAreaElement>(null);
    const ref = propRef ?? localRef;

    useLayoutEffect(() => {
      const elt = ref.current;
      invariant(elt != null, "ref must be set");
      autosize(elt);

      return () => {
        autosize.destroy(elt);
      };
    }, [ref]);

    useLayoutEffect(() => {
      invariant(ref.current != null, "ref must be set");
      autosize.update(ref.current);
    });

    return (
      <InputWrapper
        isDisabled={disabled}
        leftAdornment={leftAdornment}
        rightAdornment={rightAdornment}
        className={className}
      >
        <textarea
          {...rest}
          ref={ref}
          rows={rows}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={asBooleanAttribute(hasError)}
          className={inputClassName({
            leftAdornmentCount: ensureArray(leftAdornment).length,
            rightAdornmentCount: ensureArray(rightAdornment).length,
          })}
        />
      </InputWrapper>
    );
  }
);
