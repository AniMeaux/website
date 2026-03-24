import type { FieldMetadata } from "@conform-to/react"

import { FieldTextarea } from "#i/core/form-elements/field-textarea.js"
import { Form } from "#i/core/form-elements/form.js"
import { Card } from "#i/core/layout/card.js"

import { useForm } from "./form.js"

export function FieldsetDescription() {
  const { fields } = useForm()

  const fieldDescription = fields.description as FieldMetadata<
    undefined | string
  >

  return (
    <Card>
      <Card.Header>
        <Card.Title>Description</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldTextarea
            label="Description"
            field={fieldDescription}
            rows={5}
          />
        </Form.Fields>
      </Card.Content>
    </Card>
  )
}
