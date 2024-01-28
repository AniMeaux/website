import { Avatar } from "#core/dataDisplay/avatar";
import { cn } from "@animeaux/core";
import type { Event } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";

export function EventAvatar({
  event,
  className,
}: {
  event: SerializeFrom<Pick<Event, "startDate">>;
  className?: string;
}) {
  return (
    <Avatar
      size="lg"
      className={cn(
        "relative z-0 flex-col overflow-hidden bg-white",
        className,
      )}
    >
      {/*
        We want the red block to be above the border.
        But we can't add the border to the parent element because it mess with
        the box sizing, and we can't use a box-shadow because it can be added by
        a parent element.
      */}
      <span
        aria-hidden
        className="absolute left-0 top-0 -z-10 h-full w-full rounded-[inherit] border border-gray-100"
      />

      <span aria-hidden className="h-2 w-full flex-none bg-red-500" />

      <span className="flex w-full flex-1 flex-col justify-center text-center">
        <span className="text-[40px] font-semibold leading-none">
          {DateTime.fromISO(event.startDate).day}
        </span>

        <span className="text-[12px] font-semibold leading-none">
          {DateTime.fromISO(event.startDate).toLocaleString({ month: "long" })}
        </span>
      </span>
    </Avatar>
  );
}
