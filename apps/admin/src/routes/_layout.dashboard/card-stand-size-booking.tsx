import { BaseLink } from "#i/core/base-link.js";
import { SimpleEmpty } from "#i/core/data-display/empty.js";
import { Card } from "#i/core/layout/card.js";
import { Routes } from "#i/core/navigation.js";
import { StandSizeBookingChip } from "#i/show/stand-size/booking-chip.js";
import { StandSizeBookingIcon } from "#i/show/stand-size/booking-icon.js";
import type { SerializeFrom } from "@remix-run/node";
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

      <Card.Content hasListItems>
        {show.standSizes.length === 0 ? (
          <SimpleEmpty
            isCompact
            icon="📐"
            iconAlt="Équerre"
            title="Aucune taille de stand"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {show.standSizes.map((standSize) => (
              <StandSizeItem key={standSize.id} standSize={standSize} />
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

function StandSizeItem({
  standSize,
}: {
  standSize: NonNullable<
    SerializeFrom<typeof loader>["show"]
  >["standSizes"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.standSizes.id(standSize.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <StandSizeBookingIcon standSize={standSize} className="icon-20" />

      <div>{standSize.label}</div>

      <div className="grid auto-cols-auto grid-flow-col items-center justify-end gap-1">
        <StandSizeBookingChip standSize={standSize} />
      </div>
    </BaseLink>
  );
}
