import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
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

export const GlobalSearchParams = SearchParamsDelegate.create({
  text: { key: "q", schema: zu.searchParams.string() },
  entity: zu.searchParams.nativeEnum(Entity),
});
