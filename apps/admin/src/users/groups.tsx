import type { IconProps } from "#generated/icon";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import intersection from "lodash.intersection";
import orderBy from "lodash.orderby";

export const GROUP_TRANSLATION: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "Administrateur",
  [UserGroup.ANIMAL_MANAGER]: "Sociables mais de loin",
  [UserGroup.BLOGGER]: "Redacteur",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "Partenariat",
  [UserGroup.VETERINARIAN]: "Vétérinaire",
  [UserGroup.VOLUNTEER]: "Bénévole",
};

export const SORTED_GROUPS = orderBy(
  Object.values(UserGroup),
  (group) => GROUP_TRANSLATION[group],
);

export const GROUP_ICON: Record<UserGroup, IconProps["id"]> = {
  [UserGroup.ADMIN]: "shield-halved",
  [UserGroup.ANIMAL_MANAGER]: "paw",
  [UserGroup.BLOGGER]: "pen-nib",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "handshake",
  [UserGroup.VETERINARIAN]: "stethoscope",
  [UserGroup.VOLUNTEER]: "people-group",
};

export function hasGroups(user: Pick<User, "groups">, groups: UserGroup[]) {
  return intersection(user.groups, groups).length > 0;
}
