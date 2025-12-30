import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { FormLayout } from "#i/core/layout/form-layout";
import { ActivityField } from "#i/exhibitors/activity-field/activity-field";
import { Icon } from "#i/generated/icon";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export function FieldActivityField({
  field,
  label,
}: {
  field: FieldMetadata<ActivityField.Enum[]>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "checkbox",
          options: ActivityField.values,
        }).map((props) => {
          const activityField = props.value as ActivityField.Enum;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.CheckedIcon asChild>
                <Icon id={ActivityField.icon[activityField].solid} />
              </FormLayout.Selector.CheckedIcon>

              <FormLayout.Selector.UncheckedIcon asChild>
                <Icon id={ActivityField.icon[activityField].light} />
              </FormLayout.Selector.UncheckedIcon>

              <FormLayout.Selector.Label>
                {ActivityField.translation[activityField]}
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
