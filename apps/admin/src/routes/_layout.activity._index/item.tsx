import { ActivityAction } from "#activity/action.js";
import { ActivityActorType } from "#activity/actor-type.js";
import { ActivityResource } from "#activity/resource.js";
import { AnimalAvatar } from "#animals/avatar.js";
import { getAnimalDisplayName } from "#animals/profile/name.js";
import { BaseLink } from "#core/base-link.js";
import { toRoundedRelative } from "#core/dates.js";
import { getShortUuid } from "#core/id.js";
import { Routes } from "#core/navigation.js";
import { FosterFamilyAvatar } from "#foster-families/avatar.js";
import { Icon } from "#generated/icon.js";
import { UserAvatar } from "#users/avatar.js";
import type { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function ActivityItem({
  activity,
}: {
  activity: SerializeFrom<typeof loader>["activities"][number];
}) {
  return (
    <BaseLink
      to={Routes.activity.id(activity.id).toString()}
      className="col-span-full grid grid-cols-subgrid items-center rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1"
    >
      {activity.user != null ? (
        <span className="grid grid-flow-col items-center justify-start gap-1">
          <UserAvatar
            size="sm"
            user={activity.user}
            className="hidden @xl/card-content:inline-flex"
          />

          {activity.user.displayName}
        </span>
      ) : activity.actorType === ActivityActorType.Enum.USER ? (
        <span>Utilisateur ({getShortUuid(activity.actorId)})</span>
      ) : (
        <span>
          <span className="hidden @xl/card-content:inline-flex">🤖</span> Cron
        </span>
      )}

      <span className="grid grid-flow-col items-center justify-start gap-1">
        <Icon
          href={ActivityAction.icon[activity.action]}
          className="text-gray-600 icon-20"
        />

        <span className="hidden @lg/card-content:inline">
          {ActivityAction.translations[activity.action]}
        </span>
      </span>

      {activity.animal != null ? (
        <span className="grid grid-cols-2-auto items-center justify-start gap-1">
          <AnimalAvatar size="sm" animal={activity.animal} />
          {getAnimalDisplayName(activity.animal)}
        </span>
      ) : activity.fosterFamily != null ? (
        <span className="grid grid-cols-2-auto items-center justify-start gap-1">
          <FosterFamilyAvatar
            size="sm"
            availability={activity.fosterFamily.availability}
          />

          {activity.fosterFamily.displayName}
        </span>
      ) : (
        <span>
          {ActivityResource.translations[activity.resource]} (
          {getShortUuid(activity.resourceId)})
        </span>
      )}

      <span
        title={DateTime.fromISO(activity.createdAt).toLocaleString(
          DateTime.DATETIME_MED,
        )}
        className="text-right"
      >
        {toRoundedRelative(activity.createdAt)}
      </span>
    </BaseLink>
  );
}
