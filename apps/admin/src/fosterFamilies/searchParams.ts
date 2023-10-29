import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { Species } from "@prisma/client";

export const FosterFamilySearchParams = SearchParamsDelegate.create({
  displayName: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  cities: {
    key: "city",
    schema: zu.searchParams.set(zu.searchParams.string()),
  },
  speciesAlreadyPresent: {
    key: "present",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
  },
  speciesToAvoid: {
    key: "avoid",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
  },
  speciesToHost: {
    key: "host",
    schema: zu.searchParams.nativeEnum(Species),
  },
  zipCode: {
    key: "zip",
    schema: zu.searchParams
      .string()
      .pipe(zu.string().regex(/^\d+$/).optional().catch(undefined)),
  },
});
