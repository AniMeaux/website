import {
  CreateHostFamilyPayload,
  DBHostFamily,
  ErrorCode,
  HostFamilyFilters,
  PaginatedResponse,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import { v4 as uuid } from "uuid";
import { AlgoliaClient } from "../../algoliaClient";
import { HostFamilyDatabase } from "../../databaseType";

const HostFamiliesIndex = AlgoliaClient.initIndex("hostFamilies");

async function assertHostFamilyNameNotUsed(name: string) {
  const hostFamilySnapshot = await admin
    .firestore()
    .collection("hostFamilies")
    .where("name", "==", name)
    .get();

  if (!hostFamilySnapshot.empty) {
    throw new UserInputError(ErrorCode.HOST_FAMILY_NAME_ALREADY_USED);
  }
}

export const hostFamilyDatabase: HostFamilyDatabase = {
  async getAllHostFamilies(
    filters: HostFamilyFilters
  ): Promise<PaginatedResponse<DBHostFamily>> {
    const result = await HostFamiliesIndex.search<DBHostFamily>(
      filters.search ?? "",
      { page: filters.page ?? 0 }
    );

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getHostFamily(id: string): Promise<DBHostFamily | null> {
    const hostFamilySnapshot = await admin
      .firestore()
      .collection("hostFamilies")
      .doc(id)
      .get();

    return (hostFamilySnapshot.data() as DBHostFamily) ?? null;
  },

  async createHostFamily({
    name,
    address,
    phone,
  }: CreateHostFamilyPayload): Promise<DBHostFamily> {
    name = name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
    }

    address = address.trim();
    if (address === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
    }

    phone = phone.trim();
    if (phone === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
    }

    await assertHostFamilyNameNotUsed(name);

    const hostFamily: DBHostFamily = {
      id: uuid(),
      name,
      address,
      phone,
    };

    await admin
      .firestore()
      .collection("hostFamilies")
      .doc(hostFamily.id)
      .set(hostFamily);

    await HostFamiliesIndex.saveObject({
      ...hostFamily,
      objectID: hostFamily.id,
    });

    return hostFamily;
  },

  async updateHostFamily({
    id,
    name,
    address,
    phone,
  }: UpdateHostFamilyPayload): Promise<DBHostFamily> {
    const hostFamily = await hostFamilyDatabase.getHostFamily(id);
    if (hostFamily == null) {
      throw new UserInputError(ErrorCode.HOST_FAMILY_NOT_FOUND);
    }

    const payload: Partial<DBHostFamily> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
      }

      if (name !== hostFamily.name) {
        await assertHostFamilyNameNotUsed(name);
        payload.name = name;
      }
    }

    if (address != null) {
      address = address.trim();

      if (address === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
      }

      if (address !== hostFamily.address) {
        payload.address = address;
      }
    }

    if (phone != null) {
      phone = phone.trim();

      if (phone === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
      }

      if (phone !== hostFamily.phone) {
        payload.phone = phone;
      }
    }

    if (!isEmpty(payload)) {
      await admin
        .firestore()
        .collection("hostFamilies")
        .doc(id)
        .update(payload);

      await HostFamiliesIndex.partialUpdateObject({
        ...payload,
        objectID: hostFamily.id,
      });
    }

    return { ...hostFamily, ...payload };
  },

  async deleteHostFamily(id: string): Promise<boolean> {
    // TODO: Check that the host family is not referenced by an animal.
    await admin.firestore().collection("hostFamilies").doc(id).delete();
    await HostFamiliesIndex.deleteObject(id);
    return true;
  },
};
