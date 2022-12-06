import { forwardRef } from "react";
import { asBooleanAttribute } from "~/core/attributes";
import { cn } from "~/core/classNames";
import { ensureArray } from "~/core/ensureArray";
import {
  inputClassName,
  InputVariant,
  InputWrapper,
  InputWrapperProps,
} from "~/core/formElements/inputWrapper";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: InputVariant;
  leftAdornment?: InputWrapperProps["leftAdornment"];
  rightAdornment?: InputWrapperProps["rightAdornment"];
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant,
    hasError = false,
    leftAdornment,
    rightAdornment,
    disabled,
    type = "text",
    value,
    className,
    // Should use `"off"` as default value but it is ingored by Chrome.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=587466
    // A random value is used to confuse the browser and make sure previous
    // values are never suggested.
    autoComplete = String(Math.random()),
    ...rest
  },
  ref
) {
  const isHidden = (type === "date" || type === "time") && value === "";

  return (
    <InputWrapper
      isDisabled={disabled}
      leftAdornment={leftAdornment}
      rightAdornment={rightAdornment}
      className={className}
    >
      <input
        {...rest}
        ref={ref}
        type={type}
        value={value}
        pattern={getTypeFallbackPattern(type)}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={asBooleanAttribute(hasError)}
        className={cn(
          inputClassName({
            variant,
            leftAdornmentCount: ensureArray(leftAdornment).length,
            rightAdornmentCount: ensureArray(rightAdornment).length,
          }),
          { "text-transparent focus:text-inherit": isHidden },
          { "gap-0.5": type === "date" }
        )}
      />
    </InputWrapper>
  );
});

function getTypeFallbackPattern(type: React.HTMLInputTypeAttribute) {
  switch (type) {
    case "date": {
      return "\\d{4}-\\d{2}-\\d{2}";
    }

    case "time": {
      return "\\d{2}:\\d{2}";
    }

    default: {
      return undefined;
    }
  }
}
