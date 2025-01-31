import { FieldSelectorsRadio } from "#core/form-elements/field-selectors-radio";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { ProfileStatus } from "#show/exhibitors/profile/status";
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

          <FieldSelectorsRadio
            label="Statut"
            field={fields.status}
            getLabel={(status) => ProfileStatus.translation[status]}
            options={ProfileStatus.values}
          />

          {fields.status.value === ProfileStatus.Enum.TO_MODIFY ? (
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
