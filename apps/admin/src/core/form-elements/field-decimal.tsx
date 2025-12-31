import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { Form } from "#i/core/form-elements/form";
import { Input } from "#i/core/form-elements/input";
import { RequiredStar } from "#i/core/form-elements/required-star";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldDecimal({
  field,
  label,
  helper,
  leftAdornment,
}: {
  field: FieldMetadata<number>;
  label: React.ReactNode;
  helper?: React.ReactNode;
  leftAdornment?: React.ComponentProps<typeof Input>["leftAdornment"];
}) {
  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required ? <RequiredStar /> : null}
      </Form.Label>

      <Input
        {...getInputProps(field, { type: "text" })}
        leftAdornment={leftAdornment}
        inputMode="decimal"
      />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
