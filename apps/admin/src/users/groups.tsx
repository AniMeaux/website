import type { IconName } from "#generated/icon";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import intersection from "lodash.intersection";
import orderBy from "lodash.orderby";

export const GROUP_TRANSLATION: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "Administrateur",
  [UserGroup.ANIMAL_MANAGER]: "Sociables mais de loin",
  [UserGroup.BLOGGER]: "Redacteur",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "Partenariat",
  [UserGroup.SHOW_ORGANIZER]: "Organisateur Salon",
  [UserGroup.VETERINARIAN]: "Vétérinaire",
  [UserGroup.VOLUNTEER]: "Bénévole",
};

export const SORTED_GROUPS = orderBy(
  Object.values(UserGroup),
  (group) => GROUP_TRANSLATION[group],
);

export const GROUP_ICON: Record<UserGroup, IconName> = {
  [UserGroup.ADMIN]: "icon-shield-halved",
  [UserGroup.ANIMAL_MANAGER]: "icon-paw",
  [UserGroup.BLOGGER]: "icon-pen-nib",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "icon-handshake",
  [UserGroup.SHOW_ORGANIZER]: "icon-show",
  [UserGroup.VETERINARIAN]: "icon-stethoscope",
  [UserGroup.VOLUNTEER]: "icon-people-group",
};

export function hasGroups(user: Pick<User, "groups">, groups: UserGroup[]) {
  return intersection(user.groups, groups).length > 0;
}
