import { ItemList, SimpleItem } from "#i/core/data-display/item.js";
import { Card } from "#i/core/layout/card.js";
import { StandSizeBookingIcon } from "#i/show/stand-size/booking-icon.js";
import { formatBooking } from "#i/show/stand-size/booking.js";
import { Visibility, VisibilityIcon } from "#i/show/visibility.js";
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
          <ItemBooking />
          <ItemVisibility />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemBooking() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<StandSizeBookingIcon standSize={standSize} />}
    >
      Remplissage :{" "}
      <strong className="text-body-emphasis">{formatBooking(standSize)}</strong>
    </SimpleItem>
  );
}

function ItemVisibility() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={
        <VisibilityIcon
          visibility={Visibility.fromBoolean(standSize.isVisible)}
        />
      }
    >
      {standSize.isVisible ? (
        <>
          <strong className="text-body-emphasis">Est visible</strong> sur le
          site
        </>
      ) : (
        <>
          <strong className="text-body-emphasis">N’est pas visible</strong> sur
          le site
        </>
      )}
    </SimpleItem>
  );
}
