import { Species } from "@prisma/client";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class BreedSearchParams extends URLSearchParams {
  static readonly Keys = {
    TEXT: "q",
    SPECIES: "species",
  };

  getText() {
    return this.get(BreedSearchParams.Keys.TEXT) || null;
  }

  setText(text: string) {
    const copy = new BreedSearchParams(this);

    if (text !== "") {
      copy.set(BreedSearchParams.Keys.TEXT, text);
    } else if (copy.has(BreedSearchParams.Keys.TEXT)) {
      copy.delete(BreedSearchParams.Keys.TEXT);
    }

    return copy;
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).nullable().optional().default(null),
      this.get(BreedSearchParams.Keys.SPECIES)
    );
  }

  setSpecies(species: Species | null) {
    const copy = new BreedSearchParams(this);

    if (species != null) {
      copy.set(BreedSearchParams.Keys.SPECIES, species);
    } else if (copy.has(BreedSearchParams.Keys.SPECIES)) {
      copy.delete(BreedSearchParams.Keys.SPECIES);
    }

    return copy;
  }
}
