import { AnimalSpecies } from "./animal";
import { OperationErrorResult } from "./operationError";

export type AnimalBreed = {
  id: string;
  name: string;
  species: AnimalSpecies;
};

export type AnimalBreedSearchHit = AnimalBreed & {
  highlightedName: string;
};

export type AnimalBreedOperations = {
  getAllAnimalBreeds: () => AnimalBreed[];
  searchAnimalBreeds: (params: {
    search: string;
    species?: AnimalSpecies;
  }) => AnimalBreedSearchHit[];
  getAnimalBreed: (params: { id: string }) => AnimalBreed;
  createAnimalBreed: (params: {
    name: string;
    species: AnimalSpecies;
  }) => AnimalBreed | OperationErrorResult<"already-exists">;
  updateAnimalBreed: (params: {
    id: string;
    name: string;
    species: AnimalSpecies;
  }) => AnimalBreed | OperationErrorResult<"already-exists">;
  deleteAnimalBreed: (params: { id: string }) => boolean;
};
