import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { Form } from "#i/core/form-elements/form";
import { InputChoice, InputsChoices } from "#i/core/form-elements/input-choice";
import { RequiredStar } from "#i/core/form-elements/required-star";
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

  export function toBoolean(value?: Enum) {
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
      <Form.Label>
        {label} {field.required || required ? <RequiredStar /> : null}
      </Form.Label>

      <InputsChoices>
        {getCollectionProps(field, {
          type: "radio",
          options: OnOff.values,
        }).map(({ key, ...props }) => (
          <InputChoice.Root key={key}>
            <InputChoice.Radio {...props} />

            <InputChoice.Label>
              {OnOff.translation[props.value as OnOff.Enum]}
            </InputChoice.Label>
          </InputChoice.Root>
        ))}
      </InputsChoices>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </Form.Field>
  );
}
