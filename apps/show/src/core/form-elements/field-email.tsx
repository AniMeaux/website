import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldEmail({
  field,
  label,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <FormLayout.Input {...getInputProps(field, { type: "email" })} />

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
