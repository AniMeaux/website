import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import {
  ACTIVITY_FIELD_ICON,
  ACTIVITY_FIELD_TRANSLATION,
  SORTED_ACTIVITY_FIELDS,
} from "#exhibitors/activity-field/activity-field";
import { Icon } from "#generated/icon";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { ShowActivityField } from "@prisma/client";

export function FieldActivityField({
  field,
  label,
}: {
  field: FieldMetadata<ShowActivityField[]>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "checkbox",
          options: SORTED_ACTIVITY_FIELDS,
        }).map((props) => {
          const activityField = props.value as ShowActivityField;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.CheckedIcon asChild>
                <Icon id={ACTIVITY_FIELD_ICON[activityField].solid} />
              </FormLayout.Selector.CheckedIcon>

              <FormLayout.Selector.UncheckedIcon asChild>
                <Icon id={ACTIVITY_FIELD_ICON[activityField].light} />
              </FormLayout.Selector.UncheckedIcon>

              <FormLayout.Selector.Label>
                {ACTIVITY_FIELD_TRANSLATION[activityField]}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.CheckboxIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
