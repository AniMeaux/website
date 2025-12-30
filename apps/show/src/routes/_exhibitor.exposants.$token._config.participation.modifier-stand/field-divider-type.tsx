import { FieldErrorHelper } from "#i/core/form-elements/field-error-helper";
import { FormLayout } from "#i/core/layout/form-layout";
import type { DividerTypeAvailability } from "#i/divider-type/availability.js";
import { Price } from "#i/price/price.js";
import type { Prisma } from "@animeaux/prisma";
import type { FieldMetadata } from "@conform-to/react";
import { getCollectionProps } from "@conform-to/react";
import type { Simplify } from "type-fest";
import { DividerType } from "./action-schema";

export function FieldDividerType({
  field,
  label,
  dividerTypes,
}: {
  field: FieldMetadata<string>;
  label: React.ReactNode;
  dividerTypes: Simplify<
    Prisma.ShowDividerTypeGetPayload<{ select: { id: true; label: true } }> &
      DividerTypeAvailability
  >[];
}) {
  return (
    <FormLayout.Field>
      <FormLayout.Label>{label}</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="100%">
        {getCollectionProps(field, {
          type: "radio",
          options: [
            DividerType.none,
            ...dividerTypes.map((dividerType) => dividerType.id),
          ],
        }).map((props) => {
          const dividerType = dividerTypes.find(
            (dividerType) => dividerType.id === props.value,
          );

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input
                {...props}
                key={props.key}
                disabled={dividerType?.availableCount === 0}
              />

              <FormLayout.Selector.Label>
                {dividerType?.label ?? "Aucune cloison"}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.RadioIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      {field.errors != null ? (
        <FieldErrorHelper field={field} />
      ) : dividerTypes.every(
          (dividerType) => dividerType.availableCount === 0,
        ) ? (
        <FormLayout.Helper>
          Aucune cloison disponible pour le moment
        </FormLayout.Helper>
      ) : (
        <FormLayout.Helper>
          Option à {Price.format(Number(CLIENT_ENV.PRICE_DIVIDER))} par cloison
          • Sous réserve de disponibilité
        </FormLayout.Helper>
      )}
    </FormLayout.Field>
  );
}
