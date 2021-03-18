import {
  CreateHostFamilyPayload,
  EMAIL_PATTERN,
  ErrorCode,
  HostFamily,
  HostFamilySearch,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import { v4 as uuid } from "uuid";
import { HostFamilyDatabase } from "../../databaseType";
import { AlgoliaClient } from "./algoliaClient";

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
    parameters: PaginatedRequestParameters<HostFamilySearch>
  ): Promise<PaginatedResponse<HostFamily>> {
    const result = await HostFamiliesIndex.search<HostFamily>(
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

  async getHostFamily(id: string): Promise<HostFamily | null> {
    const hostFamilySnapshot = await admin
      .firestore()
      .collection("hostFamilies")
      .doc(id)
      .get();

    return (hostFamilySnapshot.data() as HostFamily) ?? null;
  },

  async createHostFamily(
    payload: CreateHostFamilyPayload
  ): Promise<HostFamily> {
    const name = payload.name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
    }

    const phone = payload.phone.trim();
    if (phone === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
    }

    const email = payload.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      throw new UserInputError(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
    }

    const address = payload.address.trim();
    if (address === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
    }

    const zipCode = payload.zipCode.trim();
    if (zipCode === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE);
    }

    const city = payload.city.trim();
    if (city === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_CITY);
    }

    await assertHostFamilyNameNotUsed(name);

    const hostFamily: HostFamily = {
      id: uuid(),
      name,
      phone,
      email,
      city,
      zipCode,
      address,
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

  async updateHostFamily(
    payload: UpdateHostFamilyPayload
  ): Promise<HostFamily> {
    const hostFamily = await hostFamilyDatabase.getHostFamily(payload.id);
    if (hostFamily == null) {
      throw new UserInputError(ErrorCode.HOST_FAMILY_NOT_FOUND);
    }

    const hostFamilyUpdate: Partial<HostFamily> = {};

    if (payload.name != null) {
      const name = payload.name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
      }

      if (name !== hostFamily.name) {
        await assertHostFamilyNameNotUsed(name);
        hostFamilyUpdate.name = name;
      }
    }

    if (payload.phone != null) {
      const phone = payload.phone.trim();

      if (phone === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
      }

      if (phone !== hostFamily.phone) {
        hostFamilyUpdate.phone = phone;
      }
    }

    if (payload.email != null) {
      const email = payload.email.trim();

      if (!EMAIL_PATTERN.test(email)) {
        throw new UserInputError(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
      }

      if (email !== hostFamily.email) {
        hostFamilyUpdate.email = email;
      }
    }

    if (payload.address != null) {
      const address = payload.address.trim();

      if (address === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
      }

      if (address !== hostFamily.address) {
        hostFamilyUpdate.address = address;
      }
    }

    if (payload.zipCode != null) {
      const zipCode = payload.zipCode.trim();

      if (zipCode === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE);
      }

      if (zipCode !== hostFamily.zipCode) {
        hostFamilyUpdate.zipCode = zipCode;
      }
    }

    if (payload.city != null) {
      const city = payload.city.trim();

      if (city === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_CITY);
      }

      if (city !== hostFamily.city) {
        hostFamilyUpdate.city = city;
      }
    }

    if (!isEmpty(hostFamilyUpdate)) {
      await admin
        .firestore()
        .collection("hostFamilies")
        .doc(hostFamily.id)
        .update(hostFamilyUpdate);

      await HostFamiliesIndex.partialUpdateObject({
        ...hostFamilyUpdate,
        objectID: hostFamily.id,
      });
    }

    return { ...hostFamily, ...hostFamilyUpdate };
  },

  async deleteHostFamily(id: string): Promise<boolean> {
    // TODO: Check that the host family is not referenced by an animal.
    await admin.firestore().collection("hostFamilies").doc(id).delete();
    await HostFamiliesIndex.deleteObject(id);
    return true;
  },
};
