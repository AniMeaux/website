import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn, formatDateRange } from "@animeaux/core";
import type { Event } from "@animeaux/prisma";
import type { SerializeFrom } from "@remix-run/node";

export function EventItem({
  isInlined = false,
  isDisabled: isDisabledProp = false,
  event,
}: {
  isInlined?: boolean;
  isDisabled?: boolean;
  event: SerializeFrom<
    Pick<
      Event,
      | "description"
      | "endDate"
      | "id"
      | "image"
      | "isFullDay"
      | "location"
      | "startDate"
      | "title"
      | "url"
    >
  >;
}) {
  const isDisabled = isDisabledProp || event.url == null;

  return (
    <li className="flex">
      <BaseLink
        to={isDisabled ? undefined : event.url}
        className={cn("group flex w-full flex-col gap-3 rounded-bubble-md", {
          "sm:flex-row sm:items-start sm:gap-6": isInlined,
        })}
      >
        <DynamicImage
          imageId={event.image}
          alt={event.title}
          sizes={
            isInlined
              ? { sm: "150px", default: "100vw" }
              : { lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }
          }
          fallbackSize="512"
          className={cn("aspect-4/3 w-full flex-none rounded-bubble-md", {
            "sm:w-[150px]": isInlined,
          })}
        />

        <div className="flex flex-1 flex-col">
          <p
            className={cn(
              "transition-colors duration-100 ease-in-out text-title-item",
              { "group-hover:text-brandBlue": !isDisabled },
            )}
          >
            {event.title}
          </p>
          <p>{event.description}</p>
          <ul className="flex flex-col">
            <DetailsItem icon="calendar-day">
              {formatDateRange(event.startDate, event.endDate, {
                showTime: !event.isFullDay,
              })}
            </DetailsItem>

            <DetailsItem icon="location-dot">{event.location}</DetailsItem>
          </ul>
        </div>

        {isInlined && !isDisabled && (
          <Icon
            id="arrow-right"
            className={cn(
              "hidden self-center text-[32px] text-gray-500",
              {
                "transition-transform duration-100 ease-in-out group-hover:scale-110":
                  !isDisabled,
              },
              "sm:block",
            )}
          />
        )}
      </BaseLink>
    </li>
  );
}

function DetailsItem({
  icon,
  children,
}: {
  icon: IconProps["id"];
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 text-gray-500">
      <span className="flex h-6 flex-none items-center">
        <Icon id={icon} className="text-[14px]" />
      </span>

      <span className="flex-1">{children}</span>
    </li>
  );
}
