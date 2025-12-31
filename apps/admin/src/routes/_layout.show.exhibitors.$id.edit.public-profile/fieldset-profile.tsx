import { DynamicImage } from "#i/core/data-display/image";
import { FieldCheckboxes } from "#i/core/form-elements/field-checkboxes";
import { FieldList } from "#i/core/form-elements/field-list";
import { FieldRadios } from "#i/core/form-elements/field-radios.js";
import { Form } from "#i/core/form-elements/form";
import { Input } from "#i/core/form-elements/input";
import { RequiredStar } from "#i/core/form-elements/required-star";
import { Card } from "#i/core/layout/card";
import { ActivityField } from "#i/show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#i/show/exhibitors/activity-target/activity-target";
import { ExhibitorCategory } from "#i/show/exhibitors/category.js";
import { ImageUrl, ensureArray, withoutKey } from "@animeaux/core";
import { getInputProps } from "@conform-to/react";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./route";

export function FieldsetProfile() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const { form, fields } = useForm();

  const selectedActivityFields = ensureArray(
    fields.activityFields.value as
      | undefined
      | ActivityField.Enum
      | ActivityField.Enum[],
  );

  const inferredCategory = ExhibitorCategory.get({
    legalStatus: exhibitor.application.structureLegalStatus,
    activityFields: selectedActivityFields,
  });

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

          <FieldRadios
            label="Catégorie"
            field={fields.category}
            options={ExhibitorCategory.values}
            getLabel={(category) => ExhibitorCategory.translation[category]}
            helper={
              <Form.HelperMessage>
                Permet de restreindre les tailles de stand disponibles et
                d’appliquer les prix correspondants.
                {inferredCategory !== fields.category.value ? (
                  <>
                    <br />
                    Selon les domaines d’activité et le statut juridique, la
                    catégorie proposée est :{" "}
                    <strong className="text-caption-emphasis">
                      {ExhibitorCategory.translation[inferredCategory]}
                    </strong>
                    .
                  </>
                ) : null}
              </Form.HelperMessage>
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
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Form.Field>
      <Form.Label>
        Logo <RequiredStar />
      </Form.Label>

      <DynamicImage
        imageId={ImageUrl.parse(exhibitor.logoPath).id}
        alt={exhibitor.name}
        sizeMapping={{ default: "100vw", md: "600px" }}
        fallbackSize="1024"
        background="none"
        className="w-full rounded-2 border border-gray-200"
      />
    </Form.Field>
  );
}
