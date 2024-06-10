import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import {
  FosterFamilyGarden,
  FosterFamilyHousing,
  Species,
} from "@prisma/client";

export const FosterFamilySearchParams = SearchParamsIO.create({
  keys: {
    displayName: "q",
    garden: "garden",
    housing: "housing",
    cities: "city",
    speciesAlreadyPresent: "present",
    speciesToAvoid: "avoid",
    speciesToHost: "host",
    zipCode: "zip",
  },

  parseFunction: (searchParams, keys) => {
    return Schema.parse({
      displayName: searchParams.get(keys.displayName),
      garden: searchParams.getAll(keys.garden),
      housing: searchParams.getAll(keys.housing),
      cities: searchParams.getAll(keys.cities),
      speciesAlreadyPresent: searchParams.getAll(keys.speciesAlreadyPresent),
      speciesToAvoid: searchParams.getAll(keys.speciesToAvoid),
      speciesToHost: searchParams.get(keys.speciesToHost),
      zipCode: searchParams.get(keys.zipCode),
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.displayName == null) {
      searchParams.delete(keys.displayName);
    } else {
      searchParams.set(keys.displayName, data.displayName);
    }

    searchParams.delete(keys.garden);
    data.garden?.forEach((garden) => {
      searchParams.append(keys.garden, garden);
    });

    searchParams.delete(keys.housing);
    data.housing?.forEach((housing) => {
      searchParams.append(keys.housing, housing);
    });

    searchParams.delete(keys.cities);
    data.cities?.forEach((city) => {
      searchParams.append(keys.cities, city);
    });

    searchParams.delete(keys.speciesAlreadyPresent);
    data.speciesAlreadyPresent?.forEach((speciesAlreadyPresent) => {
      searchParams.append(keys.speciesAlreadyPresent, speciesAlreadyPresent);
    });

    searchParams.delete(keys.speciesToAvoid);
    data.speciesToAvoid?.forEach((speciesToAvoid) => {
      searchParams.append(keys.speciesToAvoid, speciesToAvoid);
    });

    if (data.speciesToHost == null) {
      searchParams.delete(keys.speciesToHost);
    } else {
      searchParams.set(keys.speciesToHost, data.speciesToHost);
    }

    if (data.zipCode == null) {
      searchParams.delete(keys.zipCode);
    } else {
      searchParams.set(keys.zipCode, data.zipCode);
    }
  },
});

const Schema = zu.object({
  displayName: zu.searchParams.string(),
  garden: zu.searchParams.set(zu.searchParams.nativeEnum(FosterFamilyGarden)),
  housing: zu.searchParams.set(zu.searchParams.nativeEnum(FosterFamilyHousing)),
  cities: zu.searchParams.set(zu.searchParams.string()),
  speciesAlreadyPresent: zu.searchParams.set(
    zu.searchParams.nativeEnum(Species),
  ),
  speciesToAvoid: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
  speciesToHost: zu.searchParams.nativeEnum(Species),
  zipCode: zu.searchParams
    .string()
    .pipe(zu.string().regex(/^\d+$/).optional().catch(undefined)),
});
