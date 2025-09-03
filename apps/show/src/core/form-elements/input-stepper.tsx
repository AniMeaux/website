import { ActionIcon } from "#core/actions/action";
import { FormLayout } from "#core/layout/form-layout";
import { Icon } from "#generated/icon";
import { cn, useRefOrProp } from "@animeaux/core";
import { forwardRef, useEffect } from "react";
import type { Merge } from "type-fest";

export const InputStepper = forwardRef<
  React.ComponentRef<"input">,
  Merge<
    React.ComponentPropsWithoutRef<"input">,
    {
      value: string;
      onChange: React.Dispatch<string>;
      min?: number;
      max?: number;
      onFocus?: React.FocusEventHandler<React.ComponentRef<"div">>;
      onBlur?: React.FocusEventHandler<React.ComponentRef<"div">>;
    }
  >
>(function InputStepper(
  {
    value: propValue,
    onChange,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    onFocus,
    onBlur,
    className,
    ...props
  },
  propRef,
) {
  let value: null | number = Number(propValue);
  value = isNaN(value) ? null : value;

  useEffect(() => {
    if (value != null) {
      if (value < min) {
        onChange(String(min));
      } else if (value > max) {
        onChange(String(max));
      }
    }
  }, [value, min, max, onChange]);

  const ref = useRefOrProp(propRef);

  return (
    <div
      className={cn("grid grid-cols-auto-fr-auto gap-0.5", className)}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onFocus?.(event);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onBlur?.(event);
        }
      }}
    >
      <ActionIcon
        onClick={() => {
          const newValue = value == null ? max : Math.max(min, value - 1);

          if (newValue !== value) {
            onChange(String(newValue));

            if (newValue === min) {
              ref.current?.focus();
            }
          }
        }}
        disabled={value != null && value <= min}
        color="alabaster"
        type="button"
      >
        <Icon id="minus-light" />
      </ActionIcon>

      <FormLayout.Input
        {...props}
        type="text"
        ref={ref}
        value={propValue}
        onChange={(event) => onChange(event.target.value)}
        min={min}
        max={max}
        inputMode="numeric"
        className="text-center"
      />

      <ActionIcon
        onClick={() => {
          const newValue = value == null ? min : Math.min(max, value + 1);

          if (newValue !== value) {
            onChange(String(newValue));

            if (newValue === max) {
              ref.current?.focus();
            }
          }
        }}
        disabled={value != null && value >= max}
        color="alabaster"
        type="button"
      >
        <Icon id="plus-light" />
      </ActionIcon>
    </div>
  );
});
