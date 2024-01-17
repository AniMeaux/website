import { Avatar } from "#core/dataDisplay/avatar.tsx";
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
        "z-0 relative bg-white flex-col overflow-hidden",
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
        className="-z-10 absolute top-0 left-0 w-full h-full border border-gray-100 rounded-[inherit]"
      />

      <span aria-hidden className="flex-none w-full h-2 bg-red-500" />

      <span className="w-full flex-1 flex flex-col justify-center text-center">
        <span className="font-semibold leading-none text-[40px]">
          {DateTime.fromISO(event.startDate).day}
        </span>

        <span className="font-semibold leading-none text-[12px]">
          {DateTime.fromISO(event.startDate).toLocaleString({ month: "long" })}
        </span>
      </span>
    </Avatar>
  );
}
