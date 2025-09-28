import { Receipt } from "#core/data-display/receipt.js";
import { ExhibitorCategory } from "#exhibitors/category.js";
import { Price } from "#price/price.js";
import { StandSizePrice } from "#stand-size/price.js";
import type { Prisma } from "@prisma/client";

export function ParticipationReceipt({
  standSize,
  exhibitorCategory,
  hasCorner,
  tableCount,
  hasTableCloths,
}: {
  standSize?: Prisma.ShowStandSizeGetPayload<{
    select: {
      label: true;
      priceForAssociations: true;
      priceForServices: true;
      priceForShops: true;
    };
  }>;
  exhibitorCategory: ExhibitorCategory.Enum;
  hasCorner: boolean;
  tableCount: number;
  hasTableCloths: boolean;
}) {
  const priceStandSize =
    standSize != null
      ? StandSizePrice.getPrice({
          standSize: standSize,
          category: exhibitorCategory,
        })
      : null;

  const priceTableCloths = Number(CLIENT_ENV.PRICE_TABLE_CLOTHS);
  const totalPriceTableCloths =
    tableCount > 0 && hasTableCloths ? tableCount * priceTableCloths : null;

  const priceCorner = hasCorner ? Number(CLIENT_ENV.PRICE_CORNER_STAND) : null;

  const totalPrice = [priceStandSize, totalPriceTableCloths, priceCorner]
    .filter(Boolean)
    .reduce((sum, price) => sum + price, 0);

  return (
    <Receipt.Root>
      <Receipt.Items>
        {standSize != null ? (
          <Receipt.Item>
            <Receipt.ItemName>
              Stand de {standSize.label}
              {" • "}
              {ExhibitorCategory.translation[exhibitorCategory]}
            </Receipt.ItemName>

            <Receipt.ItemCount />

            <Receipt.ItemPrice>
              {priceStandSize == null ? "N/A" : Price.format(priceStandSize)}
            </Receipt.ItemPrice>
          </Receipt.Item>
        ) : null}

        {tableCount > 0 && hasTableCloths ? (
          <Receipt.Item>
            <Receipt.ItemName>Nappage des tables</Receipt.ItemName>

            <Receipt.ItemCount count={tableCount} />

            <Receipt.ItemPrice>
              {Price.format(priceTableCloths)}
            </Receipt.ItemPrice>
          </Receipt.Item>
        ) : null}

        {priceCorner != null ? (
          <Receipt.Item>
            <Receipt.ItemName>
              Placement privilégié (stand en angle)
            </Receipt.ItemName>

            <Receipt.ItemCount />

            <Receipt.ItemPrice>{Price.format(priceCorner)}</Receipt.ItemPrice>
          </Receipt.Item>
        ) : null}
      </Receipt.Items>

      <Receipt.Total>
        <Receipt.TotalName>Total</Receipt.TotalName>

        <Receipt.ItemCount />

        <Receipt.TotalPrice>{Price.format(totalPrice)}</Receipt.TotalPrice>
      </Receipt.Total>
    </Receipt.Root>
  );
}
