import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FieldText } from "#core/form-elements/field-text";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { DiscoverySource } from "#exhibitors/application/discovery-source";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetComments() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.comments.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.COMMENTS}>
      <FormLayout.Title>Commentaires</FormLayout.Title>

      <FieldTextarea
        label="Pourquoi souhaitez-vous exposer au Salon des Ani’Meaux ?"
        field={fieldset.motivation as FieldMetadata<string>}
        rows={3}
        hideCaracterCount
      />

      <FieldDiscoverySource />

      {fieldset.discoverySource.value === DiscoverySource.Enum.OTHER ? (
        <FieldText
          label="Préciser votre réponse"
          field={fieldset.discoverySourceOther}
        />
      ) : null}

      <FieldTextarea
        label="Remarques"
        field={fieldset.comments as FieldMetadata<undefined | string>}
        rows={3}
      />
    </FormLayout.Section>
  );
}

function FieldDiscoverySource() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.comments.getFieldset().discoverySource;

  return (
    <FormLayout.Field>
      <FormLayout.Label>Comment avez-vous connu le salon ?</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="300px">
        {getCollectionProps(field, {
          type: "radio",
          options: DiscoverySource.values,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {DiscoverySource.translation[props.value as DiscoverySource.Enum]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
