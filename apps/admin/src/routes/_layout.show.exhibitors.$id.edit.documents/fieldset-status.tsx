import { FieldRadios } from "#i/core/form-elements/field-radios";
import { FieldTextarea } from "#i/core/form-elements/field-textarea";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
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
            getLabel={(status) => ExhibitorStatus.translation[status]}
            options={ExhibitorStatus.values}
          />

          {fields.status.value === ExhibitorStatus.Enum.TO_MODIFY ? (
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
