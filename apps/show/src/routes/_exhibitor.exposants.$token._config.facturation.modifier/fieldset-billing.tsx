import { FieldNumeric } from "#core/form-elements/field-numeric";
import { FieldSwitch } from "#core/form-elements/field-switch";
import { FieldText } from "#core/form-elements/field-text";
import { FormLayout } from "#core/layout/form-layout";
import { useForm } from "./form";

export function FieldsetBilling() {
  const { fields } = useForm();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Adresse de facturation</FormLayout.Title>

      <FieldSwitch
        label="Utiliser l’adresse de domiciliation pour la facturation"
        field={fields.sameAsStructure}
      />

      {fields.sameAsStructure.value !== "on" ? (
        <FieldText label="Adresse de facturation" field={fields.address} />
      ) : null}

      {fields.sameAsStructure.value !== "on" ? (
        <FormLayout.Row>
          <FieldNumeric label="Code postal" field={fields.zipCode} />
          <FieldText label="Ville" field={fields.city} />
          <FieldText label="Pays" field={fields.country} />
        </FormLayout.Row>
      ) : null}
    </FormLayout.Section>
  );
}
