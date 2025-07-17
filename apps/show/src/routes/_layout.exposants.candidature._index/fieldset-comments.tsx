import { FieldText } from "#core/form-elements/field-text";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetComments() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.comments.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.COMMENTS}>
      <FormLayout.Title>Commentaires</FormLayout.Title>

      <FieldText
        label="Comment avez-vous connu le salon ?"
        field={fieldset.discoverySource}
      />

      <FieldTextarea label="Remarques" field={fieldset.comments} rows={3} />
    </FormLayout.Section>
  );
}
