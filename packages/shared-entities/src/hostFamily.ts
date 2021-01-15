import { PaginatedRequest } from "./pagination";

export type HostFamily = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type DBHostFamily = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type HostFamilyFormPayload = {
  name: string;
  address: string;
  phone: string;
};

export type CreateHostFamilyPayload = {
  name: string;
  address: string;
  phone: string;
};

export type UpdateHostFamilyPayload = {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
};

export type HostFamilyFilters = PaginatedRequest;
