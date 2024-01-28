import { toBooleanAttribute } from "#core/attributes";
import { ensureArray } from "#core/collections";
import { BaseTextInput } from "#core/formElements/baseTextInput";
import { forwardRef } from "react";

export type InputProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseTextInput>,
  "leftAdornmentCount" | "rightAdornmentCount"
> & {
  leftAdornment?: React.ComponentPropsWithoutRef<
    typeof BaseTextInput.AdornmentContainer
  >["adornment"];
  rightAdornment?: React.ComponentPropsWithoutRef<
    typeof BaseTextInput.AdornmentContainer
  >["adornment"];
  hasError?: boolean;
};

export const Input = Object.assign(
  forwardRef<React.ComponentRef<"input">, InputProps>(function Input(
    {
      variant,
      hasError = false,
      leftAdornment,
      rightAdornment,
      hideFocusRing,
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
    ref,
  ) {
    return (
      <BaseTextInput.Root aria-disabled={disabled} className={className}>
        <BaseTextInput
          {...rest}
          ref={ref}
          type={type}
          pattern={pattern}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={toBooleanAttribute(hasError)}
          variant={variant}
          hideFocusRing={hideFocusRing}
          leftAdornmentCount={ensureArray(leftAdornment).length}
          rightAdornmentCount={ensureArray(rightAdornment).length}
          className={type === "date" ? "gap-0.5" : undefined}
        />

        <BaseTextInput.AdornmentContainer
          side="left"
          adornment={leftAdornment}
        />

        <BaseTextInput.AdornmentContainer
          side="right"
          adornment={rightAdornment}
        />
      </BaseTextInput.Root>
    );
  }),
  {
    Adornment: BaseTextInput.Adornment,
    ActionAdornment: BaseTextInput.ActionAdornment,
  },
);

function getTypeFallbackPattern(type: React.HTMLInputTypeAttribute) {
  switch (type) {
    case "date": {
      return "\\d{4}-\\d{2}-\\d{2}";
    }

    case "datetime-local": {
      return "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}";
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

    case "url": {
      return "https://.*";
    }

    default: {
      return undefined;
    }
  }
}
