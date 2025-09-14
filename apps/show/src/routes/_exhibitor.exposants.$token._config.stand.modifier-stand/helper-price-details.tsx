import { Receipt } from "#core/data-display/receipt.js";
import { HelperCard } from "#core/layout/helper-card.js";
import {
  formatPrice,
  getStandSizePrice,
} from "#exhibitors/stand-configuration/price.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./loader.server";

export function HelperPriceDetails() {
  const { exhibitor, standSizes } = useLoaderData<typeof loader>();

  const { fields } = useForm();

  const selectedStandSize = standSizes.find(
    (standSize) => standSize.id === fields.standSize.value,
  );

  const priceStandSize =
    selectedStandSize != null
      ? getStandSizePrice({
          exhibitor,
          standSize: selectedStandSize,
          application: exhibitor.application,
        })
      : null;

  const tableCount = Number(fields.tableCount.value);
  const hasTableCloths = fields.hasTableCloths.value === "on";
  const priceTableCloths =
    tableCount > 0 && hasTableCloths
      ? tableCount * Number(CLIENT_ENV.PRICE_TABLE_CLOTHS)
      : null;

  const hasCorner = fields.hasCorner.value === "on";

  const totalPrice = [priceStandSize, priceTableCloths, hasCorner ? 25 : null]
    .filter(Boolean)
    .reduce((sum, price) => sum + price, 0);

  return (
    <HelperCard.Root color="alabaster">
      <HelperCard.Title>Prix du stand</HelperCard.Title>

      <Receipt.Root>
        <Receipt.Items>
          {selectedStandSize != null && priceStandSize != null ? (
            <Receipt.Item className="grid grid-cols-2-auto justify-between gap-2">
              <Receipt.ItemName>
                Stand de {selectedStandSize.label}
              </Receipt.ItemName>

              <Receipt.ItemCount count={1} />

              <Receipt.ItemPrice>
                {formatPrice(priceStandSize)}
              </Receipt.ItemPrice>
            </Receipt.Item>
          ) : null}

          {tableCount > 0 && hasTableCloths ? (
            <Receipt.Item className="grid grid-cols-2-auto justify-between gap-2">
              <Receipt.ItemName>Nappage des tables</Receipt.ItemName>

              <Receipt.ItemCount count={tableCount} />

              <Receipt.ItemPrice>
                {formatPrice(Number(CLIENT_ENV.PRICE_TABLE_CLOTHS))}
              </Receipt.ItemPrice>
            </Receipt.Item>
          ) : null}

          {hasCorner ? (
            <Receipt.Item className="grid grid-cols-2-auto justify-between gap-2">
              <Receipt.ItemName>
                Placement privilégié (stand en angle)
              </Receipt.ItemName>

              <Receipt.ItemCount count={1} />

              <Receipt.ItemPrice>{formatPrice(25)}</Receipt.ItemPrice>
            </Receipt.Item>
          ) : null}
        </Receipt.Items>

        <Receipt.Total>
          <Receipt.TotalName>Total</Receipt.TotalName>
          <Receipt.ItemCount />
          <Receipt.TotalPrice>{formatPrice(totalPrice)}</Receipt.TotalPrice>
        </Receipt.Total>
      </Receipt.Root>
    </HelperCard.Root>
  );
}
