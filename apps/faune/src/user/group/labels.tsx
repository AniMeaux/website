import { UserGroup } from "@animeaux/shared";

export const USER_GROUP_LABELS: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "Administrateur",
  [UserGroup.ANIMAL_MANAGER]: "Sociables mais de loin",
  [UserGroup.BLOGGER]: "Redacteur",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "Partenariat",
  [UserGroup.VETERINARIAN]: "Vétérinaire",
};
