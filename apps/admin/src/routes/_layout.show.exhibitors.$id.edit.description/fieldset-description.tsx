import { FieldTextarea } from "#i/core/form-elements/field-textarea";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import type { FieldMetadata } from "@conform-to/react";
import { useForm } from "./form";

export function FieldsetDescription() {
  const { fields } = useForm();

  const fieldDescription = fields.description as FieldMetadata<
    undefined | string
  >;

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
  );
}
