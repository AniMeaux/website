import { ImageUrl } from "@animeaux/core"
import type { SerializeFrom } from "@remix-run/node"

import { BaseLink } from "#i/core/base-link.js"
import { DynamicImage } from "#i/core/data-display/image.js"
import { Routes } from "#i/core/navigation.js"
import { SponsorshipCategory } from "#i/show/sponsors/category.js"
import { Visibility, VisibilityIcon } from "#i/show/visibility.js"

import type { loader } from "./route.js"

export function SponsorItem({
  sponsor,
}: {
  sponsor: SerializeFrom<typeof loader>["sponsors"][number]
}) {
  return (
    <BaseLink
      to={Routes.show.sponsors.id(sponsor.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 hover:bg-gray-100 focus-visible:z-10 focus-visible:focus-ring md:px-1"
    >
      <DynamicImage
        imageId={ImageUrl.parse(sponsor.logoPath).id}
        alt={sponsor.name}
        sizeMapping={{ default: "60px" }}
        fallbackSize="128"
        background="none"
        className="h-4 rounded-0.5 border border-gray-200 bg-white"
      />

      <div className="grid grid-cols-1">
        <span className="text-body-emphasis">{sponsor.name}</span>

        <span className="@lg/card-content:hidden">
          {SponsorshipCategory.translation[sponsor.category]}
        </span>
      </div>

      <span className="hidden @lg/card-content:inline">
        {SponsorshipCategory.translation[sponsor.category]}
      </span>

      <VisibilityIcon
        visibility={Visibility.fromBoolean(sponsor.isVisible)}
        className="icon-2"
      />
    </BaseLink>
  )
}
