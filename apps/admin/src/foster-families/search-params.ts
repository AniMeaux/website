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

  parseFunction: ({ keys, getValue, getValues }) => {
    return Schema.parse({
      displayName: getValue(keys.displayName),
      garden: getValues(keys.garden),
      housing: getValues(keys.housing),
      cities: getValues(keys.cities),
      speciesAlreadyPresent: getValues(keys.speciesAlreadyPresent),
      speciesToAvoid: getValues(keys.speciesToAvoid),
      speciesToHost: getValue(keys.speciesToHost),
      zipCode: getValue(keys.zipCode),
    });
  },

  setFunction: (data, { keys, setValue, setValues }) => {
    setValue(keys.displayName, data.displayName);
    setValues(keys.garden, data.garden);
    setValues(keys.housing, data.housing);
    setValues(keys.cities, data.cities);
    setValues(keys.speciesAlreadyPresent, data.speciesAlreadyPresent);
    setValues(keys.speciesToAvoid, data.speciesToAvoid);
    setValue(keys.speciesToHost, data.speciesToHost);
    setValue(keys.zipCode, data.zipCode);
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
