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
      min: number;
      max?: number;
      onFocus?: React.FocusEventHandler<React.ComponentRef<"div">>;
      onBlur?: React.FocusEventHandler<React.ComponentRef<"div">>;
    }
  >
>(function InputStepper(
  {
    value: propValue,
    onChange,
    min,
    max,
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
    if (value != null && max != null && value > max) {
      onChange(String(max));
    }
  }, [value, max, onChange]);

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
          const newValue = value == null ? 0 : Math.max(0, value - 1);

          if (newValue !== value) {
            onChange(String(newValue));

            if (newValue === 0) {
              ref.current?.focus();
            }
          }
        }}
        disabled={value != null && value <= 0}
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
          const newValue =
            value == null
              ? max ?? 0
              : Math.min(max ?? Number.MAX_SAFE_INTEGER, value + 1);

          if (newValue !== value) {
            onChange(String(newValue));

            if (newValue === max) {
              ref.current?.focus();
            }
          }
        }}
        disabled={value != null && max != null && value >= max}
        color="alabaster"
        type="button"
      >
        <Icon id="plus-light" />
      </ActionIcon>
    </div>
  );
});
