import { FieldText } from "#core/form-elements/field-text";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetComments() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.comments.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.COMMENTS}>
      <FormLayout.Title>Commentaires</FormLayout.Title>

      <FieldTextarea
        label="Pourquoi souhaitez-vous exposer au Salon des Ani’Meaux ?"
        field={fieldset.motivation as FieldMetadata<string>}
        rows={3}
        hideCaracterCount
      />

      <FieldText
        label="Comment avez-vous connu le salon ?"
        field={fieldset.discoverySource}
      />

      <FieldTextarea
        label="Remarques"
        field={fieldset.comments as FieldMetadata<undefined | string>}
        rows={3}
      />
    </FormLayout.Section>
  );
}
