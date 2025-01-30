import { InputRadio } from "#core/form-elements/input-radio";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const FieldChoices = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function FieldChoices({ className, ...props }, ref) {
  return (
    <Primitive.div
      {...props}
      ref={ref}
      className={cn(className, "flex flex-wrap gap-2 py-1")}
    />
  );
});

/** @deprecated */
export const RadioInputList = FieldChoices;

export const FieldChoice = {
  Root: forwardRef<
    React.ComponentRef<"label">,
    React.ComponentPropsWithoutRef<"label">
  >(function FieldChoiceRoot({ className, ...props }, ref) {
    return (
      <label
        {...props}
        ref={ref}
        className={cn(
          className,
          "grid cursor-pointer grid-cols-[auto_minmax(min-content,1fr)] items-center gap-0.5",
        )}
      />
    );
  }),

  InputRadio,

  Label: Primitive.span,
};

/** @deprecated */
export const RadioInput = forwardRef<
  React.ComponentRef<"input">,
  React.ComponentPropsWithoutRef<typeof FieldChoice.InputRadio> & {
    label: React.ReactNode;
  }
>(function RadioInput({ label, className, ...props }, ref) {
  return (
    <FieldChoice.Root className={className}>
      <FieldChoice.InputRadio {...props} ref={ref} />
      <FieldChoice.Label>{label}</FieldChoice.Label>
    </FieldChoice.Root>
  );
});
