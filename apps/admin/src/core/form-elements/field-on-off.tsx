import { FieldChoice, FieldChoices } from "#core/form-elements/field-choice";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { Form } from "#core/form-elements/form";
import { RequiredStar } from "#core/form-elements/required-star";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export namespace OnOff {
  export const Enum = {
    ON: "ON",
    OFF: "OFF",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const values = [Enum.ON, Enum.OFF];

  export const translation: Record<Enum, string> = {
    [Enum.ON]: "Oui",
    [Enum.OFF]: "Non",
  };

  export function fromBoolean(value: boolean) {
    return value ? Enum.ON : Enum.OFF;
  }

  export function toBoolean(value: Enum) {
    return value === Enum.ON;
  }
}

export function FieldOnOff({
  field,
  label,
  required = false,
  helper,
}: {
  field: FieldMetadata<OnOff.Enum>;
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
        {getCollectionProps(field, {
          type: "radio",
          options: OnOff.values,
        }).map(({ key, ...props }) => (
          <FieldChoice.Root key={key}>
            <FieldChoice.InputRadio {...props} />

            <FieldChoice.Label>
              {OnOff.translation[props.value as OnOff.Enum]}
            </FieldChoice.Label>
          </FieldChoice.Root>
        ))}
      </FieldChoices>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
