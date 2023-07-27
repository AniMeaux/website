import { Species } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { z } from "zod";
import { zfd } from "zod-form-data";

export class BreedSearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
    SPECIES: "species",
    SORT: "sort",
  };

  static readonly Sort = {
    NAME: "NAME",
    ANIMAL_COUNT: "COUNT",
  } as const;

  getName() {
    return zfd
      .text(z.string().optional().catch(undefined))
      .parse(this.get(BreedSearchParams.Keys.NAME));
  }

  setName(name: string) {
    const copy = new BreedSearchParams(this);
    copy.set(BreedSearchParams.Keys.NAME, name);
    return copy;
  }

  deleteName() {
    const copy = new BreedSearchParams(this);
    copy.delete(BreedSearchParams.Keys.NAME);
    return copy;
  }

  getSpecies() {
    return zfd
      .repeatable(z.nativeEnum(Species).array().catch([]))
      .parse(this.getAll(BreedSearchParams.Keys.SPECIES));
  }

  setSpecies(species: Species[]) {
    const copy = new BreedSearchParams(this);
    copy.delete(BreedSearchParams.Keys.SPECIES);
    species.forEach((species) => {
      copy.append(BreedSearchParams.Keys.SPECIES, species);
    });
    return copy;
  }

  getSort() {
    return z
      .nativeEnum(BreedSearchParams.Sort)
      .catch(BreedSearchParams.Sort.NAME)
      .parse(this.get(BreedSearchParams.Keys.SORT));
  }

  setSort(
    sort: (typeof BreedSearchParams.Sort)[keyof typeof BreedSearchParams.Sort]
  ) {
    const copy = new BreedSearchParams(this);
    copy.set(BreedSearchParams.Keys.SORT, sort);
    return copy;
  }

  isEmpty() {
    return this.areFiltersEqual(new BreedSearchParams());
  }

  areFiltersEqual(other: BreedSearchParams) {
    return (
      isEqual(this.getName(), other.getName()) &&
      isEqual(orderBy(this.getSpecies()), orderBy(other.getSpecies()))
    );
  }
}
