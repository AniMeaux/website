import { Animal, Species, Status } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { DateTime } from "luxon";

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
