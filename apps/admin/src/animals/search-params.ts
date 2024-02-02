import { endOfDay } from "#core/dates";
import { AnimalAge } from "@animeaux/core";
import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import {
  AdoptionOption,
  Diagnosis,
  PickUpReason,
  ScreeningResult,
  Species,
  Status,
} from "@prisma/client";

export enum AnimalSort {
  BIRTHDATE = "B",
  NAME = "N",
  PICK_UP = "P",
  VACCINATION = "V",
}

export const ANIMAL_DEFAULT_SORT = AnimalSort.PICK_UP;

export enum AnimalSterilization {
  YES = "Y",
  NO = "N",
  NOT_MANDATORY = "NM",
}

export enum AnimalVaccination {
  NONE_PLANNED = "NP",
  NOT_MANDATORY = "NM",
}

export const AnimalSearchParams = SearchParamsDelegate.create({
  adoptionDateEnd: {
    key: "ade",
    schema: zu.searchParams.date().transform(endOfDay),
  },
  adoptionDateStart: {
    key: "ads",
    schema: zu.searchParams.date(),
  },
  adoptionOptions: {
    key: "ao",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(AdoptionOption)),
  },
  ages: {
    key: "a",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(AnimalAge)),
  },
  birthdateEnd: {
    key: "be",
    schema: zu.searchParams.date().transform(endOfDay),
  },
  birthdateStart: {
    key: "bs",
    schema: zu.searchParams.date(),
  },
  diagnosis: {
    key: "dia",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(Diagnosis)),
  },
  felvResults: {
    key: "felv",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(ScreeningResult)),
  },
  fivResults: {
    key: "fiv",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(ScreeningResult)),
  },
  fosterFamiliesId: {
    key: "ffid",
    schema: zu.searchParams.set(
      zu.searchParams
        .string()
        .pipe(zu.string().uuid().optional().catch(undefined)),
    ),
  },
  managersId: {
    key: "mid",
    schema: zu.searchParams.set(
      zu.searchParams
        .string()
        .pipe(zu.string().uuid().optional().catch(undefined)),
    ),
  },
  nameOrAlias: {
    key: "q",
    schema: zu.searchParams.string(),
  },
  vaccination: {
    key: "v",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(AnimalVaccination)),
  },
  pickUpDateEnd: {
    key: "pude",
    schema: zu.searchParams.date().transform(endOfDay),
  },
  pickUpDateStart: {
    key: "puds",
    schema: zu.searchParams.date(),
  },
  pickUpLocations: {
    key: "pul",
    schema: zu.searchParams.set(zu.searchParams.string()),
  },
  pickUpReasons: {
    key: "pur",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(PickUpReason)),
  },
  sort: zu.searchParams.nativeEnum(AnimalSort).default(ANIMAL_DEFAULT_SORT),
  species: {
    key: "sp",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(Species)),
  },
  statuses: {
    key: "st",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(Status)),
  },
  sterilizations: {
    key: "stz",
    schema: zu.searchParams.set(
      zu.searchParams.nativeEnum(AnimalSterilization),
    ),
  },
  nextVaccinationDateEnd: {
    key: "nvde",
    schema: zu.searchParams.date().transform(endOfDay),
  },
  nextVaccinationDateStart: {
    key: "nvds",
    schema: zu.searchParams.date(),
  },
});

export const PickUpLocationSearchParams = SearchParamsDelegate.create({
  text: { key: "q", schema: zu.searchParams.string() },
});
