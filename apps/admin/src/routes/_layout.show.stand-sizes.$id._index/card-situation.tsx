import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { Icon } from "#generated/icon.js";
import { StandSizeBookingIcon } from "#show/stand-size/booking-icon.js";
import { formatBooking } from "#show/stand-size/booking.js";
import { Visibility, VisibilityIcon } from "#show/visibility.js";
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
          <ItemRestriction />
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

function ItemRestriction() {
  const { standSize } = useLoaderData<typeof loader>();

  if (!standSize.isRestrictedByActivityField) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tags-light" />}>
      Domaines d’activité{" "}
      <strong className="text-body-emphasis">restreints</strong>
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
