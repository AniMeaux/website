import { ItemList, SimpleItem } from "#i/core/data-display/item.js";
import { Card } from "#i/core/layout/card.js";
import { Icon } from "#i/generated/icon.js";
import { ExhibitorCategory } from "#i/show/exhibitors/category.js";
import { Price } from "#i/show/price.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardPrices() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemAssociation />
          <ItemService />
          <ItemShop />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemAssociation() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <ItemBase
      label={ExhibitorCategory.translation[ExhibitorCategory.Enum.ASSOCIATION]}
      price={standSize.priceForAssociations}
    />
  );
}

function ItemService() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <ItemBase
      label={ExhibitorCategory.translation[ExhibitorCategory.Enum.SERVICE]}
      price={standSize.priceForServices}
    />
  );
}

function ItemShop() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <ItemBase
      label={ExhibitorCategory.translation[ExhibitorCategory.Enum.SHOP]}
      price={standSize.priceForShops}
    />
  );
}

function ItemBase({
  label,
  price,
}: {
  label: React.ReactNode;
  price: null | number;
}) {
  if (price == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tag-light" />}>
      {label} :{" "}
      <strong className="text-body-emphasis">{Price.format(price)}</strong>
    </SimpleItem>
  );
}
