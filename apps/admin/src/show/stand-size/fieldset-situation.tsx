import type { FieldMetadata } from "@conform-to/react"

import { FieldRadios } from "#i/core/form-elements/field-radios.js"
import { Form } from "#i/core/form-elements/form"
import { Card } from "#i/core/layout/card"
import { Visibility } from "#i/show/visibility.js"

export function FieldsetSituation({
  fields,
}: {
  fields: {
    isVisible: FieldMetadata<Visibility.Enum>
  }
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldRadios
            label="Visibilité"
            field={fields.isVisible}
            getLabel={(visibility) => Visibility.translation[visibility]}
            options={Visibility.values}
          />
        </Form.Fields>
      </Card.Content>
    </Card>
  )
}
