import { OperationErrorResult } from "./operationError";

export type FosterFamilyBrief = {
  id: string;
  name: string;
  location: string;
};

export type FosterFamilySearchHit = {
  id: string;
  name: string;
  highlightedName: string;
};

export type FosterFamily = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
  formattedAddress: string;
  hostedAnimals: FosterFamilyHostedAnimal[];
};

export type FosterFamilyHostedAnimal = {
  id: string;
  avatarId: string;
  name: string;
};

export type FosterFamilyOperations = {
  getAllFosterFamilies: () => FosterFamilyBrief[];
  searchFosterFamilies: (params: { search: string }) => FosterFamilySearchHit[];
  getFosterFamily: (params: { id: string }) => FosterFamily;
  createFosterFamily: (params: {
    name: string;
    phone: string;
    email: string;
    zipCode: string;
    city: string;
    address: string;
  }) => FosterFamily | OperationErrorResult<"already-exists">;
  updateFosterFamily: (params: {
    id: string;
    name: string;
    phone: string;
    email: string;
    zipCode: string;
    city: string;
    address: string;
  }) => FosterFamily | OperationErrorResult<"already-exists">;
  deleteFosterFamily: (params: { id: string }) => boolean;
};
