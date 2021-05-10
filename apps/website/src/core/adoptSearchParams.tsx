import {
  AnimalAge,
  AnimalSpecies,
  isAnimalAge,
  isAnimalSpecies,
} from "@animeaux/shared-entities/build/animal";

type AdoptSearchParamsConstructorParams = {
  animalSpecies?: AnimalSpecies | null;
  animalAge?: AnimalAge | null;
};

export class AdoptSearchParams {
  readonly animalSpecies: AnimalSpecies | null = null;
  readonly animalAge: AnimalAge | null = null;

  static fromParams(params: string[] = []): AdoptSearchParams {
    const [species, age] = params.map((p) => p.toUpperCase());
    let animalSpecies: AnimalSpecies | null = null;
    let animalAge: AnimalAge | null = null;

    if (species != null && isAnimalSpecies(species)) {
      animalSpecies = species;

      if (age != null && isAnimalAge(age)) {
        animalAge = age;
      }
    }

    return new AdoptSearchParams({ animalSpecies, animalAge });
  }

  constructor({
    animalAge = null,
    animalSpecies = null,
  }: AdoptSearchParamsConstructorParams = {}) {
    this.animalAge = animalAge;
    this.animalSpecies = animalSpecies;
  }

  withSpecies(animalSpecies: AnimalSpecies | null): AdoptSearchParams {
    return new AdoptSearchParams({ animalSpecies, animalAge: this.animalAge });
  }

  withAge(animalAge: AnimalAge | null): AdoptSearchParams {
    return new AdoptSearchParams({
      animalSpecies: this.animalSpecies,
      animalAge,
    });
  }

  toUrl(): string {
    let url = "/adopt";

    if (this.animalSpecies != null) {
      url += `/${this.animalSpecies.toLowerCase()}`;

      if (this.animalAge != null) {
        url += `/${this.animalAge.toLowerCase()}`;
      }
    }

    return url;
  }
}
