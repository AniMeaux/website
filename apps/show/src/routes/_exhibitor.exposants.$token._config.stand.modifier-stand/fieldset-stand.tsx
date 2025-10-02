import { FieldStepper } from "#core/form-elements/field-stepper";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FieldYesNo } from "#core/form-elements/field-yes-no";
import { FormLayout } from "#core/layout/form-layout";
import { Price } from "#price/price.js";
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

  const selectedTableCount = Number(fields.tableCount.value);

  const peopleCount = Number(fields.peopleCount.value);

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

      <FieldYesNo
        label="Placement privilégié (stand en angle)"
        field={fields.hasCorner}
        helper={
          <FormLayout.Helper>
            Option à {Price.format(Number(CLIENT_ENV.PRICE_CORNER_STAND))}
          </FormLayout.Helper>
        }
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

      {selectedTableCount > 0 ? (
        <FieldYesNo
          label="Nappage des tables"
          field={fields.hasTableCloths}
          helper={
            <FormLayout.Helper>
              Option à {Price.format(Number(CLIENT_ENV.PRICE_TABLE_CLOTHS))} par
              table
            </FormLayout.Helper>
          }
        />
      ) : null}

      <FormLayout.Row>
        <FieldStepper
          label="Nombre total de personnes samedi et dimanche"
          field={fields.peopleCount}
          minValue={1}
          maxValue={
            selectedStandSize?.maxBraceletCount ??
            getMaxValue(standSizes, "maxBraceletCount")
          }
          helper={
            selectedStandSize != null &&
            peopleCount > selectedStandSize.maxPeopleCount ? (
              <FormLayout.Helper>
                {Price.format(Number(CLIENT_ENV.PRICE_ADDITIONAL_BRACELET))} par
                bracelet supplémentaire valable pour le week-end
              </FormLayout.Helper>
            ) : null
          }
        />

        <FieldStepper
          label="Nombre de chaises"
          field={fields.chairCount}
          minValue={1}
          maxValue={peopleCount}
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
      maxBraceletCount: true;
      maxTableCount: true;
    };
  }>[],
  property: keyof (typeof standSizes)[number],
): number {
  return Math.max(...standSizes.map((standSize) => standSize[property]));
}
