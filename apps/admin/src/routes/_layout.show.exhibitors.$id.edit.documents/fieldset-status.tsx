import { FieldRadios } from "#core/form-elements/field-radios";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { DocumentsStatus } from "#show/exhibitors/documents/status";
import { useForm } from "./form";

export function FieldsetStatus() {
  const { form, fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Statut</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Errors errors={form.errors} />

          <FieldRadios
            label="Statut"
            field={fields.status}
            getLabel={(status) => DocumentsStatus.translation[status]}
            options={DocumentsStatus.values}
          />

          {fields.status.value === DocumentsStatus.Enum.TO_MODIFY ? (
            <FieldTextarea
              label="Message"
              field={fields.statusMessage}
              required
              rows={5}
            />
          ) : null}
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
