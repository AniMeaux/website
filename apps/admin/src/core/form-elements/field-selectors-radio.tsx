import { FieldChoice, FieldChoices } from "#core/form-elements/field-choice";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { RequiredStar } from "#core/form-elements/required-star";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export function FieldSelectorsRadio<TValue extends string>({
  field,
  options,
  getLabel,
  label,
  required = false,
  helper,
}: {
  field: FieldMetadata<TValue>;
  options: TValue[];
  getLabel: (value: TValue) => string;
  label: React.ReactNode;
  required?: boolean;
  helper?: React.ReactNode;
}) {
  return (
    <Form.Field>
      <Form.Label asChild>
        <span>
          {label} {field.required || required ? <RequiredStar /> : null}
        </span>
      </Form.Label>

      <FieldChoices>
        {getCollectionProps(field, { type: "radio", options }).map(
          ({ key, ...props }) => (
            <FieldChoice.Root key={key}>
              <FieldChoice.InputRadio {...props} />

              <FieldChoice.Label>
                {getLabel(props.value as TValue)}
              </FieldChoice.Label>
            </FieldChoice.Root>
          ),
        )}
      </FieldChoices>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
