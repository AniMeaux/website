import { Chip } from "#core/data-display/chip.js";
import { Item, ItemList } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { Icon } from "#generated/icon.js";
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
          {show.standSizeBooking.map((booking) => (
            <Item.Root key={booking.id}>
              <Item.Icon>
                {booking.ratio === 0 ? (
                  <Icon href="icon-circle-light" className="text-gray-600" />
                ) : booking.ratio < 0.33 ? (
                  <Icon
                    href="icon-circle-progress-1-solid"
                    className="text-blue-500"
                  />
                ) : booking.ratio < 0.66 ? (
                  <Icon
                    href="icon-circle-progress-2-solid"
                    className="text-cyan-500"
                  />
                ) : booking.ratio < 1 ? (
                  <Icon
                    href="icon-circle-progress-3-solid"
                    className="text-emerald-500"
                  />
                ) : booking.ratio === 1 ? (
                  <Icon
                    href="icon-circle-check-solid"
                    className="text-green-600"
                  />
                ) : (
                  <Icon
                    href="icon-circle-exclamation-solid"
                    className="text-red-500"
                  />
                )}
              </Item.Icon>

              <Item.Content className="grid grid-cols-fr-auto items-center gap-1">
                <span>{booking.label}</span>

                <Chip
                  variant={booking.ratio > 1 ? "primary" : "secondary"}
                  color={booking.ratio > 1 ? "red" : "black"}
                >
                  {booking.bookedCount}
                  {booking.maxCount != null ? ` / ${booking.maxCount}` : null}
                </Chip>
              </Item.Content>
            </Item.Root>
          ))}
        </ItemList>
      </Card.Content>
    </Card>
  );
}
