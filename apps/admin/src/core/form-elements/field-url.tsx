import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { Form } from "#i/core/form-elements/form";
import { Input } from "#i/core/form-elements/input";
import { RequiredStar } from "#i/core/form-elements/required-star";
import { Icon } from "#i/generated/icon.js";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldUrl({
  field,
  label,
  helper,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
  helper?: React.ReactNode;
}) {
  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required ? <RequiredStar /> : null}
      </Form.Label>

      <Input
        {...getInputProps(field, { type: "url" })}
        leftAdornment={
          <Input.Adornment>
            <Icon href="icon-globe-light" />
          </Input.Adornment>
        }
      />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
