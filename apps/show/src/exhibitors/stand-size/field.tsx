import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import { SMALL_SIZED_STANDS_ACTIVITY_FIELDS } from "#exhibitors/activity-field/activity-field";
import { StandSize } from "#exhibitors/stand-size/stand-size";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { ShowActivityField } from "@prisma/client";

export function FieldStandSize({
  field,
  label,
  availableStandSizes,
  selectedActivityFields,
}: {
  field: FieldMetadata<StandSize.Enum>;
  label: React.ReactNode;
  availableStandSizes: StandSize.Enum[];
  selectedActivityFields: ShowActivityField[];
}) {
  const hasLimitedStandSize = selectedActivityFields.some(
    (selectedActivityField) =>
      SMALL_SIZED_STANDS_ACTIVITY_FIELDS.includes(selectedActivityField),
  );

  const options = hasLimitedStandSize
    ? StandSize.valuesSmallSize
    : StandSize.values;

  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="170px">
        {getCollectionProps(field, { type: "radio", options }).map((props) => {
          const value = props.value as StandSize.Enum;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input
                {...props}
                key={props.key}
                disabled={!availableStandSizes.includes(value)}
              />

              <FormLayout.Selector.Label>
                {StandSize.translation[value]}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.RadioIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      {field.errors != null ? (
        <FieldErrorHelper field={field} />
      ) : options.every((size) => !availableStandSizes.includes(size)) ? (
        <FormLayout.Helper>
          Aucun stand disponible pour le moment
        </FormLayout.Helper>
      ) : (
        <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
      )}
    </FormLayout.Field>
  );
}
