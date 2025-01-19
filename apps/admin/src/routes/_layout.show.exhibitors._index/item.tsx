import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import { Routes } from "#core/navigation";
import { VisibilityIcon, visibilityFromBoolean } from "#show/visibility";
import { ImageUrl, cn } from "@animeaux/core";
import { ShowExhibitorApplicationStatus } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { loader } from "./route";

export function ExhibitorItem({
  exhibitor,
}: {
  exhibitor: SerializeFrom<typeof loader>["exhibitors"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.exhibitors.id(exhibitor.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      <DynamicImage
        imageId={ImageUrl.parse(exhibitor.profile.logoPath).id}
        alt={exhibitor.profile.name}
        sizeMapping={{ default: "60px" }}
        fallbackSize="128"
        background="none"
        className="h-4 rounded-0.5 border border-gray-200 bg-white"
      />

      <span
        className={cn(
          "text-body-emphasis",
          exhibitor.application.status !==
            ShowExhibitorApplicationStatus.VALIDATED
            ? "line-through"
            : undefined,
        )}
        title={
          exhibitor.application.status !==
          ShowExhibitorApplicationStatus.VALIDATED
            ? "Sa candidature n’est plus validée"
            : undefined
        }
      >
        {exhibitor.profile.name}
      </span>

      <VisibilityIcon
        visibility={visibilityFromBoolean(exhibitor.isVisible)}
        className="icon-20"
      />
    </BaseLink>
  );
}
