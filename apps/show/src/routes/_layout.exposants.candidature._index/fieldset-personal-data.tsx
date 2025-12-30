import { FieldSwitch } from "#i/core/form-elements/field-switch";
import { FormLayout } from "#i/core/layout/form-layout";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetPersonalData() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.personalData.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.PERSONAL_DATA}>
      <FormLayout.Title>Données Personnelles</FormLayout.Title>

      <FieldSwitch
        label="J’accepte que mes données soient utilisées pour le traitement de ma candidature"
        field={fieldset.acceptDataUsage}
      />

      <FieldSwitch
        label="J’accepte de recevoir les informations exposants"
        field={fieldset.acceptEmails}
      />
    </FormLayout.Section>
  );
}
