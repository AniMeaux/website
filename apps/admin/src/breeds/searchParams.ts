import { Species } from "@prisma/client";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class BreedSearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
    SPECIES: "species",
  };

  getName() {
    return this.get(BreedSearchParams.Keys.NAME)?.trim() || null;
  }

  setName(name: string) {
    const copy = new BreedSearchParams(this);

    name = name.trim();
    if (name !== "") {
      copy.set(BreedSearchParams.Keys.NAME, name);
    } else if (copy.has(BreedSearchParams.Keys.NAME)) {
      copy.delete(BreedSearchParams.Keys.NAME);
    }

    return copy;
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).optional().nullable().default(null),
      this.get(BreedSearchParams.Keys.SPECIES)
    );
  }

  setSpecies(species: null | Species) {
    const copy = new BreedSearchParams(this);

    if (species != null) {
      copy.set(BreedSearchParams.Keys.SPECIES, species);
    } else if (copy.has(BreedSearchParams.Keys.SPECIES)) {
      copy.delete(BreedSearchParams.Keys.SPECIES);
    }

    return copy;
  }
}
