import { ActionIcon } from "#core/actions/action";
import { withoutKey } from "#core/conform";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import { Icon } from "#generated/icon";
import type { FieldMetadata, FormMetadata } from "@conform-to/react";
import { getInputProps } from "@conform-to/react";

export function FieldLinks<TFormSchema extends Record<string, unknown>>({
  form,
  field,
  label,
}: {
  form: FormMetadata<TFormSchema>;
  field: FieldMetadata<string[]>;
  label: React.ReactNode;
}) {
  const fields = field.getFieldList();

  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={fields[0]?.id}>{label}</FormLayout.Label>

      <FormLayout.InputList.Root>
        {fields.map((fieldLink, index) => (
          <FormLayout.InputList.Row key={fieldLink.key}>
            <FormLayout.Input
              {...withoutKey(getInputProps(fieldLink, { type: "url" }))}
            />

            <ActionIcon
              {...form.remove.getButtonProps({ index, name: field.name })}
              // There's always at least one link.
              disabled={fields.length === 1}
              color="alabaster"
            >
              <Icon id="x-mark-light" />
            </ActionIcon>

            <FieldErrorHelper field={fieldLink} className="col-span-2" />
          </FormLayout.InputList.Row>
        ))}

        <FormLayout.InputList.Action
          {...form.insert.getButtonProps({ name: field.name })}
        >
          Ajouter un lien
        </FormLayout.InputList.Action>
      </FormLayout.InputList.Root>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
