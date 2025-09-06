import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { DividerTypeAvailabilityIcon } from "#show/divider-type/availability-icon.js";
import { formatAvailability } from "#show/divider-type/availability.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardSituation() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemAvailability />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemAvailability() {
  const { dividerType } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<DividerTypeAvailabilityIcon dividerType={dividerType} />}
    >
      Utilisation :{" "}
      <strong className="text-body-emphasis">
        {formatAvailability(dividerType)}
      </strong>
    </SimpleItem>
  );
}
