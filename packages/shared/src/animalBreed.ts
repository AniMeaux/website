import { AnimalSpecies } from "./animal";

export type AnimalBreed = {
  id: string;
  name: string;
  species: AnimalSpecies;
};

export type DBAnimalBreed = {
  id: string;
  name: string;
  species: AnimalSpecies;
};

export type AnimalBreedFormPayload = {
  name: string;
  species: AnimalSpecies | null;
};

export type CreateAnimalBreedPayload = {
  name: string;
  species: AnimalSpecies;
};

export type UpdateAnimalBreedPayload = {
  id: string;
  name?: string;
  species?: AnimalSpecies;
};
