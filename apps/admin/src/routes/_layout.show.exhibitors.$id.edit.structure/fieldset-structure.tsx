import { FieldText } from "#i/core/form-elements/field-text";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import { useForm } from "./form";

export function FieldsetStructure() {
  const { fields } = useForm();

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
  );
}
