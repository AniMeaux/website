import { Checkbox } from "#i/core/form-elements/checkbox";
import { Radio } from "#i/core/form-elements/radio";
import { RequiredStar } from "#i/core/form-elements/required-star";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const InputsChoices = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function InputsChoices({ className, ...props }, ref) {
  return (
    <Primitive.div
      {...props}
      ref={ref}
      className={cn(className, "flex flex-wrap gap-2 py-1")}
    />
  );
});

/** @deprecated */
export const RadioInputList = InputsChoices;

/** @deprecated */
export const CheckboxInputList = InputsChoices;

export const InputChoice = {
  Root: forwardRef<
    React.ComponentRef<"label">,
    React.ComponentPropsWithoutRef<"label">
  >(function InputChoiceRoot({ className, ...props }, ref) {
    return (
      <label
        {...props}
        ref={ref}
        className={cn(
          className,
          "grid grid-cols-[auto_minmax(min-content,1fr)] items-center gap-0.5 has-[input:enabled]:cursor-pointer has-[input:disabled]:opacity-disabled",
        )}
      />
    );
  }),

  Radio,
  Checkbox,

  Label: Primitive.span,
};

/** @deprecated */
export const RadioInput = forwardRef<
  React.ComponentRef<typeof InputChoice.Radio>,
  React.ComponentPropsWithoutRef<typeof InputChoice.Radio> & {
    label: React.ReactNode;
  }
>(function RadioInput({ label, required = false, className, ...props }, ref) {
  return (
    <InputChoice.Root className={className}>
      <InputChoice.Radio {...props} ref={ref} />

      <InputChoice.Label>
        {label} {required ? <RequiredStar /> : null}
      </InputChoice.Label>
    </InputChoice.Root>
  );
});

/** @deprecated */
export const CheckboxInput = forwardRef<
  React.ComponentRef<typeof InputChoice.Checkbox>,
  React.ComponentPropsWithoutRef<typeof InputChoice.Checkbox> & {
    label: React.ReactNode;
  }
>(function CheckboxInput(
  { label, required = false, className, ...props },
  ref,
) {
  return (
    <InputChoice.Root className={className}>
      <InputChoice.Checkbox {...props} ref={ref} />

      <InputChoice.Label>
        {label} {required ? <RequiredStar /> : null}
      </InputChoice.Label>
    </InputChoice.Root>
  );
});
