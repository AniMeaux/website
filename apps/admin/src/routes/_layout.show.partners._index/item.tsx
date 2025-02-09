import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import { Routes } from "#core/navigation";
import { PartnershipCategory } from "#show/partners/category";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { ImageUrl } from "@animeaux/core";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./route";

export function PartnerItem({
  partner,
}: {
  partner: SerializeFrom<typeof loader>["partners"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.partners.id(partner.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <DynamicImage
        imageId={ImageUrl.parse(partner.logoPath).id}
        alt={partner.name}
        sizeMapping={{ default: "60px" }}
        fallbackSize="128"
        background="none"
        className="h-4 rounded-0.5 border border-gray-200 bg-white"
      />

      <div className="grid grid-cols-1">
        <span className="text-body-emphasis">{partner.name}</span>

        <span className="@lg/card-content:hidden">
          {PartnershipCategory.translation[partner.category]}
        </span>
      </div>

      <span className="hidden @lg/card-content:inline">
        {PartnershipCategory.translation[partner.category]}
      </span>

      <VisibilityIcon
        visibility={Visibility.fromBoolean(partner.isVisible)}
        className="icon-20"
      />
    </BaseLink>
  );
}
