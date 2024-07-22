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
      displayName: SearchParamsIO.getValue(searchParams, keys.displayName),
      garden: SearchParamsIO.getValues(searchParams, keys.garden),
      housing: SearchParamsIO.getValues(searchParams, keys.housing),
      cities: SearchParamsIO.getValues(searchParams, keys.cities),
      speciesAlreadyPresent: SearchParamsIO.getValues(
        searchParams,
        keys.speciesAlreadyPresent,
      ),
      speciesToAvoid: SearchParamsIO.getValues(
        searchParams,
        keys.speciesToAvoid,
      ),
      speciesToHost: SearchParamsIO.getValue(searchParams, keys.speciesToHost),
      zipCode: SearchParamsIO.getValue(searchParams, keys.zipCode),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.displayName, data.displayName);

    SearchParamsIO.setValues(searchParams, keys.garden, data.garden);

    SearchParamsIO.setValues(searchParams, keys.housing, data.housing);

    SearchParamsIO.setValues(searchParams, keys.cities, data.cities);

    SearchParamsIO.setValues(
      searchParams,
      keys.speciesAlreadyPresent,
      data.speciesAlreadyPresent,
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.speciesToAvoid,
      data.speciesToAvoid,
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.speciesToHost,
      data.speciesToHost,
    );

    SearchParamsIO.setValue(searchParams, keys.zipCode, data.zipCode);
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
