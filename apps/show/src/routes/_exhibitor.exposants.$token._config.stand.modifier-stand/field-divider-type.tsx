import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import {
  DIVIDER_TYPE_TRANSLATION,
  SORTED_DIVIDER_TYPES,
} from "#exhibitors/stand-configuration/divider-type";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { ShowExhibitorStandConfigurationDividerType } from "@prisma/client";

export function FieldDividerType({
  field,
  label,
}: {
  field: FieldMetadata<null | ShowExhibitorStandConfigurationDividerType>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="100%">
        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_DIVIDER_TYPES,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {
                DIVIDER_TYPE_TRANSLATION[
                  props.value as ShowExhibitorStandConfigurationDividerType
                ]
              }
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
