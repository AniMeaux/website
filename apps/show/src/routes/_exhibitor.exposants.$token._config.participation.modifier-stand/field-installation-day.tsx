import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { FormLayout } from "#i/core/layout/form-layout";
import {
  INSTALLATION_DAY_TRANSLATION,
  SORTED_INSTALLATION_DAYS,
} from "#i/exhibitors/stand-configuration/installation-day";
import type { ShowInstallationDay } from "@animeaux/prisma";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export function FieldInstallationDay({
  field,
  label,
}: {
  field: FieldMetadata<ShowInstallationDay>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_INSTALLATION_DAYS,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {INSTALLATION_DAY_TRANSLATION[props.value as ShowInstallationDay]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
