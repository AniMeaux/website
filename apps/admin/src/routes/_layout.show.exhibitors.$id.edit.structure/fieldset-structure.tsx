import { FieldText } from "#i/core/form-elements/field-text.js"
import { Form } from "#i/core/form-elements/form.js"
import { Card } from "#i/core/layout/card.js"

import { useForm } from "./form.js"

export function FieldsetStructure() {
  const { fields } = useForm()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Structure</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldText label="Nom" field={fields.name} />
        </Form.Fields>
      </Card.Content>
    </Card>
  )
}
