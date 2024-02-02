import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import {
  FosterFamilyGarden,
  FosterFamilyHousing,
  Species,
} from "@prisma/client";

export const FosterFamilySearchParams = SearchParamsDelegate.create({
  displayName: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  garden: {
    key: "garden",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(FosterFamilyGarden)),
  },
  housing: {
    key: "housing",
    schema: zu.searchParams.set(
      zu.searchParams.nativeEnum(FosterFamilyHousing),
    ),
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
