import { endOfDay } from "#core/dates";
import { AnimalAge } from "@animeaux/core";
import { SearchParamsIO } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import {
  AdoptionOption,
  Diagnosis,
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

  parseFunction: ({ keys, getValue }) => {
    return AnimalSortSearchParamsSchema.parse({
      sort: getValue(keys.sort),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(
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

  parseFunction: ({ keys, getValue, getValues }) => {
    return AnimalSearchParamsSchema.parse({
      adoptionDateEnd: getValue(keys.adoptionDateEnd),
      adoptionDateStart: getValue(keys.adoptionDateStart),
      adoptionOptions: getValues(keys.adoptionOptions),
      ages: getValues(keys.ages),
      birthdateEnd: getValue(keys.birthdateEnd),
      birthdateStart: getValue(keys.birthdateStart),
      diagnosis: getValues(keys.diagnosis),
      felvResults: getValues(keys.felvResults),
      fivResults: getValues(keys.fivResults),
      fosterFamiliesId: getValues(keys.fosterFamiliesId),
      managersId: getValues(keys.managersId),
      nameOrAlias: getValue(keys.nameOrAlias),
      nextVaccinationDateEnd: getValue(keys.nextVaccinationDateEnd),
      nextVaccinationDateStart: getValue(keys.nextVaccinationDateStart),
      pickUpDateEnd: getValue(keys.pickUpDateEnd),
      pickUpDateStart: getValue(keys.pickUpDateStart),
      pickUpLocations: getValues(keys.pickUpLocations),
      pickUpReasons: getValues(keys.pickUpReasons),
      species: getValues(keys.species),
      statuses: getValues(keys.statuses),
      sterilizations: getValues(keys.sterilizations),
      vaccinations: getValues(keys.vaccinations),
    });
  },

  setFunction: (data, { keys, setValue, setValues }) => {
    setValue(
      keys.adoptionDateEnd,
      data.adoptionDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.adoptionDateEnd).toISODate(),
    );

    setValue(
      keys.adoptionDateStart,
      data.adoptionDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.adoptionDateStart).toISODate(),
    );

    setValues(keys.adoptionOptions, data.adoptionOptions);

    setValues(keys.ages, data.ages);

    setValue(
      keys.birthdateEnd,
      data.birthdateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.birthdateEnd).toISODate(),
    );

    setValue(
      keys.birthdateStart,
      data.birthdateStart == null
        ? undefined
        : DateTime.fromJSDate(data.birthdateStart).toISODate(),
    );

    setValues(keys.diagnosis, data.diagnosis);

    setValues(keys.felvResults, data.felvResults);

    setValues(keys.fivResults, data.fivResults);

    setValues(keys.fosterFamiliesId, data.fosterFamiliesId);

    setValues(keys.managersId, data.managersId);

    setValue(keys.nameOrAlias, data.nameOrAlias);

    setValue(
      keys.nextVaccinationDateEnd,
      data.nextVaccinationDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.nextVaccinationDateEnd).toISODate(),
    );

    setValue(
      keys.nextVaccinationDateStart,
      data.nextVaccinationDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.nextVaccinationDateStart).toISODate(),
    );

    setValue(
      keys.pickUpDateEnd,
      data.pickUpDateEnd == null
        ? undefined
        : DateTime.fromJSDate(data.pickUpDateEnd).toISODate(),
    );

    setValue(
      keys.pickUpDateStart,
      data.pickUpDateStart == null
        ? undefined
        : DateTime.fromJSDate(data.pickUpDateStart).toISODate(),
    );

    setValues(keys.pickUpLocations, data.pickUpLocations);

    setValues(keys.pickUpReasons, data.pickUpReasons);

    setValues(keys.species, data.species);

    setValues(keys.statuses, data.statuses);

    setValues(keys.sterilizations, data.sterilizations);

    setValues(keys.vaccinations, data.vaccinations);
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
});

export const PickUpLocationSearchParams = SearchParamsIO.create({
  keys: { text: "q" },

  parseFunction: ({ keys, getValue }) => {
    return PickUpLocationSearchParamsSchema.parse({
      text: getValue(keys.text),
    });
  },

  setFunction: (data, { keys, setValue }) => {
    setValue(keys.text, data.text);
  },
});

const PickUpLocationSearchParamsSchema = zu.object({
  text: zu.searchParams.string(),
});
