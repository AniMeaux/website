import { DynamicImage } from "#core/data-display/image";
import { FieldCheckboxes } from "#core/form-elements/field-checkboxes";
import { FieldList } from "#core/form-elements/field-list";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RequiredStar } from "#core/form-elements/required-star";
import { Card } from "#core/layout/card";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ImageUrl, withoutKey } from "@animeaux/core";
import { getInputProps } from "@conform-to/react";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./route";

export function FieldsetProfile() {
  const { form, fields } = useForm();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profil public</Card.Title>
      </Card.Header>

      <Card.Content>
        <Form.Fields>
          <FieldLogo />

          <FieldCheckboxes
            label="Cibles"
            field={fields.activityTargets}
            options={ActivityTarget.values}
            getLabel={(activityTarget) =>
              ActivityTarget.translation[activityTarget]
            }
          />

          <FieldCheckboxes
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

function FieldLogo() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <Form.Field>
      <Form.Label>
        Logo <RequiredStar />
      </Form.Label>

      <DynamicImage
        imageId={ImageUrl.parse(profile.logoPath).id}
        alt={profile.name}
        sizeMapping={{ default: "100vw", md: "600px" }}
        fallbackSize="1024"
        background="none"
        className="w-full rounded-2 border border-gray-200"
      />
    </Form.Field>
  );
}
