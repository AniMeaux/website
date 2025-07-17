import { FieldEmail } from "#core/form-elements/field-email";
import { FieldPhone } from "#core/form-elements/field-phone";
import { FieldText } from "#core/form-elements/field-text";
import { FormLayout } from "#core/layout/form-layout";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetContact() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.contact.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.CONTACT}>
      <FormLayout.Title>Contact</FormLayout.Title>

      <FormLayout.Row>
        <FieldText label="Nom" field={fieldset.lastname} />
        <FieldText label="Prénom" field={fieldset.firstname} />
      </FormLayout.Row>

      <FieldEmail label="Adresse e-mail" field={fieldset.email} />
      <FieldPhone label="Numéro de téléphone" field={fieldset.phone} />
    </FormLayout.Section>
  );
}
