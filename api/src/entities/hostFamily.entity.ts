import { getFirestore } from "firebase-admin/firestore";
import { OperationError } from "../core/operations";

export const HOST_FAMILY_COLLECTION = "hostFamilies";

export type HostFamilyFromStore = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
};

export async function getHostFamilyFromStore(id: string) {
  const snapshot = await getFirestore()
    .collection(HOST_FAMILY_COLLECTION)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    throw new OperationError(404);
  }

  return snapshot.data() as HostFamilyFromStore;
}

export function getFormattedAddress(hostFamily: HostFamilyFromStore) {
  return `${hostFamily.address}, ${hostFamily.zipCode} ${hostFamily.city}`;
}
