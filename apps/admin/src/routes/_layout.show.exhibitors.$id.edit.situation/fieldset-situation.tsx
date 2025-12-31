import { FieldOnOff } from "#i/core/form-elements/field-on-off.js";
import { FieldRadios } from "#i/core/form-elements/field-radios";
import { FieldText } from "#i/core/form-elements/field-text";
import { Form } from "#i/core/form-elements/form";
import { Card } from "#i/core/layout/card";
import { Separator } from "#i/core/layout/separator";
import { Visibility } from "#i/show/visibility";
import { useForm } from "./form";

export function FieldsetSituation() {
  const { form, fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <Form.Errors errors={form.errors} />

          <FieldRadios
            label="Visibilité"
            field={fields.isVisible}
            getLabel={(visibility) => Visibility.translation[visibility]}
            options={Visibility.values}
          />

          <FieldOnOff label="Organisateur" field={fields.isOrganizer} />

          <Form.Row>
            <FieldOnOff
              label="Lauréat Coup de cœur"
              field={fields.isOrganizersFavorite}
            />

            <FieldOnOff label="Lauréat Espoir" field={fields.isRisingStar} />
          </Form.Row>

          <Separator />

          <Form.Row>
            <FieldText
              label="Numéro d’emplacement"
              field={fields.locationNumber}
            />

            <FieldText label="Numéro de stand" field={fields.standNumber} />
          </Form.Row>
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
