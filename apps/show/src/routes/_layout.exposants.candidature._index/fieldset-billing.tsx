import { FieldNumeric } from "#core/form-elements/field-numeric";
import { FieldSwitch } from "#core/form-elements/field-switch";
import { FieldText } from "#core/form-elements/field-text";
import { FormLayout } from "#core/layout/form-layout";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetBilling() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.billing.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.BILLING}>
      <FormLayout.Title>Facturation</FormLayout.Title>

      <FieldSwitch
        label="Utiliser l’adresse de domiciliation pour la facturation"
        field={fieldset.sameAsStructure}
      />

      {fieldset.sameAsStructure.value !== "on" ? (
        <FieldText label="Adresse de facturation" field={fieldset.address} />
      ) : null}

      {fieldset.sameAsStructure.value !== "on" ? (
        <FormLayout.Row>
          <FieldNumeric label="Code postal" field={fieldset.zipCode} />
          <FieldText label="Ville" field={fieldset.city} />
          <FieldText label="Pays" field={fieldset.country} />
        </FormLayout.Row>
      ) : null}
    </FormLayout.Section>
  );
}
