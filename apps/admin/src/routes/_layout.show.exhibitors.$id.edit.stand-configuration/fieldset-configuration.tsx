import { FieldNumeric } from "#core/form-elements/field-numeric.js";
import { FieldOnOff } from "#core/form-elements/field-on-off";
import { FieldRadios } from "#core/form-elements/field-radios";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { DividerType } from "./action";
import { useForm } from "./form";
import type { loader } from "./loader.server.js";

export function FieldsetConfiguration() {
  const { standSizes, dividerTypes } = useLoaderData<typeof loader>();
  const { fields } = useForm();

  const selectedDividerType = dividerTypes.find(
    (dividerType) => dividerType.id === fields.dividerType.value,
  );

  const selectedTableCount = Number(fields.tableCount.value);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Configuration</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldRadios
            label="Taille du stand"
            field={fields.sizeId}
            getLabel={(standSizeId) => {
              const standSize = standSizes.find(
                (standSize) => standSize.id === standSizeId,
              );

              invariant(
                standSize != null,
                `Stand size not found: ${standSizeId}`,
              );

              return standSize.label;
            }}
            options={standSizes.map((standSize) => standSize.id)}
          />

          <Form.Row>
            <FieldOnOff
              label="Raccordement électrique"
              field={fields.hasElectricalConnection}
            />

            <FieldOnOff
              label="Placement privilégié (stand en angle)"
              field={fields.hasCorner}
            />
          </Form.Row>

          <Form.Row>
            <FieldRadios
              label="Type de cloisons"
              field={fields.dividerType}
              getLabel={(dividerTypeId) => {
                const dividerType = dividerTypes.find(
                  (dividerType) => dividerType.id === dividerTypeId,
                );

                return dividerType?.label ?? "Aucune cloison";
              }}
              options={[
                DividerType.none,
                ...dividerTypes.map((dividerType) => dividerType.id),
              ]}
            />

            {selectedDividerType != null ? (
              <FieldNumeric
                label="Nombre de cloisons"
                field={fields.dividerCount}
              />
            ) : null}
          </Form.Row>

          <Form.Row>
            <FieldNumeric label="Nombre de tables" field={fields.tableCount} />

            {selectedTableCount > 0 ? (
              <FieldOnOff
                label="Nappage des tables"
                field={fields.hasTableCloths}
              />
            ) : null}
          </Form.Row>

          <Form.Row>
            <FieldNumeric
              label="Nombre de personnes sur le stand"
              field={fields.peopleCount}
            />

            <FieldNumeric label="Nombre de chaises" field={fields.chairCount} />
          </Form.Row>

          <FieldRadios
            label="Jour d’installation"
            field={fields.installationDay}
            getLabel={(installationDay) =>
              InstallationDay.translation[installationDay]
            }
            options={InstallationDay.values}
          />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
