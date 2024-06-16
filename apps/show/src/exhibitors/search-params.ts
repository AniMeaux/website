import { SearchParamsReader } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { ExhibitorTag } from "@prisma/client";

export const ExhibitorSearchParams = SearchParamsReader.create({
  keys: { tags: "tag", hasEvent: "event" },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      tags: searchParams.getAll(keys.tags),
      hasEvent: searchParams.get(keys.hasEvent),
    });
  },
});

const Schema = zu.object({
  tags: zu.searchParams.set(zu.searchParams.nativeEnum(ExhibitorTag)),
  hasEvent: zu.searchParams.boolean(),
});
