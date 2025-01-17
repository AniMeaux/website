import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { useForm } from "./form";

export function FieldsetDescription() {
  const { fields } = useForm();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Description</FormLayout.Title>

      <HelperCard.Root color="alabaster">
        <p>
          Cette description nous servira de base pour nos publications sur les
          réseaux sociaux.
        </p>
      </HelperCard.Root>

      <FieldTextarea label="Description" field={fields.description} rows={5} />
    </FormLayout.Section>
  );
}
