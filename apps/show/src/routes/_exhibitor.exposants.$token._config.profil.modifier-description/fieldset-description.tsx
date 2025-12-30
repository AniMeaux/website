import { FieldTextarea } from "#i/core/form-elements/field-textarea";
import { FormLayout } from "#i/core/layout/form-layout";
import { HelperCard } from "#i/core/layout/helper-card";
import type { FieldMetadata } from "@conform-to/react";
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

      <FieldTextarea
        label="Description"
        field={fields.description as FieldMetadata<string>}
        rows={5}
      />
    </FormLayout.Section>
  );
}
