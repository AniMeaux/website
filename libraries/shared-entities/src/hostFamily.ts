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

// The result can be used as Google Maps search.
export function getHostFamilyFullAddress(hostFamily: HostFamily) {
  return `${hostFamily.address}, ${hostFamily.zipCode} ${hostFamily.city}`;
}
