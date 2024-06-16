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

  parseFunction: (searchParams, keys) => {
    return AnimalSortSearchParamsSchema.parse({
      sort: searchParams.get(keys.sort) ?? undefined,
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.sort == null || data.sort === ANIMAL_DEFAULT_SORT) {
      searchParams.delete(keys.sort);
    } else {
      searchParams.set(keys.sort, data.sort);
    }
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

  parseFunction: (searchParams, keys) => {
    return AnimalSearchParamsSchema.parse({
      adoptionDateEnd: searchParams.get(keys.adoptionDateEnd),
      adoptionDateStart: searchParams.get(keys.adoptionDateStart),
      adoptionOptions: searchParams.getAll(keys.adoptionOptions),
      ages: searchParams.getAll(keys.ages),
      birthdateEnd: searchParams.get(keys.birthdateEnd),
      birthdateStart: searchParams.get(keys.birthdateStart),
      diagnosis: searchParams.getAll(keys.diagnosis),
      felvResults: searchParams.getAll(keys.felvResults),
      fivResults: searchParams.getAll(keys.fivResults),
      fosterFamiliesId: searchParams.getAll(keys.fosterFamiliesId),
      managersId: searchParams.getAll(keys.managersId),
      nameOrAlias: searchParams.get(keys.nameOrAlias),
      nextVaccinationDateEnd: searchParams.get(keys.nextVaccinationDateEnd),
      nextVaccinationDateStart: searchParams.get(keys.nextVaccinationDateStart),
      pickUpDateEnd: searchParams.get(keys.pickUpDateEnd),
      pickUpDateStart: searchParams.get(keys.pickUpDateStart),
      pickUpLocations: searchParams.getAll(keys.pickUpLocations),
      pickUpReasons: searchParams.getAll(keys.pickUpReasons),
      species: searchParams.getAll(keys.species),
      statuses: searchParams.getAll(keys.statuses),
      sterilizations: searchParams.getAll(keys.sterilizations),
      vaccinations: searchParams.getAll(keys.vaccinations),
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.adoptionDateEnd == null) {
      searchParams.delete(keys.adoptionDateEnd);
    } else {
      searchParams.set(
        keys.adoptionDateEnd,
        DateTime.fromJSDate(data.adoptionDateEnd).toISODate(),
      );
    }

    if (data.adoptionDateStart == null) {
      searchParams.delete(keys.adoptionDateStart);
    } else {
      searchParams.set(
        keys.adoptionDateStart,
        DateTime.fromJSDate(data.adoptionDateStart).toISODate(),
      );
    }

    searchParams.delete(keys.adoptionOptions);
    data.adoptionOptions?.forEach((adoptionOption) => {
      searchParams.append(keys.adoptionOptions, adoptionOption);
    });

    searchParams.delete(keys.ages);
    data.ages?.forEach((age) => {
      searchParams.append(keys.ages, age);
    });

    if (data.birthdateEnd == null) {
      searchParams.delete(keys.birthdateEnd);
    } else {
      searchParams.set(
        keys.birthdateEnd,
        DateTime.fromJSDate(data.birthdateEnd).toISODate(),
      );
    }

    if (data.birthdateStart == null) {
      searchParams.delete(keys.birthdateStart);
    } else {
      searchParams.set(
        keys.birthdateStart,
        DateTime.fromJSDate(data.birthdateStart).toISODate(),
      );
    }

    searchParams.delete(keys.diagnosis);
    data.diagnosis?.forEach((diagnosis) => {
      searchParams.append(keys.diagnosis, diagnosis);
    });

    searchParams.delete(keys.felvResults);
    data.felvResults?.forEach((result) => {
      searchParams.append(keys.felvResults, result);
    });

    searchParams.delete(keys.fivResults);
    data.fivResults?.forEach((result) => {
      searchParams.append(keys.fivResults, result);
    });

    searchParams.delete(keys.fosterFamiliesId);
    data.fosterFamiliesId?.forEach((fosterFamilyId) => {
      searchParams.append(keys.fosterFamiliesId, fosterFamilyId);
    });

    searchParams.delete(keys.managersId);
    data.managersId?.forEach((managerId) => {
      searchParams.append(keys.managersId, managerId);
    });

    if (data.nameOrAlias == null) {
      searchParams.delete(keys.nameOrAlias);
    } else {
      searchParams.set(keys.nameOrAlias, data.nameOrAlias);
    }

    if (data.nextVaccinationDateEnd == null) {
      searchParams.delete(keys.nextVaccinationDateEnd);
    } else {
      searchParams.set(
        keys.nextVaccinationDateEnd,
        DateTime.fromJSDate(data.nextVaccinationDateEnd).toISODate(),
      );
    }

    if (data.nextVaccinationDateStart == null) {
      searchParams.delete(keys.nextVaccinationDateStart);
    } else {
      searchParams.set(
        keys.nextVaccinationDateStart,
        DateTime.fromJSDate(data.nextVaccinationDateStart).toISODate(),
      );
    }

    if (data.pickUpDateEnd == null) {
      searchParams.delete(keys.pickUpDateEnd);
    } else {
      searchParams.set(
        keys.pickUpDateEnd,
        DateTime.fromJSDate(data.pickUpDateEnd).toISODate(),
      );
    }

    if (data.pickUpDateStart == null) {
      searchParams.delete(keys.pickUpDateStart);
    } else {
      searchParams.set(
        keys.pickUpDateStart,
        DateTime.fromJSDate(data.pickUpDateStart).toISODate(),
      );
    }

    searchParams.delete(keys.pickUpLocations);
    data.pickUpLocations?.forEach((pickUpLocation) => {
      searchParams.append(keys.pickUpLocations, pickUpLocation);
    });

    searchParams.delete(keys.pickUpReasons);
    data.pickUpReasons?.forEach((pickUpReason) => {
      searchParams.append(keys.pickUpReasons, pickUpReason);
    });

    searchParams.delete(keys.species);
    data.species?.forEach((species) => {
      searchParams.append(keys.species, species);
    });

    searchParams.delete(keys.statuses);
    data.statuses?.forEach((status) => {
      searchParams.append(keys.statuses, status);
    });

    searchParams.delete(keys.sterilizations);
    data.sterilizations?.forEach((sterilization) => {
      searchParams.append(keys.sterilizations, sterilization);
    });

    searchParams.delete(keys.vaccinations);
    data.vaccinations?.forEach((vaccination) => {
      searchParams.append(keys.vaccinations, vaccination);
    });
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

  parseFunction: (searchParams, keys) => {
    return PickUpLocationSearchParamsSchema.parse({
      text: searchParams.get(keys.text),
    });
  },

  setFunction: (searchParams, data, keys) => {
    if (data.text == null) {
      searchParams.delete(keys.text);
    } else {
      searchParams.set(keys.text, data.text);
    }
  },
});

const PickUpLocationSearchParamsSchema = zu.object({
  text: zu.searchParams.string(),
});
