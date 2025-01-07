import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import {
  SORTED_STAND_ZONES,
  STAND_ZONE_TRANSLATION,
} from "#exhibitors/stand-configuration/stand-zone";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { ShowStandZone } from "@prisma/client";

export function FieldStandZone({
  field,
  label,
}: {
  field: FieldMetadata<ShowStandZone>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="170px">
        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_STAND_ZONES,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {STAND_ZONE_TRANSLATION[props.value as ShowStandZone]}
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
