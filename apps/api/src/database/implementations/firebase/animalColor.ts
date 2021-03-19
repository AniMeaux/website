import {
  AnimalColor,
  AnimalColorSearch,
  CreateAnimalColorPayload,
  ErrorCode,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateAnimalColorPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import { v4 as uuid } from "uuid";
import { AnimalColorDatabase } from "../../databaseType";
import { AlgoliaClient } from "./algoliaClient";

const AnimalColorsIndex = AlgoliaClient.initIndex("animalColors");

async function assertAnimalColorNameNotUsed(name: string) {
  const animalColorSnapshot = await admin
    .firestore()
    .collection("animalColors")
    .where("name", "==", name)
    .get();

  if (!animalColorSnapshot.empty) {
    throw new UserInputError(ErrorCode.ANIMAL_COLOR_ALREADY_EXIST);
  }
}

export const animalColorDatabase: AnimalColorDatabase = {
  async getAllAnimalColors(
    parameters: PaginatedRequestParameters<AnimalColorSearch>
  ): Promise<PaginatedResponse<AnimalColor>> {
    const result = await AnimalColorsIndex.search<AnimalColor>(
      parameters.search ?? "",
      { page: parameters.page ?? 0 }
    );

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAnimalColor(id: string): Promise<AnimalColor | null> {
    const animalColorSnapshot = await admin
      .firestore()
      .collection("animalColors")
      .doc(id)
      .get();

    return (animalColorSnapshot.data() as AnimalColor) ?? null;
  },

  async createAnimalColor({
    name,
  }: CreateAnimalColorPayload): Promise<AnimalColor> {
    name = name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.ANIMAL_COLOR_MISSING_NAME);
    }

    await assertAnimalColorNameNotUsed(name);

    const animalColor: AnimalColor = {
      id: uuid(),
      name,
    };

    await admin
      .firestore()
      .collection("animalColors")
      .doc(animalColor.id)
      .set(animalColor);

    await AnimalColorsIndex.saveObject({
      ...animalColor,
      objectID: animalColor.id,
    });

    return animalColor;
  },

  async updateAnimalColor({
    id,
    name,
  }: UpdateAnimalColorPayload): Promise<AnimalColor> {
    const animalColor = await animalColorDatabase.getAnimalColor(id);
    if (animalColor == null) {
      throw new UserInputError(ErrorCode.ANIMAL_COLOR_NOT_FOUND);
    }

    const payload: Partial<AnimalColor> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.ANIMAL_COLOR_MISSING_NAME);
      }

      if (name !== animalColor.name) {
        await assertAnimalColorNameNotUsed(name);
        payload.name = name;
      }
    }

    if (!isEmpty(payload)) {
      await admin
        .firestore()
        .collection("animalColors")
        .doc(id)
        .update(payload);

      await AnimalColorsIndex.partialUpdateObject({
        ...payload,
        objectID: animalColor.id,
      });
    }

    return { ...animalColor, ...payload };
  },

  async deleteAnimalColor(id: string): Promise<boolean> {
    // TODO: Check that the color is not referenced by an animal.
    await admin.firestore().collection("animalColors").doc(id).delete();
    await AnimalColorsIndex.deleteObject(id);
    return true;
  },
};
