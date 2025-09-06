import { FieldStepper } from "#core/form-elements/field-stepper";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FieldYesNo } from "#core/form-elements/field-yes-no";
import { FormLayout } from "#core/layout/form-layout";
import { FieldStandSize } from "#stand-size/field.js";
import type { Prisma } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { FieldDividerType } from "./field-divider-type";
import { FieldInstallationDay } from "./field-installation-day";
import { useForm } from "./form";
import { HelperPriceDetails } from "./helper-price-details";
import type { loader } from "./loader.server";

export function FieldsetStand() {
  const { standSizes, dividerTypes } = useLoaderData<typeof loader>();
  const { fields } = useForm();

  const selectedStandSize = standSizes.find(
    (standSize) => standSize.id === fields.standSize.value,
  );

  const selectedDividerType = dividerTypes.find(
    (dividerType) => dividerType.id === fields.dividerType.value,
  );

  return (
    <FormLayout.Section>
      <FormLayout.Title>Configuration de stand</FormLayout.Title>

      <FieldStandSize
        label="Taille du stand"
        field={fields.standSize}
        standSizes={standSizes}
      />

      <FieldYesNo
        label="Raccordement électrique"
        field={fields.hasElectricalConnection}
      />

      <FormLayout.Row>
        <FieldDividerType
          label="Type de cloisons"
          field={fields.dividerType}
          dividerTypes={dividerTypes}
        />

        {selectedDividerType != null ? (
          <FieldStepper
            label="Nombre de cloisons"
            field={fields.dividerCount}
            minValue={1}
            maxValue={Math.min(
              selectedDividerType.availableCount,
              selectedStandSize?.maxDividerCount ??
                getMaxValue(standSizes, "maxDividerCount"),
            )}
            helper={
              <FormLayout.Helper>
                Sous réserve de disponibilité
              </FormLayout.Helper>
            }
          />
        ) : null}
      </FormLayout.Row>

      <FieldStepper
        label="Nombre de tables"
        field={fields.tableCount}
        maxValue={
          selectedStandSize?.maxTableCount ??
          getMaxValue(standSizes, "maxTableCount")
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
          minValue={1}
          maxValue={
            selectedStandSize?.maxPeopleCount ??
            getMaxValue(standSizes, "maxPeopleCount")
          }
        />

        <FieldStepper
          label="Nombre de chaises"
          field={fields.chairCount}
          minValue={1}
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

      <FieldTextarea
        label="Commentaire sur votre choix d’emplacement"
        field={fields.placementComment}
        rows={3}
      />

      <HelperPriceDetails />
    </FormLayout.Section>
  );
}

function getMaxValue(
  standSizes: Prisma.ShowStandSizeGetPayload<{
    select: {
      maxDividerCount: true;
      maxPeopleCount: true;
      maxTableCount: true;
    };
  }>[],
  property: keyof (typeof standSizes)[number],
): number {
  return Math.max(...standSizes.map((standSize) => standSize[property]));
}
