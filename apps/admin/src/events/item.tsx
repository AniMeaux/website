import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { Chip } from "#core/dataDisplay/chip.tsx";
import { DynamicImage, DynamicImageProps } from "#core/dataDisplay/image.tsx";
import {
  InstanceColor,
  inferInstanceColor,
} from "#core/dataDisplay/instanceColor.tsx";
import { Routes } from "#core/navigation.ts";
import { formatDateRange } from "@animeaux/shared";
import { Event } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

export function EventItem({
  event,
  imageSizes,
  imageLoading,
  className,
}: {
  event: SerializeFrom<
    Pick<
      Event,
      | "endDate"
      | "id"
      | "image"
      | "isFullDay"
      | "isVisible"
      | "location"
      | "startDate"
      | "title"
    >
  >;
  imageSizes: DynamicImageProps["sizes"];
  imageLoading?: DynamicImageProps["loading"];
  className?: string;
}) {
  return (
    <BaseLink
      to={Routes.events.id(event.id).toString()}
      className={cn(
        className,
        "group rounded-1 flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      )}
    >
      <span className="relative flex flex-col">
        <DynamicImage
          loading={imageLoading}
          imageId={event.image}
          alt={event.title}
          fallbackSize="512"
          sizes={imageSizes}
          className="w-full flex-none rounded-1"
        />

        {!event.isVisible ? (
          <span className="absolute bottom-0 left-0 w-full p-0.5 flex">
            <Chip
              color="orange"
              icon="eyeSlash"
              title="L’évènement n’est pas visible."
            />
          </span>
        ) : null}
      </span>

      <div className="flex flex-col">
        <p className="text-caption-default text-gray-500">
          {formatDateRange(event.startDate, event.endDate, {
            showTime: !event.isFullDay,
          })}
        </p>

        <p
          className={cn(
            "text-body-emphasis transition-colors duration-100 ease-in-out",
            TITLE_CLASS_NAME[inferInstanceColor(event.id)]
          )}
        >
          {event.title}
        </p>

        <p className="text-caption-default text-gray-500">{event.location}</p>
      </div>
    </BaseLink>
  );
}

const TITLE_CLASS_NAME: Record<InstanceColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};
