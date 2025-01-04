import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
  SORTED_ACTIVITY_TARGETS,
} from "#exhibitors/activity-target/activity-target";
import { Icon } from "#generated/icon";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { ShowActivityTarget } from "@prisma/client";

export function FieldActivityTarget({
  field,
  label,
}: {
  field: FieldMetadata<ShowActivityTarget[]>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "checkbox",
          options: SORTED_ACTIVITY_TARGETS,
        }).map((props) => {
          const activityTarget = props.value as ShowActivityTarget;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.CheckedIcon asChild>
                <Icon id={ACTIVITY_TARGET_ICON[activityTarget].solid} />
              </FormLayout.Selector.CheckedIcon>

              <FormLayout.Selector.UncheckedIcon asChild>
                <Icon id={ACTIVITY_TARGET_ICON[activityTarget].light} />
              </FormLayout.Selector.UncheckedIcon>

              <FormLayout.Selector.Label>
                {ACTIVITY_TARGET_TRANSLATION[activityTarget]}
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
