import { BaseLink } from "#i/core/base-link.js";
import { Routes } from "#i/core/navigation.js";
import { DividerTypeAvailabilityChip } from "#i/show/divider-type/availability-chip.js";
import { DividerTypeAvailabilityIcon } from "#i/show/divider-type/availability-icon.js";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./route";

type DividerType = SerializeFrom<typeof loader>["dividerTypes"][number];

export function DividerTypeItem({ dividerType }: { dividerType: DividerType }) {
  return (
    <BaseLink
      to={Routes.show.dividerTypes.id(dividerType.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <DividerTypeAvailabilityIcon
        dividerType={dividerType}
        className="icon-20"
      />

      <div>{dividerType.label}</div>

      <div className="grid auto-cols-auto grid-flow-col items-center justify-end gap-1">
        <DividerTypeAvailabilityChip dividerType={dividerType} />
      </div>
    </BaseLink>
  );
}
