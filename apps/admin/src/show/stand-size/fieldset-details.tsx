import { FieldNumeric } from "#core/form-elements/field-numeric.js";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input.js";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon.js";
import type { FieldMetadata } from "@conform-to/react";

export function FieldsetDetails({
  bookedCount,
  fields,
}: {
  bookedCount: number;
  fields: {
    area: FieldMetadata<number>;
    maxCount: FieldMetadata<number>;
    maxDividerCount: FieldMetadata<number>;
    maxPeopleCountAdditional: FieldMetadata<number>;
    maxPeopleCountIncluded: FieldMetadata<number>;
    maxTableCount: FieldMetadata<number>;
  };
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Détails</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldNumeric
            label="Surface"
            field={fields.area}
            helper={<Form.HelperMessage>En m²</Form.HelperMessage>}
            leftAdornment={
              <Input.Adornment>
                <Icon href="icon-expand-light" />
              </Input.Adornment>
            }
          />

          <FieldNumeric
            label="Nombre maximum de stands"
            field={fields.maxCount}
            helper={
              <Form.HelperMessage>
                Il y en a actuellement {bookedCount}
              </Form.HelperMessage>
            }
            leftAdornment={
              <Input.Adornment>
                <Icon href="icon-store-light" />
              </Input.Adornment>
            }
          />

          <Form.Row>
            <FieldNumeric
              label="Personnes incluses"
              field={fields.maxPeopleCountIncluded}
              helper={
                <Form.HelperMessage>
                  Nombre maximum de personnes comprises dans le prix du stand
                </Form.HelperMessage>
              }
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-people-group-light" />
                </Input.Adornment>
              }
            />

            <FieldNumeric
              label="Personnes supplémentaires"
              field={fields.maxPeopleCountAdditional}
              helper={
                <Form.HelperMessage>
                  Nombre maximum de personnes additionnelles possibles avec un
                  bracelet exposant (option payante)
                </Form.HelperMessage>
              }
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-people-group-plus-light" />
                </Input.Adornment>
              }
            />
          </Form.Row>

          <Form.Row>
            <FieldNumeric
              label="Nombre maximum de tables"
              field={fields.maxTableCount}
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-table-picnic-light" />
                </Input.Adornment>
              }
            />

            <FieldNumeric
              label="Nombre maximum de cloisons"
              field={fields.maxDividerCount}
              leftAdornment={
                <Input.Adornment>
                  <Icon href="icon-fence-light" />
                </Input.Adornment>
              }
            />
          </Form.Row>
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
