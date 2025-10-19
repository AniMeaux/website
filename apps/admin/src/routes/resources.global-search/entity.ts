import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import orderBy from "lodash.orderby";

export namespace Entity {
  export const Enum = {
    ANIMAL: "ANIMAL",
    EXHIBITOR: "EXHIBITOR",
    FOSTER_FAMILY: "FOSTER_FAMILY",
  } as const;

  export type Enum = (typeof Enum)[keyof typeof Enum];

  export const translations: Record<Enum, string> = {
    [Enum.ANIMAL]: "Animaux",
    [Enum.EXHIBITOR]: "Exposants",
    [Enum.FOSTER_FAMILY]: "FA",
  };

  export const values = orderBy(
    Object.values(Enum),
    (entity) => translations[entity],
  );

  export function getPossibleValuesForCurrentUser(
    currentUser: Pick<User, "groups">,
  ) {
    return values.filter((entity) =>
      currentUser.groups.some((group) =>
        ALLOWED_ENTITIES_PER_GROUP[group].has(entity),
      ),
    );
  }

  const ALLOWED_ENTITIES_PER_GROUP: Record<UserGroup, Set<Enum>> = {
    [UserGroup.ADMIN]: new Set([
      Enum.ANIMAL,
      Enum.EXHIBITOR,
      Enum.FOSTER_FAMILY,
    ]),
    [UserGroup.ANIMAL_MANAGER]: new Set([Enum.ANIMAL, Enum.FOSTER_FAMILY]),
    [UserGroup.BLOGGER]: new Set(),
    [UserGroup.HEAD_OF_PARTNERSHIPS]: new Set(),
    [UserGroup.SHOW_ORGANIZER]: new Set([Enum.EXHIBITOR]),
    [UserGroup.VETERINARIAN]: new Set([Enum.ANIMAL]),
    [UserGroup.VOLUNTEER]: new Set([Enum.ANIMAL]),
  };
}
