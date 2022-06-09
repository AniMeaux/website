import { OperationErrorResult } from "./operationError";

export type HostFamilyBrief = {
  id: string;
  name: string;
  location: string;
};

export type HostFamilySearchHit = {
  id: string;
  name: string;
  highlightedName: string;
};

export type HostFamily = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
  formattedAddress: string;
  hostedAnimals: HostFamilyHostedAnimal[];
};

export type HostFamilyHostedAnimal = {
  id: string;
  avatarId: string;
  name: string;
};

export type HostFamilyOperations = {
  getAllHostFamilies: () => HostFamilyBrief[];
  searchHostFamilies: (params: { search: string }) => HostFamilySearchHit[];
  getHostFamily: (params: { id: string }) => HostFamily;
  createHostFamily: (params: {
    name: string;
    phone: string;
    email: string;
    zipCode: string;
    city: string;
    address: string;
  }) => HostFamily | OperationErrorResult<"already-exists">;
  updateHostFamily: (params: {
    id: string;
    name: string;
    phone: string;
    email: string;
    zipCode: string;
    city: string;
    address: string;
  }) => HostFamily | OperationErrorResult<"already-exists">;
  deleteHostFamily: (params: { id: string }) => boolean;
};
