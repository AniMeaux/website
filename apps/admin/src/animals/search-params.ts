import { endOfDay } from "#core/dates";
import { AnimalAge } from "@animeaux/core";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import {
  AdoptionOption,
  Diagnosis,
  Gender,
  PickUpReason,
  ScreeningResult,
  Species,
  Status,
} from "@prisma/client";
import { DateTime } from "luxon";

export enum AnimalSort {
  BIRTHDATE = "B",
  NAME = "N",
  PICK_UP = "P",
  VACCINATION = "V",
}

export const ANIMAL_DEFAULT_SORT = AnimalSort.PICK_UP;

export const AnimalSortSearchParams = SearchParamsIO.create({
  keys: { sort: "sort" },

  parseFunction: (searchParams, keys) => {
    return AnimalSortSearchParamsSchema.parse({
      sort: SearchParamsIO.getValue(searchParams, keys.sort),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(
      searchParams,
      keys.sort,
      data.sort === ANIMAL_DEFAULT_SORT ? undefined : data.sort,
    );
  },
});

const AnimalSortSearchParamsSchema = zu.object({
  sort: zu.searchParams.nativeEnum(AnimalSort).default(ANIMAL_DEFAULT_SORT),
});

export enum AnimalSterilization {
  YES = "Y",
  NO = "N",
  NOT_MANDATORY = "NM",
}

export enum AnimalVaccination {
  NONE_PLANNED = "NP",
  NOT_MANDATORY = "NM",
}

export enum AnimalIdentification {
  NO_ICAD_NUMBER = "NICN",
}

export const AnimalSearchParams = SearchParamsIO.create({
  keys: {
    adoptionDateEnd: "ade",
    adoptionDateStart: "ads",
    adoptionOptions: "ao",
    ages: "a",
    birthdateEnd: "be",
    birthdateStart: "bs",
    diagnosis: "dia",
    felvResults: "felv",
    fivResults: "fiv",
    fosterFamiliesId: "ffid",
    genders: "g",
    iCadNumber: "icn",
    identification: "i",
    managersId: "mid",
    nameOrAlias: "q",
    nextVaccinationDateEnd: "nvde",
    nextVaccinationDateStart: "nvds",
    pickUpDateEnd: "pude",
    pickUpDateStart: "puds",
    pickUpLocations: "pul",
    pickUpReasons: "pur",
    species: "sp",
    statuses: "st",
    sterilizations: "stz",
    vaccinations: "v",
  },

  parseFunction: (searchParams, keys) => {
    return AnimalSearchParamsSchema.parse({
      adoptionDateEnd: SearchParamsIO.getValue(
        searchParams,
        keys.adoptionDateEnd,
      ),
      adoptionDateStart: SearchParamsIO.getValue(
        searchParams,
        keys.adoptionDateStart,
      ),
      adoptionOptions: SearchParamsIO.getValues(
        searchParams,
        keys.adoptionOptions,
      ),
      ages: SearchParamsIO.getValues(searchParams, keys.ages),
      birthdateEnd: SearchParamsIO.getValue(searchParams, keys.birthdateEnd),
      birthdateStart: SearchParamsIO.getValue(
        searchParams,
        keys.birthdateStart,
      ),
      diagnosis: SearchParamsIO.getValues(searchParams, keys.diagnosis),
      felvResults: SearchParamsIO.getValues(searchParams, keys.felvResults),
      fivResults: SearchParamsIO.getValues(searchParams, keys.fivResults),
      fosterFamiliesId: SearchParamsIO.getValues(
        searchParams,
        keys.fosterFamiliesId,
      ),
      managersId: SearchParamsIO.getValues(searchParams, keys.managersId),
      nameOrAlias: SearchParamsIO.getValue(searchParams, keys.nameOrAlias),
      nextVaccinationDateEnd: SearchParamsIO.getValue(
        searchParams,
        keys.nextVaccinationDateEnd,
      ),
      nextVaccinationDateStart: SearchParamsIO.getValue(
        searchParams,
        keys.nextVaccinationDateStart,
      ),
      pickUpDateEnd: SearchParamsIO.getValue(searchParams, keys.pickUpDateEnd),
      pickUpDateStart: SearchParamsIO.getValue(
        searchParams,
        keys.pickUpDateStart,
      ),
      pickUpLocations: SearchParamsIO.getValues(
        searchParams,
        keys.pickUpLocations,
      ),
      pickUpReasons: SearchParamsIO.getValues(searchParams, keys.pickUpReasons),
      species: SearchParamsIO.getValues(searchParams, keys.species),
      statuses: SearchParamsIO.getValues(searchParams, keys.statuses),
      sterilizations: SearchParamsIO.getValues(
        searchParams,
        keys.sterilizations,
      ),
      vaccinations: SearchParamsIO.getValues(searchParams, keys.vaccinations),
      identification: SearchParamsIO.getValues(
        searchParams,
        keys.identification,
      ),
      iCadNumber: SearchParamsIO.getValue(searchParams, keys.iCadNumber),
      genders: SearchParamsIO.getValues(searchParams, keys.genders),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(
      searchParams,
      keys.adoptionDateEnd,
      data.adoptionDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.adoptionDateEnd).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.adoptionDateStart,
      data.adoptionDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.adoptionDateStart).toISODate(),
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.adoptionOptions,
      data.adoptionOptions,
    );

    SearchParamsIO.setValues(searchParams, keys.ages, data.ages);

    SearchParamsIO.setValue(
      searchParams,
      keys.birthdateEnd,
      data.birthdateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.birthdateEnd).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.birthdateStart,
      data.birthdateStart == null
        ? undefined
        : DateTime.fromJSDate(data.birthdateStart).toISODate(),
    );

    SearchParamsIO.setValues(searchParams, keys.diagnosis, data.diagnosis);

    SearchParamsIO.setValues(searchParams, keys.felvResults, data.felvResults);

    SearchParamsIO.setValues(searchParams, keys.fivResults, data.fivResults);

    SearchParamsIO.setValues(
      searchParams,
      keys.fosterFamiliesId,
      data.fosterFamiliesId,
    );

    SearchParamsIO.setValues(searchParams, keys.managersId, data.managersId);

    SearchParamsIO.setValue(searchParams, keys.nameOrAlias, data.nameOrAlias);

    SearchParamsIO.setValues(
      searchParams,
      keys.identification,
      data.identification,
    );

    SearchParamsIO.setValue(searchParams, keys.iCadNumber, data.iCadNumber);

    SearchParamsIO.setValues(searchParams, keys.genders, data.genders);

    SearchParamsIO.setValue(
      searchParams,
      keys.nextVaccinationDateEnd,
      data.nextVaccinationDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.nextVaccinationDateEnd).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.nextVaccinationDateStart,
      data.nextVaccinationDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.nextVaccinationDateStart).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.pickUpDateEnd,
      data.pickUpDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.pickUpDateEnd).toISODate(),
    );

    SearchParamsIO.setValue(
      searchParams,
      keys.pickUpDateStart,
      data.pickUpDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.pickUpDateStart).toISODate(),
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.pickUpLocations,
      data.pickUpLocations,
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.pickUpReasons,
      data.pickUpReasons,
    );

    SearchParamsIO.setValues(searchParams, keys.species, data.species);

    SearchParamsIO.setValues(searchParams, keys.statuses, data.statuses);

    SearchParamsIO.setValues(
      searchParams,
      keys.sterilizations,
      data.sterilizations,
    );

    SearchParamsIO.setValues(
      searchParams,
      keys.vaccinations,
      data.vaccinations,
    );
  },
});

