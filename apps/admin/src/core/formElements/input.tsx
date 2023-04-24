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
    pattern = getTypeFallbackPattern(type),
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
        pattern={pattern}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={asBooleanAttribute(hasError)}
        className={cn(
          inputClassName({
            variant,
            leftAdornmentCount: ensureArray(leftAdornment).length,
            rightAdornmentCount: ensureArray(rightAdornment).length,
          }),
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

    case "email": {
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
      return "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*";
    }

    case "tel": {
      return "\\+?[\\s\\d]+";
    }

    case "time": {
      return "\\d{2}:\\d{2}";
    }

    default: {
      return undefined;
    }
  }
}
