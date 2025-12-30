import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { Form } from "#i/core/form-elements/form";
import { RequiredStar } from "#i/core/form-elements/required-star";
import { Switch } from "#i/core/form-elements/switch";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldSwitch({
  field,
  label,
  helper,
  ...props
}: Pick<React.ComponentPropsWithoutRef<typeof Switch>, "required"> & {
  field: FieldMetadata<undefined | boolean>;
  label: React.ReactNode;
  helper?: React.ReactNode;
}) {
  return (
    <Form.Field isInline>
      <Form.Label htmlFor={field.id}>
        {label} {field.required || props.required ? <RequiredStar /> : null}
      </Form.Label>

      <Switch {...getInputProps(field, { type: "checkbox" })} {...props} />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
