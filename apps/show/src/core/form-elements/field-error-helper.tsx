import { FormLayout } from "#i/core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const FieldErrorHelper = forwardRef<
  React.ComponentRef<typeof FormLayout.Helper>,
  Except<
    React.ComponentPropsWithoutRef<typeof FormLayout.Helper>,
    "id" | "variant" | "children"
  > & {
    field: FieldMetadata;
  }
>(function FieldErrorHelper({ field, ...props }, ref) {
  if (field.errors == null) {
    return null;
  }

  return (
    <FormLayout.Helper {...props} ref={ref} id={field.errorId} variant="error">
      {field.errors.join(". ")}
    </FormLayout.Helper>
  );
});
