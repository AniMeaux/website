import { FieldTextarea } from "#i/core/form-elements/field-textarea";
import { FormLayout } from "#i/core/layout/form-layout";
import type { ActivityField } from "#i/exhibitors/activity-field/activity-field.js";
import type { LegalStatus } from "#i/exhibitors/application/legal-status.js";
import { ExhibitorCategory } from "#i/exhibitors/category.js";
import { FieldStandSize } from "#i/stand-size/field.js";
import { ensureArray } from "@animeaux/core";
import type { FieldMetadata } from "@conform-to/react";
import { useLoaderData } from "@remix-run/react";
import { FieldsetId, useFieldsets } from "./form";
import type { loader } from "./loader.server";

export function FieldsetParticipation() {
  const { standSizes } = useLoaderData<typeof loader>();
  const { fieldsets } = useFieldsets();

  const fieldset = fieldsets.participation.getFieldset();
  const fieldsetStructure = fieldsets.structure.getFieldset();

  const selectedLegalStatus = fieldsetStructure.legalStatus.value as
    | undefined
    | LegalStatus.Enum;

  const selectedActivityFields = ensureArray(
    fieldsetStructure.activityFields.value as
      | undefined
      | ActivityField.Enum
      | ActivityField.Enum[],
  );

  const category =
    selectedLegalStatus == null
      ? ExhibitorCategory.Enum.SHOP
      : ExhibitorCategory.get({
          legalStatus: selectedLegalStatus,
          activityFields: selectedActivityFields,
        });

  const standSizesOptions = standSizes.filter((standSize) =>
    standSize.allowedCategories.includes(category),
  );

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
