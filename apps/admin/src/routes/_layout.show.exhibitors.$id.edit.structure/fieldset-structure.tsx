import { FieldInput } from "#core/form-elements/field-input";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
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
          <FieldInput label="Nom" field={fields.name} />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
