import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import orderBy from "lodash.orderby";

export enum Entity {
  ANIMAL = "ANIMAL",
  FOSTER_FAMILY = "FOSTER_FAMILY",
}

export const ENTITY_TRANSLATION: Record<Entity, string> = {
  [Entity.ANIMAL]: "Animaux",
  [Entity.FOSTER_FAMILY]: "FA",
};

export const SORTED_ENTITIES = orderBy(
  Object.values(Entity),
  (entity) => ENTITY_TRANSLATION[entity],
);

export const GlobalSearchParams = SearchParamsIO.create({
  keys: { text: "q", entity: "entity" },

  parseFunction: (searchParams, keys) => {
    return GlobalSearchParamsSchema.parse({
      text: SearchParamsIO.getValue(searchParams, keys.text),
      entity: SearchParamsIO.getValue(searchParams, keys.entity),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.text, data.text);

    SearchParamsIO.setValue(searchParams, keys.entity, data.entity);
  },
});

const GlobalSearchParamsSchema = zu.object({
  text: zu.searchParams.string(),
  entity: zu.searchParams.nativeEnum(Entity),
});

export function getPossibleEntitiesForCurrentUser(
  currentUser: Pick<User, "groups">,
) {
  return SORTED_ENTITIES.filter((entity) =>
    currentUser.groups.some((group) =>
      ALLOWED_ENTITIES_PER_GROUP[group].has(entity),
    ),
  );
}

const ALLOWED_ENTITIES_PER_GROUP: Record<UserGroup, Set<Entity>> = {
  [UserGroup.ADMIN]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.ANIMAL_MANAGER]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.BLOGGER]: new Set(),
  [UserGroup.HEAD_OF_PARTNERSHIPS]: new Set(),
  [UserGroup.SHOW_ORGANIZER]: new Set(),
  [UserGroup.VETERINARIAN]: new Set([Entity.ANIMAL]),
  [UserGroup.VOLUNTEER]: new Set([Entity.ANIMAL]),
};
