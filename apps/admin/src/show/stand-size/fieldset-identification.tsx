import { FieldText } from "#i/core/form-elements/field-text.js";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import type { FieldMetadata, FormMetadata } from "@conform-to/react";

export function FieldsetIdentification({
  form,
  fields,
}: {
  form: { errors: FormMetadata["errors"] };
  fields: {
    label: FieldMetadata<string>;
  };
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Identification</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Errors errors={form.errors} />

          <FieldText label="Label" field={fields.label} />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
