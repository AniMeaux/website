import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import invariant from "tiny-invariant";

export function FieldStandSize({
  field,
  label,
  standSizes,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
  standSizes: {
    id: string;
    label: string;
    isAvailable: boolean;
  }[];
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="170px">
        {getCollectionProps(field, {
          type: "radio",
          options: standSizes.map((standSize) => standSize.id),
        }).map((props) => {
          const standSize = standSizes.find(
            (standSize) => standSize.id === props.value,
          );

          invariant(standSize != null, "`standSize` should be defined");

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input
                {...props}
                key={props.key}
                disabled={!standSize.isAvailable}
              />

              <FormLayout.Selector.Label>
                {standSize.label}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.RadioIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      {field.errors != null ? (
        <FieldErrorHelper field={field} />
      ) : standSizes.every((standSize) => !standSize.isAvailable) ? (
        <FormLayout.Helper>
          Aucun stand disponible pour le moment
        </FormLayout.Helper>
      ) : (
        <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
      )}
    </FormLayout.Field>
  );
}
