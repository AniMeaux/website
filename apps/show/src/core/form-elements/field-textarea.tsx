import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getTextareaProps } from "@conform-to/react";

export function FieldTextarea({
  field,
  label,
  rows,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
  rows?: number;
}) {
  const textareaProps = getTextareaProps(field);

  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>{label}</FormLayout.Label>

      <FormLayout.Textarea {...textareaProps} rows={rows} />

      <FieldErrorHelper field={field} />

      {field.errors == null && textareaProps.maxLength != null ? (
        <FormLayout.Helper>
          {field.value?.trim().length ?? 0} / {textareaProps.maxLength}
        </FormLayout.Helper>
      ) : null}
    </FormLayout.Field>
  );
}
