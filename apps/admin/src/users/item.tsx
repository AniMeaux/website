import { BaseLink } from "#core/baseLink.tsx";
import { Chip } from "#core/dataDisplay/chip.tsx";
import type { InstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { toRoundedRelative } from "#core/dates.ts";
import { Routes } from "#core/navigation.ts";
import { Icon } from "#generated/icon.tsx";
import { UserAvatar } from "#users/avatar.tsx";
import { GROUP_ICON } from "#users/groups.tsx";
import { cn } from "@animeaux/core";
import type { User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export function UserItem({
  user,
  className,
}: {
  user: SerializeFrom<
    Pick<
      User,
      "displayName" | "groups" | "id" | "isDisabled" | "lastActivityAt"
    >
  >;
  className?: string;
}) {
  return (
    <BaseLink
      to={Routes.users.id(user.id).toString()}
      className={cn(
        className,
        "group rounded-0.5 py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg",
      )}
    >
      <UserAvatar user={user} size="sm" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span
          className={cn(
            "text-body-emphasis transition-colors duration-100 ease-in-out",
            DISPLAY_NAME_CLASS_NAME[inferInstanceColor(user.id)],
          )}
        >
          {user.displayName}
        </span>

        <span className="text-gray-500 transition-colors duration-100 ease-in-out group-hover:text-gray-800">
          {user.lastActivityAt == null
            ? "Aucune activité"
            : `Actif ${toRoundedRelative(user.lastActivityAt)}`}
        </span>
      </span>

      {user.isDisabled ? (
        <Chip color="orange" icon="ban" title="Bloqué" />
      ) : null}

      <span className="h-2 flex items-center gap-0.5" title="Groupes">
        {user.groups.map((group) => (
          <Icon
            key={group}
            id={GROUP_ICON[group]}
            className="text-[20px] text-gray-500 transition-colors duration-100 ease-in-out group-hover:text-gray-800"
          />
        ))}
      </span>
    </BaseLink>
  );
}

const DISPLAY_NAME_CLASS_NAME: Record<InstanceColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};
