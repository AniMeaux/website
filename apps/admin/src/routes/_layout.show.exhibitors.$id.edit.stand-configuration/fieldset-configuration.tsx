import { FieldInput } from "#core/form-elements/field-input";
import { FieldOnOff } from "#core/form-elements/field-on-off";
import { FieldRadios } from "#core/form-elements/field-radios";
import { Form } from "#core/form-elements/form";
import { Card } from "#core/layout/card";
import { DividerType } from "#show/exhibitors/stand-configuration/divider";
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { StandSize } from "#show/exhibitors/stand-configuration/stand-size";
import { StandZone } from "#show/exhibitors/stand-configuration/stand-zone";
import { useForm } from "./form";

export function FieldsetConfiguration() {
  const { fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Configuration</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldRadios
            label="Taille du stand"
            field={fields.size}
            getLabel={(size) => StandSize.translation[size]}
            options={StandSize.values}
          />

          <Form.Row>
            <FieldRadios
              label="Emplacement"
              field={fields.zone}
              getLabel={(zone) => StandZone.translation[zone]}
              options={StandZone.values}
            />

            <FieldOnOff
              label="Raccordement électrique"
              field={fields.hasElectricalConnection}
            />
          </Form.Row>

          <Form.Row>
            <FieldRadios
              label="Type de cloisons"
              field={fields.dividerType}
              getLabel={(dividerType) => DividerType.translation[dividerType]}
              options={DividerType.values}
            />

            <FieldInput
              label="Nombre de cloisons"
              field={fields.dividerCount}
              inputMode="numeric"
            />
          </Form.Row>

          <Form.Row>
            <FieldInput
              label="Nombre de tables"
              field={fields.tableCount}
              inputMode="numeric"
            />

            <FieldOnOff
              label="Nappage des tables"
              field={fields.hasTablecloths}
            />
          </Form.Row>

          <Form.Row>
            <FieldInput
              label="Nombre de personnes sur le stand"
              field={fields.peopleCount}
              inputMode="numeric"
            />

            <FieldInput
              label="Nombre de chaises"
              field={fields.chairCount}
              inputMode="numeric"
            />
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
