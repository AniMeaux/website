import { formatDateRange } from "@animeaux/shared";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { toSlug } from "~/core/slugs";
import { DynamicImage, PlaceholderImage } from "~/dataDisplay/image";
import { Icon, IconProps } from "~/generated/icon";

export function EventItem({
  isInlined = false,
  isDisabled = false,
  event,
}: {
  isInlined?: boolean;
  isDisabled?: boolean;
  event: {
    title: string;
    image: string | null;
    id: string;
    shortDescription: string;
    startDate: string;
    endDate: string;
    isFullDay: boolean;
    location: string;
  };
}) {
  return (
    <li className="flex">
      <BaseLink
        disabled={isDisabled}
        to={`/evenements/${toSlug(event.title)}-${event.id}`}
        className={cn(
          "group w-full px-4 py-3 shadow-none rounded-bubble-lg bg-transparent flex flex-col gap-3",
          {
            "transition-[background-color,box-shadow] duration-100 ease-in-out hover:bg-white hover:shadow-base":
              !isDisabled,
          },
          {
            "sm:pl-6 sm:pr-12 sm:py-6 sm:flex-row sm:gap-6 sm:items-center":
              isInlined,
            "md:p-6": !isInlined,
          }
        )}
      >
        {event.image == null ? (
          <PlaceholderImage
            icon="calendarDay"
            className={cn("w-full aspect-4/3 flex-none rounded-bubble-ratio", {
              "sm:w-[150px]": isInlined,
            })}
          />
        ) : (
          <DynamicImage
            imageId={event.image}
            alt={event.title}
            sizes={{ sm: "150px", default: "100vw" }}
            fallbackSize="512"
            className={cn("w-full aspect-4/3 flex-none rounded-bubble-ratio", {
              "sm:w-[150px]": isInlined,
            })}
          />
        )}

        <div className="flex-1 flex flex-col">
          <p className="text-title-item">{event.title}</p>
          <p>{event.shortDescription}</p>
          <ul className="flex flex-col">
            <DetailsItem icon="calendarDay">
              {formatDateRange(event.startDate, event.endDate, {
                showTime: !event.isFullDay,
              })}
            </DetailsItem>

            <DetailsItem icon="locationDot">{event.location}</DetailsItem>
          </ul>
        </div>

        {isInlined && (
          <Icon
            id="arrowRight"
            className={cn(
              "hidden text-[32px] text-gray-500",
              {
                "transition-transform duration-100 ease-in-out group-hover:scale-110":
                  !isDisabled,
              },
              "sm:block"
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
      <span className="flex-none flex h-6 items-center">
        <Icon id={icon} className="text-[14px]" />
      </span>

      <span className="flex-1">{children}</span>
    </li>
  );
}
