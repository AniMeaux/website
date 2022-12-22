import { IconProps } from "#/generated/icon";
import { User, UserGroup } from "@prisma/client";
import intersection from "lodash.intersection";

export const GROUP_TRANSLATION: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "Administrateur",
  [UserGroup.ANIMAL_MANAGER]: "Sociables mais de loin",
  [UserGroup.BLOGGER]: "Redacteur",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "Partenariat",
  [UserGroup.VETERINARIAN]: "Vétérinaire",
};

export const GROUP_ICON: Record<UserGroup, IconProps["id"]> = {
  [UserGroup.ADMIN]: "shieldHalved",
  [UserGroup.ANIMAL_MANAGER]: "paw",
  [UserGroup.BLOGGER]: "penNib",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "handshake",
  [UserGroup.VETERINARIAN]: "stethoscope",
};

export function hasGroups(user: Pick<User, "groups">, groups: UserGroup[]) {
  return intersection(user.groups, groups).length > 0;
}
