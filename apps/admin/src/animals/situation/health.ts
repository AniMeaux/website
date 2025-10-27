import { ACTIVE_ANIMAL_STATUS, SORTED_STATUS } from "#animals/status";
import type { Animal } from "@animeaux/prisma/client";
import { Diagnosis, Species, Status } from "@animeaux/prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import difference from "lodash.difference";
import { DateTime } from "luxon";
import type { SetNonNullable } from "type-fest";

export const HAS_UP_COMMING_STERILISATION_CONDITIONS = {
  isSterilizationMandatory: true,
  isSterilized: false,
  species: [Species.CAT, Species.DOG],
  status: difference(SORTED_STATUS, [
    Status.DECEASED,
    Status.LOST,
    Status.RETURNED,
    Status.TRANSFERRED,
  ]),
  ageInMonths: 6,
};

export function hasUpCommingSterilisation<
  TAnimal extends SerializeFrom<
    Pick<Animal, "birthdate" | "species" | "status"> &
      Partial<Pick<Animal, "isSterilizationMandatory" | "isSterilized">>
  >,
>(
  animal: TAnimal,
): animal is Required<
  SetNonNullable<TAnimal, "isSterilizationMandatory" | "isSterilized">
> {
  return (
    animal.isSterilizationMandatory ===
      HAS_UP_COMMING_STERILISATION_CONDITIONS.isSterilizationMandatory &&
    animal.isSterilized ===
      HAS_UP_COMMING_STERILISATION_CONDITIONS.isSterilized &&
    HAS_UP_COMMING_STERILISATION_CONDITIONS.species.includes(animal.species) &&
    HAS_UP_COMMING_STERILISATION_CONDITIONS.status.includes(animal.status) &&
    DateTime.now().diff(DateTime.fromISO(animal.birthdate), "months").months >=
      HAS_UP_COMMING_STERILISATION_CONDITIONS.ageInMonths
  );
}

export const HAS_UP_COMMING_VACCINATION_CONDITIONS = {
  status: ACTIVE_ANIMAL_STATUS,
  nextVaccinationInDays: 14,
};

type NextVaccinationState = "none" | "past" | "up-comming" | "planned";

export function getNextVaccinationState(
  nextDate: string,
  status: Status,
): NextVaccinationState {
  if (!HAS_UP_COMMING_VACCINATION_CONDITIONS.status.includes(status)) {
    return "none";
  }

  const diffInDays = DateTime.fromISO(nextDate).diff(
    DateTime.now().startOf("day"),
    "days",
  ).days;

  return diffInDays < 0
    ? "past"
    : diffInDays <= HAS_UP_COMMING_VACCINATION_CONDITIONS.nextVaccinationInDays
      ? "up-comming"
      : "planned";
}

export function formatNextVaccinationDate(nextDate: string) {
  const nextVaccinationDate = DateTime.fromISO(nextDate);

  if (nextVaccinationDate.hasSame(DateTime.now(), "day")) {
    return "aujourd’hui";
  }

  return nextVaccinationDate.toRelative({
    base: DateTime.now().startOf("day"),
  });
}

export const HAS_UP_COMMING_DIAGNOSE_CONDITIONS = {
  ageInMonths: 8,
  diagnosis: [Diagnosis.UNKNOWN],
  species: [Species.DOG],
  status: ACTIVE_ANIMAL_STATUS.concat([Status.ADOPTED]),
};
