import { Chip } from "#core/data-display/chip.js";
import { StandSizeBookingChip } from "#show/stand-size/booking-chip.js";
import { StandSizeBookingIcon } from "#show/stand-size/booking-icon.js";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./route";

export function StandSizeItem({
  standSize,
}: {
  standSize: SerializeFrom<typeof loader>["standSizes"][number];
}) {
  return (
    <div className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1">
      <StandSizeBookingIcon standSize={standSize} className="icon-20" />

      <div>{standSize.label}</div>

      <div className="grid auto-cols-auto grid-flow-col items-center justify-end gap-1">
        {!standSize.isVisible ? (
          <Chip variant="secondary" color="orange" icon="icon-eye-slash-light">
            <span className="hidden @lg/card-content:inline">Privée</span>
          </Chip>
        ) : null}

        {standSize.isRestrictedByActivityField ? (
          <Chip variant="secondary" color="yellow" icon="icon-tags-light">
            <span className="hidden @lg/card-content:inline">
              Domaines d’activité restreints
            </span>
          </Chip>
        ) : null}

        <StandSizeBookingChip standSize={standSize} />
      </div>
    </div>
  );
}
