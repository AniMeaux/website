import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";

export function FieldYesNo({
  field,
  label,
  helper,
}: {
  field: FieldMetadata<"on" | "off">;
  label: React.ReactNode;
  helper?: React.ReactNode;
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="110px">
        {getCollectionProps(field, {
          type: "radio",
          options: ["on", "off"],
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {props.value === "on" ? "Oui" : "Non"}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      {field.errors != null ? <FieldErrorHelper field={field} /> : helper}
    </FormLayout.Field>
  );
}
