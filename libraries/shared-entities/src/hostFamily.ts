import { PaginatedRequest } from "./pagination";

export type HostFamily = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
};

export type HostFamilyFormPayload = {
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
};

export type CreateHostFamilyPayload = {
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
};

export type UpdateHostFamilyPayload = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  zipCode?: string;
  city?: string;
  address?: string;
};

export type HostFamilyFilters = PaginatedRequest;
