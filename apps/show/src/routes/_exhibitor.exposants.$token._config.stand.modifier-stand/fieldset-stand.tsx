import { FieldStepper } from "#core/form-elements/field-stepper";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FieldYesNo } from "#core/form-elements/field-yes-no";
import { FormLayout } from "#core/layout/form-layout";
import {
  MAX_DIVIDER_COUNT,
  MAX_DIVIDER_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/divider-count";
import { FieldStandSize } from "#exhibitors/stand-size/field";
import {
  MAX_PEOPLE_COUNT,
  MAX_PEOPLE_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/people-count";
import type { StandSize } from "#exhibitors/stand-size/stand-size.js";
import {
  MAX_TABLE_COUNT,
  MAX_TABLE_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/table-count";
import { useLoaderData } from "@remix-run/react";
import { FieldDividerType } from "./field-divider-type";
import { FieldInstallationDay } from "./field-installation-day";
import { FieldStandZone } from "./field-stand-zone";
import { useForm } from "./form";
import type { loader } from "./route";

export function FieldsetStand() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const { fields } = useForm();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Configuration de stand</FormLayout.Title>

      <FieldStandSize
        label="Taille du stand"
        field={fields.size}
        selectedActivityFields={exhibitor.activityFields}
      />

      <FieldYesNo
        label="Raccordement électrique"
        field={fields.hasElectricalConnection}
      />

      <FormLayout.Row>
        <FieldDividerType label="Type de cloisons" field={fields.dividerType} />

        <FieldStepper
          label="Nombre de cloisons"
          field={fields.dividerCount}
          maxValue={
            fields.size.value == null
              ? MAX_DIVIDER_COUNT
              : MAX_DIVIDER_COUNT_BY_STAND_SIZE[
                  fields.size.value as StandSize.Enum
                ]
          }
          helper={
            <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
          }
        />
      </FormLayout.Row>

      <FieldStepper
        label="Nombre de tables"
        field={fields.tableCount}
        maxValue={
          fields.size.value == null
            ? MAX_TABLE_COUNT
            : MAX_TABLE_COUNT_BY_STAND_SIZE[fields.size.value as StandSize.Enum]
        }
        helper={
          <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
        }
      />

      <FieldYesNo label="Nappage des tables" field={fields.hasTablecloths} />

      <FormLayout.Row>
        <FieldStepper
          label="Nombre de personnes sur le stand"
          field={fields.peopleCount}
          maxValue={
            fields.size.value == null
              ? MAX_PEOPLE_COUNT
              : MAX_PEOPLE_COUNT_BY_STAND_SIZE[
                  fields.size.value as StandSize.Enum
                ]
          }
        />

        <FieldStepper
          label="Nombre de chaises"
          field={fields.chairCount}
          maxValue={
            isNaN(Number(fields.peopleCount.value))
              ? undefined
              : Number(fields.peopleCount.value)
          }
        />
      </FormLayout.Row>

      <FieldInstallationDay
        label="Jour d’installation"
        field={fields.installationDay}
      />

      <FieldStandZone label="Emplacement" field={fields.zone} />

      <FieldTextarea
        label="Commentaire sur votre choix d’emplacement"
        field={fields.placementComment}
        rows={3}
      />
    </FormLayout.Section>
  );
}
