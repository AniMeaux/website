import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { ExhibitorTag } from "@prisma/client";

export const ExhibitorSearchParams = SearchParamsDelegate.create({
  tags: {
    key: "tag",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(ExhibitorTag)),
  },
  hasEvent: {
    key: "event",
    schema: zu.searchParams.boolean(),
  },
});
