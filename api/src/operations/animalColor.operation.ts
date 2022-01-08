import {
  AnimalColor,
  AnimalColorSearchHit,
  AnimalColorOperations,
  UserGroup,
} from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuid } from "uuid";
import { object, string } from "yup";
import { AlgoliaClient, DEFAULT_SEARCH_OPTIONS } from "../core/algolia";
import { assertUserHasGroups } from "../core/authentication";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import {
  AnimalColorFromStore,
  ANIMAL_COLOR_COLLECTION,
  getAnimalColorFromStore,
} from "../entities/animalColor.entity";

const AnimalColorIndex = AlgoliaClient.initIndex(ANIMAL_COLOR_COLLECTION);

export const animalColorOperations: OperationsImpl<AnimalColorOperations> = {
  async getAllAnimalColors(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const snapshots = await getFirestore()
      .collection(ANIMAL_COLOR_COLLECTION)
      .orderBy("name")
      .get();

    return snapshots.docs.map<AnimalColor>((doc) => {
      const animalColor = doc.data() as AnimalColorFromStore;

      return {
        id: animalColor.id,
        name: animalColor.name,
      };
    });
  },

  async searchAnimalColors(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"searchAnimalColors">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await AnimalColorIndex.search<AnimalColorFromStore>(
      params.search ?? "",
      DEFAULT_SEARCH_OPTIONS
    );

    return result.hits.map<AnimalColorSearchHit>((hit) => ({
      id: hit.id,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  },

  async getAnimalColor(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAnimalColor">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const animalColor = await getAnimalColorFromStore(params.id);

    return {
      id: animalColor.id,
      name: animalColor.name,
    };
  },

  async createAnimalColor(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createAnimalColor">(
      object({ name: string().trim().required() }),
      rawParams
    );

    const animalColor: AnimalColorFromStore = { id: uuid(), ...params };

    await assertIsValid(animalColor);

    await getFirestore()
      .collection(ANIMAL_COLOR_COLLECTION)
      .doc(animalColor.id)
      .set(animalColor);

    await AnimalColorIndex.saveObject({
      ...animalColor,
      objectID: animalColor.id,
    });

    return {
      id: animalColor.id,
      name: animalColor.name,
    };
  },

  async updateAnimalColor(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateAnimalColor">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
      }),
      rawParams
    );

    const currentAnimalColor = await getAnimalColorFromStore(params.id);
    const newAnimalColor: AnimalColorFromStore = {
      ...currentAnimalColor,
      ...params,
    };

    await assertIsValid(newAnimalColor, currentAnimalColor);

    await getFirestore()
      .collection(ANIMAL_COLOR_COLLECTION)
      .doc(newAnimalColor.id)
      .update(newAnimalColor);

    await AnimalColorIndex.partialUpdateObject({
      ...newAnimalColor,
      objectID: newAnimalColor.id,
    });

    return {
      id: newAnimalColor.id,
      name: newAnimalColor.name,
    };
  },

  async deleteAnimalColor(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteAnimalColor">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    // TODO: Check that the color is not referenced by an animal.
    await getFirestore()
      .collection(ANIMAL_COLOR_COLLECTION)
      .doc(params.id)
      .delete();

    await AnimalColorIndex.deleteObject(params.id);
    return true;
  },
};

async function assertIsValid(
  update: AnimalColorFromStore,
  current?: AnimalColorFromStore
) {
  if (current == null || update.name !== current.name) {
    const snapshot = await getFirestore()
      .collection(ANIMAL_COLOR_COLLECTION)
      .where("name", "==", update.name)
      .get();

    if (!snapshot.empty) {
      throw new OperationError<"createAnimalColor" | "updateAnimalColor">(404, {
        code: "name-already-used",
      });
    }
  }
}
