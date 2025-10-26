import { Receipt } from "#core/data-display/receipt.js";
import { ExhibitorCategory } from "#exhibitors/category.js";
import { Price } from "#price/price.js";
import { StandSizePrice } from "#stand-size/price.js";
import type { Prisma } from "@animeaux/prisma/client";

export function ParticipationReceipt({
  standSize,
  exhibitorCategory,
  hasCorner,
  tableCount,
  hasTableCloths,
  breakfastPeopleCountSaturday,
  breakfastPeopleCountSunday,
  peopleCount,
  dividerCount,
}: {
  standSize?: Prisma.ShowStandSizeGetPayload<{
    select: {
      label: true;
      maxPeopleCount: true;
      priceForAssociations: true;
      priceForServices: true;
      priceForShops: true;
    };
  }>;
  exhibitorCategory: ExhibitorCategory.Enum;
  hasCorner: boolean;
  tableCount: number;
  hasTableCloths: boolean;
  breakfastPeopleCountSaturday: number;
  breakfastPeopleCountSunday: number;
  peopleCount: number;
  dividerCount?: number;
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

  const priceBreakfast = Number(CLIENT_ENV.PRICE_BREAKFAST_PER_PERSON_PER_DAY);
  const breakfastPeopleCount =
    breakfastPeopleCountSaturday + breakfastPeopleCountSunday;
  const totalPriceBreakfast = breakfastPeopleCount * priceBreakfast;

  const priceAdditionalBracelet = Number(CLIENT_ENV.PRICE_ADDITIONAL_BRACELET);
  const additionalPeopleCount =
    standSize != null ? Math.max(0, peopleCount - standSize.maxPeopleCount) : 0;
  const totalPriceAdditionalBracelet =
    additionalPeopleCount * priceAdditionalBracelet;

  const priceDivider = Number(CLIENT_ENV.PRICE_DIVIDER);
  const totalPriceDivider =
    dividerCount != null ? dividerCount * priceDivider : null;

  const totalPrice = [
    priceStandSize,
    totalPriceTableCloths,
    priceCorner,
    totalPriceBreakfast,
    totalPriceAdditionalBracelet,
    totalPriceDivider,
  ]
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

        {priceCorner != null ? (
          <Receipt.Item>
            <Receipt.ItemName>
              Placement privilégié (stand en angle)
            </Receipt.ItemName>

            <Receipt.ItemCount />

            <Receipt.ItemPrice>{Price.format(priceCorner)}</Receipt.ItemPrice>
          </Receipt.Item>
        ) : null}

        {dividerCount != null && dividerCount > 0 ? (
          <Receipt.Item>
            <Receipt.ItemName>
              Cloison{dividerCount > 1 ? "s" : ""}
            </Receipt.ItemName>

            <Receipt.ItemCount count={dividerCount} />

            <Receipt.ItemPrice>{Price.format(priceDivider)}</Receipt.ItemPrice>
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

        {additionalPeopleCount > 0 ? (
          <Receipt.Item>
            <Receipt.ItemName>
              Bracelet{additionalPeopleCount > 1 ? "s" : ""} supplémentaire
              {additionalPeopleCount > 1 ? "s" : ""}
            </Receipt.ItemName>

            <Receipt.ItemCount count={additionalPeopleCount} />

            <Receipt.ItemPrice>
              {Price.format(priceAdditionalBracelet)}
            </Receipt.ItemPrice>
          </Receipt.Item>
        ) : null}

        {breakfastPeopleCount > 0 ? (
          <Receipt.Item>
            <Receipt.ItemName>Petit-déjeuner</Receipt.ItemName>

            <Receipt.ItemCount count={breakfastPeopleCount} />

            <Receipt.ItemPrice>
              {Price.format(priceBreakfast)}
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
  );
}
