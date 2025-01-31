import { FieldList } from "#core/form-elements/field-list";
import { FieldSelectorsCheckbox } from "#core/form-elements/field-selectors-checkbox";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { Card } from "#core/layout/card";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { withoutKey } from "@animeaux/core";
import { getInputProps } from "@conform-to/react";
import { useForm } from "./form";

export function FieldsetProfile() {
  const { form, fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profil public</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldSelectorsCheckbox
            label="Cibles"
            field={fields.activityTargets}
            options={ActivityTarget.values}
            getLabel={(activityTarget) =>
              ActivityTarget.translation[activityTarget]
            }
          />

          <FieldSelectorsCheckbox
            label="Domaines d’activités"
            field={fields.activityFields}
            options={ActivityField.values}
            getLabel={(activityField) =>
              ActivityField.translation[activityField]
            }
          />

          <FieldList
            label="Liens du site internet ou réseaux sociaux"
            form={form}
            field={fields.links}
            labelAddMore="Ajouter un lien"
          >
            {({ field }) => (
              <Input {...withoutKey(getInputProps(field, { type: "url" }))} />
            )}
          </FieldList>
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}
