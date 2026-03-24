import { FieldEmail } from "#i/core/form-elements/field-email.js"
import { FieldPhone } from "#i/core/form-elements/field-phone.js"
import { FieldText } from "#i/core/form-elements/field-text.js"
import { FormLayout } from "#i/core/layout/form-layout.js"

import { FieldsetId, useFieldsets } from "./form.js"

export function FieldsetContact() {
  const { fieldsets } = useFieldsets()
  const fieldset = fieldsets.contact.getFieldset()

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
  )
}
