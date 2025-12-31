import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { FieldNumeric } from "#i/core/form-elements/field-numeric";
import { FieldSwitch } from "#i/core/form-elements/field-switch.js";
import { FieldText } from "#i/core/form-elements/field-text";
import { FieldTextarea } from "#i/core/form-elements/field-textarea.js";
import { FieldUrl } from "#i/core/form-elements/field-url";
import { FormLayout } from "#i/core/layout/form-layout";
import { FieldActivityField } from "#i/exhibitors/activity-field/field";
import { FieldActivityTarget } from "#i/exhibitors/activity-target/field";
import { LegalStatus } from "#i/exhibitors/application/legal-status";
import { FieldLogo } from "#i/exhibitors/field-logo";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetStructure() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.structure.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.STRUCTURE}>
      <FormLayout.Title>Structure</FormLayout.Title>

      <FieldText label="Nom" field={fieldset.name} />

      <FieldUrl
        label="Lien du site internet ou réseau social"
        field={fieldset.url}
      />

      <FieldLegalStatus />

      {fieldset.legalStatus.value === LegalStatus.Enum.OTHER ? (
        <FieldText
          label="Précisez la forme juridique"
          field={fieldset.legalStatusOther}
        />
      ) : null}

      <FieldText
        label="Numéro de SIRET ou tout autre numéro d’identification de la structure"
        field={fieldset.siret}
      />

      <FieldText label="Adresse de domiciliation" field={fieldset.address} />

      <FormLayout.Row>
        <FieldNumeric label="Code postal" field={fieldset.zipCode} />
        <FieldText label="Ville" field={fieldset.city} />
        <FieldText label="Pays" field={fieldset.country} />
      </FormLayout.Row>

      <FieldSwitch
        label="Je possède une responsabilité civile professionnelle"
        field={fieldset.haveCivilLiability}
      />

      <FieldTextarea
        label="Présentation de l’activité"
        field={fieldset.activityDescription as FieldMetadata<string>}
        rows={3}
      />

      <FieldActivityTarget label="Cibles" field={fieldset.activityTargets} />

      <FieldActivityField
        label="Domaines d’activités"
        field={fieldset.activityFields}
      />

      <FieldLogo label="Logo" field={fieldset.logo} />
    </FormLayout.Section>
  );
}

function FieldLegalStatus() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.structure.getFieldset().legalStatus;

  return (
    <FormLayout.Field>
      <FormLayout.Label>Forme juridique</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "radio",
          options: LegalStatus.values,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {LegalStatus.translation[props.value as LegalStatus.Enum]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
