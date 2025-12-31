import { BaseLink } from "#i/core/base-link.js";
import { DynamicImage } from "#i/core/data-display/image.js";
import { Routes } from "#i/core/navigation.js";
import { Visibility, VisibilityIcon } from "#i/show/visibility.js";
import { ImageUrl } from "@animeaux/core";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./loader.server";

type Exhibitor = SerializeFrom<typeof loader>["exhibitors"][number];

export function ExhibitorItem({ exhibitor }: { exhibitor: Exhibitor }) {
  return (
    <BaseLink
      to={Routes.show.exhibitors.id(exhibitor.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <DynamicImage
        imageId={ImageUrl.parse(exhibitor.logoPath).id}
        alt={exhibitor.name}
        sizeMapping={{ default: "60px" }}
        fallbackSize="128"
        background="none"
        className="h-4 rounded-0.5 border border-gray-200 bg-white"
      />

      <span className="text-body-emphasis">{exhibitor.name}</span>

      <VisibilityIcon
        visibility={Visibility.fromBoolean(exhibitor.isVisible)}
        className="icon-20"
      />
    </BaseLink>
  );
}
