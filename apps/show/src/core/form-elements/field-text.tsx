import { withoutKey } from "#core/conform";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldText({
  field,
  label,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <FormLayout.Input
        key={field.key}
        {...withoutKey(getInputProps(field, { type: "text" }))}
      />

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
