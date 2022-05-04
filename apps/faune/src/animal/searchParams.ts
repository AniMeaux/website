import {
  ALL_ANIMAL_SPECIES,
  ALL_ANIMAL_STATUSES,
  AnimalSpecies,
  AnimalStatus,
} from "@animeaux/shared";
import { QSearchParams } from "~/core/formElements/searchParamsInput";

export class AnimalSearchParams extends QSearchParams {
  getStatus() {
    return this.getAll("status").filter((value): value is AnimalStatus =>
      ALL_ANIMAL_STATUSES.includes(value as AnimalStatus)
    );
  }

  setStatus(status: AnimalStatus[]) {
    return this.setAll("status", status);
  }

  getSpecies() {
    return this.getAll("species").filter((value): value is AnimalSpecies =>
      ALL_ANIMAL_SPECIES.includes(value as AnimalSpecies)
    );
  }

  setSpecies(species: AnimalSpecies[]) {
    return this.setAll("species", species);
  }

  getFilterCount() {
    return (
      super.getFilterCount() +
      this.getStatus().length +
      this.getSpecies().length
    );
  }
}
