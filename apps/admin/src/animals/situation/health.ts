import { Animal, Species, Status } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";
import { SetNonNullable } from "type-fest";
import { ACTIVE_ANIMAL_STATUS } from "~/animals/status";

export function hasUpCommingSterilisation(
  animal: SerializeFrom<
    Pick<
      Animal,
      | "birthdate"
      | "isSterilizationMandatory"
      | "isSterilized"
      | "species"
      | "status"
    >
  >
) {
  return (
    animal.isSterilizationMandatory &&
    !animal.isSterilized &&
    (animal.species === Species.CAT || animal.species === Species.DOG) &&
    animal.status !== Status.DECEASED &&
    DateTime.fromISO(animal.birthdate) <= DateTime.now().minus({ months: 6 })
  );
}

export function hasUpCommingVaccination<
  TAnimal extends SerializeFrom<Pick<Animal, "nextVaccinationDate" | "status">>
>(animal: TAnimal): animal is SetNonNullable<TAnimal, "nextVaccinationDate"> {
  if (
    animal.nextVaccinationDate == null ||
    !ACTIVE_ANIMAL_STATUS.includes(animal.status)
  ) {
    return false;
  }

  const nextVaccinationDate = DateTime.fromISO(animal.nextVaccinationDate);

  return (
    nextVaccinationDate >= DateTime.now().startOf("day") &&
    nextVaccinationDate <= DateTime.now().plus({ days: 15 })
  );
}

export function hasPastVaccination<
  TAnimal extends SerializeFrom<Pick<Animal, "nextVaccinationDate" | "status">>
>(animal: TAnimal): animal is SetNonNullable<TAnimal, "nextVaccinationDate"> {
  if (
    animal.nextVaccinationDate == null ||
    !ACTIVE_ANIMAL_STATUS.includes(animal.status)
  ) {
    return false;
  }

  return (
    DateTime.fromISO(animal.nextVaccinationDate) < DateTime.now().startOf("day")
  );
}

export function formatNextVaccinationDate(
  animal: SetNonNullable<SerializeFrom<Pick<Animal, "nextVaccinationDate">>>
) {
  const nextVaccinationDate = DateTime.fromISO(animal.nextVaccinationDate);

  if (nextVaccinationDate.hasSame(DateTime.now(), "day")) {
    return "aujourd’hui";
  }

  return nextVaccinationDate.toRelative({
    base: DateTime.now().startOf("day"),
  });
}
