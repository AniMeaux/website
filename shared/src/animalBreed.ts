import { Species } from "@prisma/client";
import { OperationErrorResult } from "./operationError";

export type AnimalBreed = {
  id: string;
  name: string;
  species: Species;
};

export type AnimalBreedSearchHit = AnimalBreed & {
  highlightedName: string;
};

export type AnimalBreedOperations = {
  getAllAnimalBreeds: () => AnimalBreed[];
  searchAnimalBreeds: (params: {
    search: string;
    species?: Species;
  }) => AnimalBreedSearchHit[];
  getAnimalBreed: (params: { id: string }) => AnimalBreed;
  createAnimalBreed: (params: {
    name: string;
    species: Species;
  }) => AnimalBreed | OperationErrorResult<"already-exists">;
  updateAnimalBreed: (params: {
    id: string;
    name: string;
    species: Species;
  }) => AnimalBreed | OperationErrorResult<"already-exists">;
  deleteAnimalBreed: (params: { id: string }) => boolean;
};
