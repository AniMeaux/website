import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { Entity } from "./entity";

export const GlobalSearchParams = SearchParamsIO.create({
  keys: {
    text: "q",
    entity: "entity",
  },

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

  entity: zu.searchParams.nativeEnum(Entity.Enum),
});
