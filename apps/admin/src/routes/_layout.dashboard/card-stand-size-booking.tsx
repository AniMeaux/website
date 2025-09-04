import { Item, ItemList } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { StandSizeBookingChip } from "#show/stand-size/booking-chip.js";
import { StandSizeBookingIcon } from "#show/stand-size/booking-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardStandSizeBooking() {
  const { show } = useLoaderData<typeof loader>();

  if (show == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Remplissage des stands</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          {show.standSizes.map((standSize) => (
            <Item.Root key={standSize.id}>
              <Item.Icon>
                <StandSizeBookingIcon standSize={standSize} />
              </Item.Icon>

              <Item.Content className="grid grid-cols-fr-auto items-center gap-1">
                <span>{standSize.label}</span>

                <StandSizeBookingChip standSize={standSize} />
              </Item.Content>
            </Item.Root>
          ))}
        </ItemList>
      </Card.Content>
    </Card>
  );
}
