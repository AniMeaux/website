import { Animal, Species, Status } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";
import { SetNonNullable } from "type-fest";
import { ACTIVE_ANIMAL_STATUS } from "~/animals/status";

export function hasUpCommingSterilisation<
  TAnimal extends SerializeFrom<
    Pick<Animal, "birthdate" | "species" | "status"> &
      Partial<Pick<Animal, "isSterilizationMandatory" | "isSterilized">>
  >
>(
  animal: TAnimal
): animal is Required<
  SetNonNullable<TAnimal, "isSterilizationMandatory" | "isSterilized">
> {
  return (
    Boolean(animal.isSterilizationMandatory) &&
    animal.isSterilized === false &&
    (animal.species === Species.CAT || animal.species === Species.DOG) &&
    animal.status !== Status.DECEASED &&
    DateTime.fromISO(animal.birthdate) <= DateTime.now().minus({ months: 6 })
  );
}

export function hasUpCommingVaccination<
  TAnimal extends SerializeFrom<
    Partial<Pick<Animal, "nextVaccinationDate">> & Pick<Animal, "status">
  >
>(
  animal: TAnimal
): animal is Required<SetNonNullable<TAnimal, "nextVaccinationDate">> {
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
  TAnimal extends SerializeFrom<
    Partial<Pick<Animal, "nextVaccinationDate">> & Pick<Animal, "status">
  >
>(
  animal: TAnimal
): animal is Required<SetNonNullable<TAnimal, "nextVaccinationDate">> {
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
