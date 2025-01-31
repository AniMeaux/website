import { ActionIcon } from "#core/actions/action";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import { FieldActivityField } from "#exhibitors/activity-field/field";
import { FieldActivityTarget } from "#exhibitors/activity-target/field";
import { FieldLogo } from "#exhibitors/field-logo";
import { Icon } from "#generated/icon";
import { withoutKey } from "@animeaux/core";
import { getInputProps } from "@conform-to/react";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./route";

export function FieldsetPublicProfile() {
  const { profile } = useLoaderData<typeof loader>();
  const { fields } = useForm();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Profil public</FormLayout.Title>

      <FieldLogo
        label="Logo"
        field={fields.logo}
        defaultLogo={{ path: profile.logoPath, alt: profile.name }}
      />

      <FieldActivityTarget label="Cibles" field={fields.activityTargets} />

      <FieldActivityField
        label="Domaines d’activités"
        field={fields.activityFields}
      />

      <FieldLinks />
    </FormLayout.Section>
  );
}

function FieldLinks() {
  const { form, fields } = useForm();
  const fieldsLinks = fields.links.getFieldList();

  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={fieldsLinks[0]?.id}>
        Liens du site internet ou réseaux sociaux
      </FormLayout.Label>

      <FormLayout.InputList.Root>
        {fieldsLinks.map((fieldLink, index) => (
          <FormLayout.InputList.Row key={fieldLink.key}>
            <FormLayout.Input
              {...withoutKey(getInputProps(fieldLink, { type: "url" }))}
            />

            <ActionIcon
              {...form.remove.getButtonProps({
                index,
                name: fields.links.name,
              })}
              // There's always at least one link.
              disabled={fieldsLinks.length === 1}
              color="alabaster"
            >
              <Icon id="x-mark-light" />
            </ActionIcon>

            <FieldErrorHelper field={fieldLink} className="col-span-2" />
          </FormLayout.InputList.Row>
        ))}

        <FormLayout.InputList.Action
          {...form.insert.getButtonProps({ name: fields.links.name })}
        >
          Ajouter un lien
        </FormLayout.InputList.Action>
      </FormLayout.InputList.Root>

      <FieldErrorHelper field={fields.links} />
    </FormLayout.Field>
  );
}
