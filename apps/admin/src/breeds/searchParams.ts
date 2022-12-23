import { Species } from "@prisma/client";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

enum Keys {
  TEXT = "q",
  SPECIES = "species",
}

export class BreedSearchParams extends URLSearchParams {
  static readonly Keys = Keys;

  getText() {
    return this.get(Keys.TEXT) || null;
  }

  setText(text: string) {
    const copy = new BreedSearchParams(this);

    if (text !== "") {
      copy.set(Keys.TEXT, text);
    } else if (copy.has(Keys.TEXT)) {
      copy.delete(Keys.TEXT);
    }

    return copy;
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).nullable().optional().default(null),
      this.get(Keys.SPECIES)
    );
  }

  setSpecies(species: Species | null) {
    const copy = new BreedSearchParams(this);

    if (species != null) {
      copy.set(Keys.SPECIES, species);
    } else if (copy.has(Keys.SPECIES)) {
      copy.delete(Keys.SPECIES);
    }

    return copy;
  }
}
