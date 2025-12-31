import { InlineHelper } from "#i/core/data-display/helper.js";
import { FieldNumeric } from "#i/core/form-elements/field-numeric.js";
import { Form } from "#i/core/form-elements/form";
import { Input } from "#i/core/form-elements/input.js";
import { Card } from "#i/core/layout/card";
import { Icon } from "#i/generated/icon.js";
import { ExhibitorCategory } from "#i/show/exhibitors/category.js";
import type { FieldMetadata } from "@conform-to/react";

export function FieldsetPrices({
  fields,
}: {
  fields: {
    priceForAssociations: FieldMetadata<number>;
    priceForServices: FieldMetadata<number>;
    priceForShops: FieldMetadata<number>;
  };
}) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix</Card.Title>
      </Card.Header>

      <Card.Content>
        <InlineHelper variant="info">
          Laissez le champ vide si cette taille de stand n’est pas disponible
          pour la catégorie correspondante.
        </InlineHelper>

        <Form.Fields>
          <FieldNumericBase
            category={ExhibitorCategory.Enum.ASSOCIATION}
            field={fields.priceForAssociations}
          />

          <FieldNumericBase
            category={ExhibitorCategory.Enum.SERVICE}
            field={fields.priceForServices}
          />

          <FieldNumericBase
            category={ExhibitorCategory.Enum.SHOP}
            field={fields.priceForShops}
          />
        </Form.Fields>
      </Card.Content>
    </Card>
  );
}

function FieldNumericBase({
  category,
  field,
}: {
  category: ExhibitorCategory.Enum;
  field: FieldMetadata<number>;
}) {
  return (
    <FieldNumeric
      label={`Prix pour une ${ExhibitorCategory.translation[category]}`}
      field={field}
      leftAdornment={
        <Input.Adornment>
          <Icon href="icon-tag-light" />
        </Input.Adornment>
      }
    />
  );
}
