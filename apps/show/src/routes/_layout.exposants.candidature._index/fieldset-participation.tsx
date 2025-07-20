import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { FieldStandSize } from "#exhibitors/stand-size/field";
import { ensureArray } from "@animeaux/core";
import type { FieldMetadata } from "@conform-to/react";
import type { ShowActivityField } from "@prisma/client";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetParticipation() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.participation.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.PARTICIPATION}>
      <FormLayout.Title>Participation</FormLayout.Title>

      <FieldStandSize
        label="Taille du stand souhaité"
        field={fieldset.desiredStandSize}
        selectedActivityFields={ensureArray(
          fieldsets.structure.getFieldset().activityFields.value as
            | undefined
            | ShowActivityField
            | ShowActivityField[],
        )}
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
      />
    </FormLayout.Section>
  );
}
