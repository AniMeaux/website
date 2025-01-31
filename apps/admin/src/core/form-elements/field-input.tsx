import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RequiredStar } from "#core/form-elements/required-star";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldInput({
  field,
  label,
  helper,
  ...props
}: Pick<
  React.ComponentPropsWithoutRef<"input">,
  "inputMode" | "pattern" | "placeholder" | "required"
> & {
  field: FieldMetadata<string | number>;
  label: React.ReactNode;
  helper?: React.ReactNode;
}) {
  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required || props.required ? <RequiredStar /> : null}
      </Form.Label>

      <Input {...getInputProps(field, { type: "text" })} {...props} />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
