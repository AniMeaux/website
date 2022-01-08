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
  }) => AnimalColor | OperationErrorResult<"name-already-used">;
  updateAnimalColor: (params: {
    id: string;
    name: string;
  }) => AnimalColor | OperationErrorResult<"name-already-used">;
  deleteAnimalColor: (params: { id: string }) => boolean;
};
