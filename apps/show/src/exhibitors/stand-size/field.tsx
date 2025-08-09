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
  selectedActivityFields,
}: {
  field: FieldMetadata<StandSize.Enum>;
  label: React.ReactNode;
  selectedActivityFields: ShowActivityField[];
}) {
  const hasLimitedStandSize = selectedActivityFields.some(
    (selectedActivityField) =>
      SMALL_SIZED_STANDS_ACTIVITY_FIELDS.includes(selectedActivityField),
  );

  let options = StandSize.values;

  if (hasLimitedStandSize) {
    options = StandSize.valuesSmallSize;
  }

  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="170px">
        {getCollectionProps(field, { type: "radio", options }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {StandSize.translation[props.value as StandSize.Enum]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      {field.errors != null ? (
        <FieldErrorHelper field={field} />
      ) : (
        <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
      )}
    </FormLayout.Field>
  );
}
