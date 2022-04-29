import {
  HostFamilyBrief,
  HostFamilyHostedAnimal,
  HostFamilyOperations,
  HostFamilySearchHit,
  UserGroup,
} from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import orderBy from "lodash.orderby";
import { v4 as uuid } from "uuid";
import { object, string } from "yup";
import { AlgoliaClient, DEFAULT_SEARCH_OPTIONS } from "../core/algolia";
import { assertUserHasGroups } from "../core/authentication";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import {
  AnimalFromStore,
  ANIMAL_COLLECTION,
  getDisplayName,
} from "../entities/animal.entity";
import {
  getFormattedAddress,
  getHostFamilyFromStore,
  HostFamilyFromStore,
  HOST_FAMILY_COLLECTION,
} from "../entities/hostFamily.entity";

const HostFamilyIndex = AlgoliaClient.initIndex(HOST_FAMILY_COLLECTION);

export const hostFamilyOperations: OperationsImpl<HostFamilyOperations> = {
  async getAllHostFamilies(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const snapshots = await getFirestore()
      .collection(HOST_FAMILY_COLLECTION)
      .orderBy("name")
      .get();

    return snapshots.docs.map<HostFamilyBrief>((doc) => {
      const hostFamily = doc.data() as HostFamilyFromStore;

      return {
        id: hostFamily.id,
        name: hostFamily.name,
        location: `${hostFamily.city} (${hostFamily.zipCode.substring(0, 2)})`,
      };
    });
  },

  async searchHostFamilies(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"searchHostFamilies">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await HostFamilyIndex.search<HostFamilyFromStore>(
      params.search,
      DEFAULT_SEARCH_OPTIONS
    );

    return result.hits.map<HostFamilySearchHit>((hit) => ({
      id: hit.id,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  },

  async getHostFamily(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"getHostFamily">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const hostFamily = await getHostFamilyFromStore(params.id);

    return {
      id: hostFamily.id,
      name: hostFamily.name,
      phone: hostFamily.phone,
      email: hostFamily.email,
      zipCode: hostFamily.zipCode,
      city: hostFamily.city,
      address: hostFamily.address,
      formattedAddress: getFormattedAddress(hostFamily),
      hostedAnimals: await getHostedAnimals(hostFamily),
    };
  },

  async createHostFamily(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"createHostFamily">(
      object({
        name: string().trim().required(),
        phone: string().trim().required(),
        email: string().trim().email().required(),
        zipCode: string()
          .trim()
          .matches(/^\d{5}$/)
          .required(),
        city: string().trim().required(),
        address: string().trim().required(),
      }),
      rawParams
    );

    const hostFamily: HostFamilyFromStore = { id: uuid(), ...params };

    await assertIsValid(hostFamily);

    await getFirestore()
      .collection(HOST_FAMILY_COLLECTION)
      .doc(hostFamily.id)
      .set(hostFamily);

    await HostFamilyIndex.saveObject({
      ...hostFamily,
      objectID: hostFamily.id,
    });

    return {
      id: hostFamily.id,
      name: hostFamily.name,
      phone: hostFamily.phone,
      email: hostFamily.email,
      zipCode: hostFamily.zipCode,
      city: hostFamily.city,
      address: hostFamily.address,
      formattedAddress: getFormattedAddress(hostFamily),
      hostedAnimals: [],
    };
  },

  async updateHostFamily(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateHostFamily">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
        phone: string().trim().required(),
        email: string().trim().email().required(),
        zipCode: string()
          .trim()
          .matches(/^\d{5}$/)
          .required(),
        city: string().trim().required(),
        address: string().trim().required(),
      }),
      rawParams
    );

    const currentHostFamily = await getHostFamilyFromStore(params.id);
    const newHostFamily: HostFamilyFromStore = {
      ...currentHostFamily,
      ...params,
    };

    await assertIsValid(newHostFamily, currentHostFamily);

    await getFirestore()
      .collection(HOST_FAMILY_COLLECTION)
      .doc(newHostFamily.id)
      .update(newHostFamily);

    await HostFamilyIndex.partialUpdateObject({
      ...newHostFamily,
      objectID: newHostFamily.id,
    });

    return {
      id: newHostFamily.id,
      name: newHostFamily.name,
      phone: newHostFamily.phone,
      email: newHostFamily.email,
      zipCode: newHostFamily.zipCode,
      city: newHostFamily.city,
      address: newHostFamily.address,
      formattedAddress: getFormattedAddress(newHostFamily),
      hostedAnimals: await getHostedAnimals(newHostFamily),
    };
  },

  async deleteHostFamily(rawParams, context) {
    assertUserHasGroups(context.currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"deleteHostFamily">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    // TODO: Check that the host family is not referenced by an animal.
    await getFirestore()
      .collection(HOST_FAMILY_COLLECTION)
      .doc(params.id)
      .delete();

    await HostFamilyIndex.deleteObject(params.id);
    return true;
  },
};

async function assertIsValid(
  update: HostFamilyFromStore,
  current?: HostFamilyFromStore
) {
  if (current == null || current.name !== update.name) {
    const snapshot = await getFirestore()
      .collection(HOST_FAMILY_COLLECTION)
      .where("name", "==", update.name)
      .get();

    if (!snapshot.empty) {
      throw new OperationError<"createHostFamily" | "updateHostFamily">(400, {
        code: "name-already-used",
      });
    }
  }
}

async function getHostedAnimals(hostFamily: HostFamilyFromStore) {
  const snapshots = await getFirestore()
    .collection(ANIMAL_COLLECTION)
    .where("hostFamilyId", "==", hostFamily.id)
    .get();

  const hostedAnimals = snapshots.docs.map<HostFamilyHostedAnimal>((doc) => {
    const animal = doc.data() as AnimalFromStore;

    return {
      id: animal.id,
      avatarId: animal.avatarId,
      name: getDisplayName(animal),
    };
  });

  // A specific index is required to order by a field not in the filters.
  return orderBy(hostedAnimals, (animal) => animal.name);
}
