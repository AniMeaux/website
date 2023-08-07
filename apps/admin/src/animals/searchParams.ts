import { AnimalAge } from "@animeaux/shared";
import {
  AdoptionOption,
  PickUpReason,
  ScreeningResult,
  Species,
  Status,
} from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { endOfDay, startOfDay } from "~/core/dates";
import { zsp } from "~/core/schemas";
import { createSearchParams } from "~/core/searchParams";

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

export const AnimalSearchParams = createSearchParams({
  adoptionDateEnd: { key: "ade", schema: zsp.date(endOfDay) },
  adoptionDateStart: { key: "ads", schema: zsp.date(startOfDay) },
  adoptionOptions: { key: "ao", schema: zsp.set(z.nativeEnum(AdoptionOption)) },
  ages: { key: "a", schema: zsp.set(z.nativeEnum(AnimalAge)) },
  birthdateEnd: { key: "be", schema: zsp.date(endOfDay) },
  birthdateStart: { key: "bs", schema: zsp.date(startOfDay) },
  felvResults: { key: "felv", schema: zsp.set(z.nativeEnum(ScreeningResult)) },
  fivResults: { key: "fiv", schema: zsp.set(z.nativeEnum(ScreeningResult)) },
  fosterFamiliesId: { key: "ffid", schema: zsp.set(z.string().uuid()) },
  managersId: { key: "mid", schema: zsp.set(z.string().uuid()) },
  nameOrAlias: { key: "q", schema: zsp.text() },
  noVaccination: { key: "nv", schema: zsp.checkbox() },
  pickUpDateEnd: { key: "pude", schema: zsp.date(endOfDay) },
  pickUpDateStart: { key: "puds", schema: zsp.date(startOfDay) },
  pickUpLocations: { key: "pul", schema: zsp.set(zfd.text()) },
  pickUpReasons: { key: "pur", schema: zsp.set(z.nativeEnum(PickUpReason)) },
  sort: zsp.requiredEnum(AnimalSort, ANIMAL_DEFAULT_SORT),
  species: { key: "sp", schema: zsp.set(z.nativeEnum(Species)) },
  statuses: { key: "st", schema: zsp.set(z.nativeEnum(Status)) },
  sterilizations: {
    key: "stz",
    schema: zsp.set(z.nativeEnum(AnimalSterilization)),
  },
  nextVaccinationDateEnd: { key: "nvde", schema: zsp.date(endOfDay) },
  nextVaccinationDateStart: { key: "nvds", schema: zsp.date(startOfDay) },
});

export const PickUpLocationSearchParams = createSearchParams({
  text: { key: "q", schema: zsp.text() },
});
