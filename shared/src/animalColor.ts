import { OperationErrorResult } from "./operationError";

export type AnimalColor = {
  id: string;
  name: string;
};

export type AnimalColorSearchHit = AnimalColor & {
  highlightedName: string;
};

export type AnimalColorOperations = {
  getAllAnimalColors: () => AnimalColor[];
  searchAnimalColors: (params: { search: string }) => AnimalColorSearchHit[];
  getAnimalColor: (params: { id: string }) => AnimalColor;
  createAnimalColor: (params: {
    name: string;
  }) => AnimalColor | OperationErrorResult<"already-exists">;
  updateAnimalColor: (params: {
    id: string;
    name: string;
  }) => AnimalColor | OperationErrorResult<"already-exists">;
  deleteAnimalColor: (params: { id: string }) => boolean;
};
