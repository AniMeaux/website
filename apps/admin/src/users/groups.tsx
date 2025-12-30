import type { IconName } from "#i/generated/icon";
import type { User } from "@animeaux/prisma";
import { UserGroup } from "@animeaux/prisma";
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
  [UserGroup.ADMIN]: "icon-shield-halved-solid",
  [UserGroup.ANIMAL_MANAGER]: "icon-paw-solid",
  [UserGroup.BLOGGER]: "icon-pen-nib-solid",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "icon-handshake-solid",
  [UserGroup.SHOW_ORGANIZER]: "icon-show-solid",
  [UserGroup.VETERINARIAN]: "icon-stethoscope-solid",
  [UserGroup.VOLUNTEER]: "icon-people-group-solid",
};

export function hasGroups(user: Pick<User, "groups">, groups: UserGroup[]) {
  return intersection(user.groups, groups).length > 0;
}
