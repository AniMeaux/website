import {
  OperationPaginationParams,
  OperationPaginationResult,
} from "./operationPagination";

export type AnimalRelative = {
  id: string;
  avatarId: string;
  name: string;
};

export type AnimalFamily = {
  id: string;
  parents: AnimalRelative[];
  children: AnimalRelative[];
};

export type AnimalRelativeSearchHit = {
  id: string;
  avatarId: string;
  highlightedName: string;
};

export type AnimalFamilySearchHit = {
  id: string;
  parents: AnimalRelativeSearchHit[];
  children: AnimalRelativeSearchHit[];
};

export type AnimalFamilyInput = {
  parentIds: string[];
  childrenIds: string[];
};

export type AnimalFamilyOperations = {
  getAllAnimalFamilies: (
    params: OperationPaginationParams
  ) => OperationPaginationResult<AnimalFamily>;

  // searchAnimalFamilies: (params: { search: string }) => AnimalFamilySearchHit[];

  // getAnimalFamily: (params: { id: string }) => AnimalFamily;

  // createAnimalFamily: (params: AnimalFamilyInput) => AnimalFamily;

  // updateAnimalFamily: (
  //   params: AnimalFamilyInput & { id: string }
  // ) => AnimalFamily;

  // deleteAnimalFamily: (params: { id: string }) => boolean;
};
