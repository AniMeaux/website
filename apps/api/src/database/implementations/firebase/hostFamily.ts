import {
  CreateHostFamilyPayload,
  EMAIL_PATTERN,
  ErrorCode,
  HostFamily,
  HostFamilyFilters,
  minimiseHostFamilyOwnAnimals,
  PaginatedResponse,
  SearchableHostFamily,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import { v4 as uuid } from "uuid";
import { AlgoliaClient } from "../../algoliaClient";
import { HostFamilyDatabase } from "../../databaseType";
import { SearchFilters } from "../../searchFilters";

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
  ): Promise<PaginatedResponse<SearchableHostFamily>> {
    const searchFilters: string[] = [];

    if (filters.hasChild != null) {
      searchFilters.push(
        SearchFilters.createFilter("hasChild", filters.hasChild)
      );
    }

    if (filters.hasGarden != null) {
      searchFilters.push(
        SearchFilters.createFilter("hasGarden", filters.hasGarden)
      );
    }

    if (filters.hasVehicle != null) {
      searchFilters.push(
        SearchFilters.createFilter("hasVehicle", filters.hasVehicle)
      );
    }

    if (filters.housing != null) {
      searchFilters.push(
        SearchFilters.createFilter("housing", filters.housing)
      );
    }

    const result = await HostFamiliesIndex.search<SearchableHostFamily>(
      filters.search ?? "",
      {
        page: filters.page ?? 0,
        filters: SearchFilters.and(searchFilters),
      }
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

  async createHostFamily({
    name,
    phone,
    email,
    address,
    housing,
    hasChild,
    hasGarden,
    hasVehicle,
    linkToDrive,
    linkToFacebook,
    ownAnimals,
  }: CreateHostFamilyPayload): Promise<HostFamily> {
    name = name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
    }

    phone = phone.trim();
    if (phone === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
    }

    email = email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      throw new UserInputError(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
    }

    address = address.trim();
    if (address === "") {
      throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
    }

    await assertHostFamilyNameNotUsed(name);

    const searchableHostFamily: SearchableHostFamily = {
      id: uuid(),
      name,
      phone,
      email,
      address,
      housing,
      hasChild,
      hasGarden,
      hasVehicle,
    };

    const hostFamily: HostFamily = {
      ...searchableHostFamily,
      ownAnimals: minimiseHostFamilyOwnAnimals(ownAnimals),
    };

    if (linkToDrive != null) {
      linkToDrive = linkToDrive.trim();

      if (linkToDrive !== "") {
        hostFamily.linkToDrive = linkToDrive;
      }
    }

    if (linkToFacebook != null) {
      linkToFacebook = linkToFacebook.trim();

      if (linkToFacebook !== "") {
        hostFamily.linkToFacebook = linkToFacebook;
      }
    }

    await admin
      .firestore()
      .collection("hostFamilies")
      .doc(hostFamily.id)
      .set(hostFamily);

    await HostFamiliesIndex.saveObject({
      ...searchableHostFamily,
      objectID: searchableHostFamily.id,
    });

    return hostFamily;
  },

  async updateHostFamily({
    id,
    name,
    phone,
    email,
    address,
    housing,
    hasChild,
    hasGarden,
    hasVehicle,
    linkToDrive,
    linkToFacebook,
    ownAnimals,
  }: UpdateHostFamilyPayload): Promise<HostFamily> {
    const hostFamily = await hostFamilyDatabase.getHostFamily(id);
    if (hostFamily == null) {
      throw new UserInputError(ErrorCode.HOST_FAMILY_NOT_FOUND);
    }

    const searchablePayload: Partial<SearchableHostFamily> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_NAME);
      }

      if (name !== hostFamily.name) {
        await assertHostFamilyNameNotUsed(name);
        searchablePayload.name = name;
      }
    }

    if (phone != null) {
      phone = phone.trim();

      if (phone === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_PHONE);
      }

      if (phone !== hostFamily.phone) {
        searchablePayload.phone = phone;
      }
    }

    if (email != null) {
      email = email.trim();

      if (!EMAIL_PATTERN.test(email)) {
        throw new UserInputError(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
      }

      if (email !== hostFamily.email) {
        searchablePayload.email = email;
      }
    }

    if (address != null) {
      address = address.trim();

      if (address === "") {
        throw new UserInputError(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
      }

      if (address !== hostFamily.address) {
        searchablePayload.address = address;
      }
    }

    if (housing != null && housing !== hostFamily.housing) {
      searchablePayload.housing = housing;
    }

    if (hasChild != null && hasChild !== hostFamily.hasChild) {
      searchablePayload.hasChild = hasChild;
    }

    if (hasGarden != null && hasGarden !== hostFamily.hasGarden) {
      searchablePayload.hasGarden = hasGarden;
    }

    if (hasVehicle != null && hasVehicle !== hostFamily.hasVehicle) {
      searchablePayload.hasVehicle = hasVehicle;
    }

    const payload: Partial<HostFamily> = { ...searchablePayload };

    if (linkToDrive != null) {
      linkToDrive = linkToDrive.trim();

      if (linkToDrive !== hostFamily.linkToDrive) {
        payload.linkToDrive = linkToDrive;
      }
    }

    if (linkToFacebook != null) {
      linkToFacebook = linkToFacebook.trim();

      if (linkToFacebook !== hostFamily.linkToFacebook) {
        payload.linkToFacebook = linkToFacebook;
      }
    }

    if (ownAnimals != null) {
      ownAnimals = minimiseHostFamilyOwnAnimals(ownAnimals);

      if (!isEqual(ownAnimals, hostFamily.ownAnimals)) {
        payload.ownAnimals = ownAnimals;
      }
    }

    if (!isEmpty(payload)) {
      await admin
        .firestore()
        .collection("hostFamilies")
        .doc(id)
        .update(payload);
    }

    if (!isEmpty(searchablePayload)) {
      await HostFamiliesIndex.partialUpdateObject({
        ...searchablePayload,
        objectID: id,
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
