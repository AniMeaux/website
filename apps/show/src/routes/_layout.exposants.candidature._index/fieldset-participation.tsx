import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { ActivityField } from "#exhibitors/activity-field/activity-field.js";
import { FieldStandSize } from "#exhibitors/stand-size/field";
import { ensureArray } from "@animeaux/core";
import type { FieldMetadata } from "@conform-to/react";
import { useLoaderData } from "@remix-run/react";
import { FieldsetId, useFieldsets } from "./form";
import type { loader } from "./loader.server";

export function FieldsetParticipation() {
  const { standSizes } = useLoaderData<typeof loader>();
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.participation.getFieldset();

  const selectedActivityFields = ensureArray(
    fieldsets.structure.getFieldset().activityFields.value as
      | undefined
      | ActivityField.Enum
      | ActivityField.Enum[],
  );

  const hasLimitedStandSize = selectedActivityFields.some(
    (selectedActivityField) =>
      ActivityField.valuesWithLimitedStandSizes.includes(selectedActivityField),
  );

  const standSizesOptions = hasLimitedStandSize
    ? standSizes.filter((standSize) => !standSize.isRestrictedByActivityField)
    : standSizes;

  return (
    <FormLayout.Section id={FieldsetId.PARTICIPATION}>
      <FormLayout.Title>Participation</FormLayout.Title>

      <FieldStandSize
        label="Taille du stand souhaité"
        field={fieldset.desiredStandSizeId}
        standSizes={standSizesOptions}
      />

      <FieldTextarea
        label="Aimeriez-vous proposer une animation sur scène dans le cadre de la
        sensibilisation au bien-être animal ? Si oui, merci de préciser
        ci-dessous."
        field={
          fieldset.proposalForOnStageEntertainment as FieldMetadata<
            undefined | string
          >
        }
        rows={3}
        helper="Sous réserve de disponibilité"
      />
    </FormLayout.Section>
  );
}
