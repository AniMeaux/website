import { AnimalSpecies } from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import { OperationError } from "../core/operations";

export const ANIMAL_BREED_COLLECTION = "animalBreeds";

export type AnimalBreedFromStore = {
  id: string;
  name: string;
  species: AnimalSpecies;
};

export async function getAnimalBreedFromStore(id: string) {
  const snapshot = await getFirestore()
    .collection(ANIMAL_BREED_COLLECTION)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    throw new OperationError(404);
  }

  return snapshot.data() as AnimalBreedFromStore;
}
