import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RequiredStar } from "#core/form-elements/required-star";
import { Icon } from "#generated/icon.js";
import type { FieldMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldDate({
  field,
  label,
  helper,
  hasTime = false,
}: {
  field: FieldMetadata<Date>;
  label: React.ReactNode;
  helper?: React.ReactNode;
  hasTime?: boolean;
}) {
  const inputProps = getInputProps(field, {
    type: hasTime ? "datetime-local" : "date",
  });

  return (
    <Form.Field>
      <Form.Label htmlFor={field.id}>
        {label} {field.required ? <RequiredStar /> : null}
      </Form.Label>

      <Input
        {...inputProps}
        // Make sure to recreate the DOM element because the native values
        // don't have the same format between date and datetime-local and
        // triggers the following warning:
        // The specified value "2023-01-01T00:00" does not conform to the
        // required format, "yyyy-MM-dd".
        key={[inputProps.key, String(hasTime)].filter(Boolean).join("-")}
        leftAdornment={
          <Input.Adornment>
            <Icon href="icon-calendar-days-light" />
          </Input.Adornment>
        }
      />

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
