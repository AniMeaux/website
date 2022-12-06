import { Animal } from "@prisma/client";
import { SearchClient } from "algoliasearch";

type AnimalFromAlgolia = Pick<
  Animal,
  "alias" | "name" | "pickUpLocation" | "species" | "status"
>;

export function createAnimalDelegate(client: SearchClient) {
  const index = client.initIndex("animals");

  return {
    indexName: index.indexName,

    async update(animalId: Animal["id"], data: Partial<AnimalFromAlgolia>) {
      await index.partialUpdateObject({ ...data, objectID: animalId });
    },
  };
}
