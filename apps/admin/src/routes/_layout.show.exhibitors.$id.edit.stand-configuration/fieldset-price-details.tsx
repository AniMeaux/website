import { Receipt } from "#core/data-display/receipt.js";
import { Card } from "#core/layout/card.js";
import { ExhibitorCategory } from "#show/exhibitors/category.js";
import { Price } from "#show/price.js";
import { StandSizePrice } from "#show/stand-size/price.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./route";

export function FieldsetPriceDetails() {
  const { exhibitor, standSizes } = useLoaderData<typeof loader>();

  const { fields } = useForm();

  const selectedStandSize = standSizes.find(
    (standSize) => standSize.id === fields.sizeId.value,
  );

  const priceStandSize =
    selectedStandSize != null
      ? StandSizePrice.getPrice({
          standSize: selectedStandSize,
          category: exhibitor.category,
        })
      : null;

  const totalPrice = [priceStandSize]
    .filter(Boolean)
    .reduce((sum, price) => sum + price, 0);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix estimé du stand</Card.Title>
      </Card.Header>

      <Card.Content>
        <Receipt.Root>
          <Receipt.Items>
            {selectedStandSize != null ? (
              <Receipt.Item>
                <Receipt.ItemName>
                  Stand de {selectedStandSize.label}
                  {" • "}
                  {ExhibitorCategory.translation[exhibitor.category]}
                </Receipt.ItemName>

                <Receipt.ItemCount />

                <Receipt.ItemPrice>
                  {priceStandSize == null
                    ? "N/A"
                    : Price.format(priceStandSize)}
                </Receipt.ItemPrice>
              </Receipt.Item>
            ) : null}
          </Receipt.Items>

          <Receipt.Total>
            <Receipt.TotalName>Total</Receipt.TotalName>

            <Receipt.ItemCount />

            <Receipt.TotalPrice>{Price.format(totalPrice)}</Receipt.TotalPrice>
          </Receipt.Total>
        </Receipt.Root>
      </Card.Content>
    </Card>
  );
}
