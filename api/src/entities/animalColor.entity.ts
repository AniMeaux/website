import { getFirestore } from "firebase-admin/firestore";
import { OperationError } from "../core/operations";

export const ANIMAL_COLOR_COLLECTION = "animalColors";

export type AnimalColorFromStore = {
  id: string;
  name: string;
};

export async function getAnimalColorFromStore(id: string) {
  const snapshot = await getFirestore()
    .collection(ANIMAL_COLOR_COLLECTION)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    throw new OperationError(404);
  }

  return snapshot.data() as AnimalColorFromStore;
}
