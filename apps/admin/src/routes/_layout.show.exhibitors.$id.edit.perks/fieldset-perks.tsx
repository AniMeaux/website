import { FieldNumeric } from "#core/form-elements/field-numeric.js";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { useForm } from "./form";

export function FieldsetPerks() {
  const { fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Avantages</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldNumeric
            label="Nombre de personnes pour le petit-déjeuner du samedi"
            field={fields.breakfastPeopleCountSaturday}
          />

          <FieldNumeric
            label="Nombre de personnes pour le petit-déjeuner du dimanche"
            field={fields.breakfastPeopleCountSunday}
          />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
