import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import {
  GENDER_TRANSLATION,
  SORTED_GENDERS,
} from "#exhibitors/stand-configuration/dog-gender";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { Gender } from "@prisma/client";

export function FieldDogGender({
  field,
  label,
}: {
  field: FieldMetadata<Gender>;
  label: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="130px">
        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_GENDERS,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {GENDER_TRANSLATION[props.value as Gender]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