const AnimalSearchParamsSchema = zu.object({
  adoptionDateEnd: zu.searchParams.date().transform(endOfDay),
  adoptionDateStart: zu.searchParams.date(),
  adoptionOptions: zu.searchParams.set(
    zu.searchParams.nativeEnum(AdoptionOption),
  ),
  ages: zu.searchParams.set(zu.searchParams.nativeEnum(AnimalAge)),
  birthdateEnd: zu.searchParams.date().transform(endOfDay),
  birthdateStart: zu.searchParams.date(),
  diagnosis: zu.searchParams.set(zu.searchParams.nativeEnum(Diagnosis)),
  felvResults: zu.searchParams.set(zu.searchParams.nativeEnum(ScreeningResult)),
  fivResults: zu.searchParams.set(zu.searchParams.nativeEnum(ScreeningResult)),
  fosterFamiliesId: zu.searchParams.set(
    zu.searchParams
      .string()
      .pipe(zu.string().uuid().optional().catch(undefined)),
  ),
  managersId: zu.searchParams.set(
    zu.searchParams
      .string()
      .pipe(zu.string().uuid().optional().catch(undefined)),
  ),
  nameOrAlias: zu.searchParams.string(),
  nextVaccinationDateEnd: zu.searchParams.date().transform(endOfDay),
  nextVaccinationDateStart: zu.searchParams.date(),
  pickUpDateEnd: zu.searchParams.date().transform(endOfDay),
  pickUpDateStart: zu.searchParams.date(),
  pickUpLocations: zu.searchParams.set(zu.searchParams.string()),
  pickUpReasons: zu.searchParams.set(zu.searchParams.nativeEnum(PickUpReason)),
  species: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
  statuses: zu.searchParams.set(zu.searchParams.nativeEnum(Status)),
  sterilizations: zu.searchParams.set(
    zu.searchParams.nativeEnum(AnimalSterilization),
  ),
  vaccinations: zu.searchParams.set(
    zu.searchParams.nativeEnum(AnimalVaccination),
  ),
  identification: zu.searchParams.set(
    zu.searchParams.nativeEnum(AnimalIdentification),
  ),
  iCadNumber: zu.searchParams.string(),
  genders: zu.searchParams.set(zu.searchParams.nativeEnum(Gender)),
});

export const PickUpLocationSearchParams = SearchParamsIO.create({
  keys: { text: "q" },

  parseFunction: (searchParams, keys) => {
    return PickUpLocationSearchParamsSchema.parse({
      text: SearchParamsIO.getValue(searchParams, keys.text),
    });
  },

  setFunction: (searchParams, data, keys) => {
    SearchParamsIO.setValue(searchParams, keys.text, data.text);
  },
});

const PickUpLocationSearchParamsSchema = zu.object({
  text: zu.searchParams.string(),
});
