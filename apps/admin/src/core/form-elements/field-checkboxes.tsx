import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { InputChoice, InputsChoices } from "#core/form-elements/input-choice";
import { RequiredStar } from "#core/form-elements/required-star";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export function FieldCheckboxes<TValue extends string>({
  field,
  options,
  getLabel,
  label,
  required = false,
  helper,
}: {
  field: FieldMetadata<TValue[]>;
  options: TValue[];
  getLabel: (value: TValue) => string;
  label: React.ReactNode;
  required?: boolean;
  helper?: React.ReactNode;
}) {
  return (
    <Form.Field>
      <Form.Label>
        {label} {field.required || required ? <RequiredStar /> : null}
      </Form.Label>

      <InputsChoices>
        {getCollectionProps(field, { type: "checkbox", options }).map(
          ({ key, ...props }) => (
            <InputChoice.Root key={key}>
              <InputChoice.Checkbox {...props} />

              <InputChoice.Label>
                {getLabel(props.value as TValue)}
              </InputChoice.Label>
            </InputChoice.Root>
          ),
        )}
      </InputsChoices>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
