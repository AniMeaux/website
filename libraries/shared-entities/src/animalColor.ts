import { SearchFilter } from "./pagination";

export type AnimalColor = {
  id: string;
  name: string;
};

export type AnimalColorFormPayload = {
  name: string;
};

export type CreateAnimalColorPayload = {
  name: string;
};

export type UpdateAnimalColorPayload = {
  id: string;
  name?: string;
};

export type AnimalColorSearch = SearchFilter;
