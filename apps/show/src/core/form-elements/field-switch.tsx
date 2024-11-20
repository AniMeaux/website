import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldSwitch({
  field,
  label,
}: {
  // Don't use `FieldMetadata<boolean>` to support Zod `discriminatedUnion` on
  // `zu.literal("on")`.
  field: FieldMetadata<undefined | "on" | "off">;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field orientation="horizontal">
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <FormLayout.SwitchInput {...getInputProps(field, { type: "checkbox" })} />

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
