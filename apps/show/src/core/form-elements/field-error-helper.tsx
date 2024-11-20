import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";

export function FieldErrorHelper({ field }: { field: FieldMetadata }) {
  if (field.errors == null) {
    return null;
  }

  return (
    <FormLayout.Helper id={field.errorId} variant="error">
      {field.errors.join(". ")}
    </FormLayout.Helper>
  );
}
