import { BaseLink } from "#core/base-link.js";
import { Chip } from "#core/data-display/chip.js";
import { Routes } from "#core/navigation.js";
import { StandSizeBookingChip } from "#show/stand-size/booking-chip.js";
import { StandSizeBookingIcon } from "#show/stand-size/booking-icon.js";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./route";

type StandSize = SerializeFrom<typeof loader>["standSizes"][number];

export function StandSizeItem({ standSize }: { standSize: StandSize }) {
  return (
    <BaseLink
      to={Routes.show.standSizes.id(standSize.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <StandSizeBookingIcon standSize={standSize} className="icon-20" />

      <div>{standSize.label}</div>

      <div className="grid auto-cols-auto grid-flow-col items-center justify-end gap-1">
        {!standSize.isVisible ? (
          <Chip variant="secondary" color="orange" icon="icon-eye-slash-light">
            <span className="hidden @lg/card-content:inline">Privée</span>
          </Chip>
        ) : null}

        <StandSizeBookingChip standSize={standSize} />
      </div>
    </BaseLink>
  );
}
