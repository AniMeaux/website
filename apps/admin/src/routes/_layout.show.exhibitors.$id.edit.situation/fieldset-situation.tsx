import { FieldOnOff } from "#i/core/form-elements/field-on-off.js"
import { FieldRadios } from "#i/core/form-elements/field-radios.js"
import { FieldText } from "#i/core/form-elements/field-text.js"
import { Form } from "#i/core/form-elements/form.js"
import { Card } from "#i/core/layout/card.js"
import { Separator } from "#i/core/layout/separator.js"
import { Visibility } from "#i/show/visibility.js"

import { useForm } from "./form.js"

export function FieldsetSituation() {
  const { form, fields } = useForm()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Errors errors={form.errors} />

          <FieldRadios
            label="Visibilité"
            field={fields.isVisible}
            getLabel={(visibility) => Visibility.translation[visibility]}
            options={Visibility.values}
          />

          <FieldOnOff label="Organisateur" field={fields.isOrganizer} />

          <Form.Row>
            <FieldOnOff
              label="Lauréat Coup de cœur"
              field={fields.isOrganizersFavorite}
            />

            <FieldOnOff label="Lauréat Espoir" field={fields.isRisingStar} />
          </Form.Row>

          <Separator />

          <Form.Row>
            <FieldText
              label="Numéro d’emplacement"
              field={fields.locationNumber}
            />

            <FieldText label="Numéro de stand" field={fields.standNumber} />
          </Form.Row>
        </Form.Fields>
      </Card.Content>
    </Card>
  )
}
