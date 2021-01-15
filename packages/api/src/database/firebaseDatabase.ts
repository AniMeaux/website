import {
  AnimalBreedFilters,
  AnimalSpecies,
  CreateAnimalBreedPayload,
  CreateHostFamilyPayload,
  CreateUserPayload,
  DBAnimalBreed,
  DBHostFamily,
  DBUserFromAuth,
  DBUserFromStore,
  EMAIL_PATTERN,
  ErrorCode,
  getErrorCode,
  hasErrorCode,
  haveSameGroups,
  HostFamilyFilters,
  PaginatedResponse,
  sortGroupsByLabel,
  UpdateAnimalBreedPayload,
  UpdateHostFamilyPayload,
  UpdateUserPayload,
  User,
  UserGroup,
} from "@animeaux/shared-entities";
import algoliasearch from "algoliasearch";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import orderBy from "lodash.orderby";
import { v4 as uuid } from "uuid";
import { Database } from "./databaseType";

const AlgoliaClient = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const AnimalBreedsIndex = AlgoliaClient.initIndex("animalBreeds");
const HostFamiliesIndex = AlgoliaClient.initIndex("hostFamilies");

function mapFirebaseUser(user: admin.auth.UserRecord): DBUserFromAuth {
  return {
    id: user.uid,
    displayName: user.displayName ?? user.email!,
    email: user.email!,
    disabled: user.disabled,
  };
}

async function getUserGroupsForUser(
  userId: string
): Promise<UserGroup[] | null> {
  const userSnapshot = await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .get();

  return (userSnapshot.data() as DBUserFromStore)?.groups ?? null;
}

async function assertAnimalBreedNameNotUsed(
  name: string,
  species: AnimalSpecies
) {
  const animalBreedSnapshot = await admin
    .firestore()
    .collection("animalBreeds")
    .where("name", "==", name)
    .where("species", "==", species)
    .get();

  if (!animalBreedSnapshot.empty) {
    throw new UserInputError(ErrorCode.ANIMAL_BREED_NAME_ALREADY_USED);
  }
}

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

export const FirebaseDatabase: Database = {
  initialize() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // https://stackoverflow.com/a/41044630/1332513
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }
  },

  //// User ////////////////////////////////////////////////////////////////////

  async getUserForQueryContext(token: string): Promise<User | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token, true);
      const userRecord = await admin.auth().getUser(decodedToken.uid);

      if (userRecord.disabled) {
        return null;
      }

      const groups = await getUserGroupsForUser(userRecord.uid);
      if (groups == null) {
        return null;
      }

      return { ...mapFirebaseUser(userRecord), groups };
    } catch (error) {
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    const [usersFromAuth, usersSnapshot] = await Promise.all([
      admin.auth().listUsers(),
      admin.firestore().collection("users").get(),
    ]);

    let users: User[] = [];
    let disabledUsers: User[] = [];

    usersSnapshot.docs.forEach((doc) => {
      const userFromStore = doc.data() as DBUserFromStore;
      const userRecord = usersFromAuth.users.find(
        (userFromAuth) => userFromStore.id === userFromAuth.uid
      );

      if (userRecord != null) {
        const user: User = {
          ...userFromStore,
          ...mapFirebaseUser(userRecord),
        };

        if (user.disabled) {
          disabledUsers.push(user);
        } else {
          users.push(user);
        }
      }
    });

    users = orderBy(users, [(u) => u.displayName], "asc");
    users = users.concat(orderBy(disabledUsers, [(u) => u.displayName], "asc"));

    return users;
  },

  async getUser(id: string): Promise<User | null> {
    try {
      const [userRecord, groups] = await Promise.all([
        admin.auth().getUser(id),
        getUserGroupsForUser(id),
      ]);

      if (userRecord == null || groups == null) {
        return null;
      }

      return { ...mapFirebaseUser(userRecord), groups };
    } catch (error) {
      // See https://firebase.google.com/docs/auth/admin/errors
      if (hasErrorCode(error, ErrorCode.AUTH_USER_NOT_FOUND)) {
        return null;
      }

      throw error;
    }
  },

  async createUser({
    displayName,
    email,
    password,
    groups,
  }: CreateUserPayload): Promise<User> {
    displayName = displayName.trim();
    email = email.trim();

    if (displayName === "") {
      throw new UserInputError(ErrorCode.USER_MISSING_DISPLAY_NAME);
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new UserInputError(ErrorCode.USER_INVALID_EMAIL);
    }

    if (groups.length === 0) {
      throw new UserInputError(ErrorCode.USER_MISSING_GROUP);
    }

    try {
      const userRecord = await admin.auth().createUser({
        displayName,
        email,
        password,
      });

      const userFromAuth = mapFirebaseUser(userRecord);

      const userFromStore: DBUserFromStore = {
        id: userFromAuth.id,
        groups,
      };

      await admin
        .firestore()
        .collection("users")
        .doc(userFromStore.id)
        .set(userFromStore);

      return {
        ...userFromAuth,
        ...userFromStore,
      };
    } catch (error) {
      // Make sure the error code is in the `message` attribute and not in
      // `code` so it can be correctly serialized.
      if (
        hasErrorCode(error, [
          ErrorCode.USER_INVALID_PASSWORD,
          ErrorCode.USER_EMAIL_ALREADY_EXISTS,
        ])
      ) {
        throw new UserInputError(getErrorCode(error));
      }

      throw error;
    }
  },

  async updateUser(
    currentUser: User,
    { id, displayName, password, groups }: UpdateUserPayload
  ): Promise<User> {
    const user = await FirebaseDatabase.getUser(id);
    if (user == null) {
      throw new UserInputError(ErrorCode.USER_NOT_FOUND);
    }

    const userFromAuthPayloadRequest: admin.auth.UpdateRequest = {};
    const userFromAuthPayload: Partial<DBUserFromAuth> = {};

    if (displayName != null) {
      displayName = displayName.trim();

      if (displayName === "") {
        throw new UserInputError(ErrorCode.USER_MISSING_DISPLAY_NAME);
      }

      if (displayName !== user.displayName) {
        userFromAuthPayloadRequest.displayName = displayName;
        userFromAuthPayload.displayName = displayName;
      }
    }

    if (password != null) {
      userFromAuthPayloadRequest.password = password;
    }

    if (!isEmpty(userFromAuthPayloadRequest)) {
      try {
        await admin.auth().updateUser(id, userFromAuthPayloadRequest);
      } catch (error) {
        // Make sure the error code is in the `message` attribute and not in
        // `code` so it can be correctly serialized.
        if (hasErrorCode(error, ErrorCode.USER_INVALID_PASSWORD)) {
          throw new UserInputError(getErrorCode(error));
        }

        throw error;
      }
    }

    const userFromStorePayload: Partial<DBUserFromStore> = {};

    if (groups != null && !haveSameGroups(groups, user.groups)) {
      // Don't allow an admin (only admins can access users) to lock himself
      // out.
      if (currentUser.id === user.id && !groups.includes(UserGroup.ADMIN)) {
        throw new UserInputError(ErrorCode.USER_IS_ADMIN);
      }

      if (groups.length === 0) {
        throw new UserInputError(ErrorCode.USER_MISSING_GROUP);
      }

      userFromStorePayload.groups = groups;
    }

    if (!isEmpty(userFromStorePayload)) {
      await admin
        .firestore()
        .collection("users")
        .doc(id)
        .update(userFromStorePayload);
    }

    return {
      ...user,
      ...userFromStorePayload,
      ...userFromAuthPayload,
    };
  },

  async deleteUser(currentUser: User, id: string): Promise<boolean> {
    // Don't allow a use to delete himself.
    if (currentUser.id === id) {
      throw new UserInputError(ErrorCode.USER_IS_CURRENT_USER);
    }

    await admin.firestore().collection("users").doc(id).delete();
    await admin.auth().deleteUser(id);
    return true;
  },

  async toggleUserBlockedStatus(currentUser: User, id: string): Promise<User> {
    // Don't allow a use to block himself.
    if (currentUser.id === id) {
      throw new UserInputError(ErrorCode.USER_IS_CURRENT_USER);
    }

    const user = await FirebaseDatabase.getUser(id);
    if (user == null) {
      throw new UserInputError(ErrorCode.USER_NOT_FOUND);
    }

    const payload: Partial<DBUserFromAuth> = { disabled: !user.disabled };
    await admin.auth().updateUser(id, payload);
    return { ...user, ...payload };
  },

  //// Animal Breed ////////////////////////////////////////////////////////////

  async getAllAnimalBreeds(
    filters: AnimalBreedFilters
  ): Promise<PaginatedResponse<DBAnimalBreed>> {
    const facetFilters: string[] = [];

    if (filters.species != null) {
      facetFilters.push(`species:${filters.species}`);
    }

    const result = await AnimalBreedsIndex.search<DBAnimalBreed>(
      filters.search ?? "",
      {
        page: filters.page ?? 0,
        facetFilters,
      }
    );

    return {
      hits: result.hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getAnimalBreed(id: string): Promise<DBAnimalBreed | null> {
    const animalBreedSnapshot = await admin
      .firestore()
      .collection("animalBreeds")
      .doc(id)
      .get();

    return (animalBreedSnapshot.data() as DBAnimalBreed) ?? null;
  },

  async createAnimalBreed({
    name,
    species,
  }: CreateAnimalBreedPayload): Promise<DBAnimalBreed> {
    name = name.trim();
    if (name === "") {
      throw new UserInputError(ErrorCode.ANIMAL_BREED_MISSING_NAME);
    }

    await assertAnimalBreedNameNotUsed(name, species);

    const animalBreed: DBAnimalBreed = {
      id: uuid(),
      name,
      species,
    };

    await admin
      .firestore()
      .collection("animalBreeds")
      .doc(animalBreed.id)
      .set(animalBreed);

    await AnimalBreedsIndex.saveObject({
      ...animalBreed,
      objectID: animalBreed.id,
    });

    return animalBreed;
  },

  async updateAnimalBreed({
    id,
    name,
    species,
  }: UpdateAnimalBreedPayload): Promise<DBAnimalBreed> {
    const animalBreed = await FirebaseDatabase.getAnimalBreed(id);
    if (animalBreed == null) {
      throw new UserInputError(ErrorCode.ANIMAL_BREED_NOT_FOUND);
    }

    const payload: Partial<DBAnimalBreed> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.ANIMAL_BREED_MISSING_NAME);
      }

      if (name !== animalBreed.name) {
        assertAnimalBreedNameNotUsed(name, species ?? animalBreed.species);
        payload.name = name;
      }
    }

    if (species != null && species !== animalBreed.species) {
      payload.species = species;
    }

    if (!isEmpty(payload)) {
      await admin
        .firestore()
        .collection("animalBreeds")
        .doc(id)
        .update(payload);

      await AnimalBreedsIndex.partialUpdateObject({
        ...payload,
        objectID: animalBreed.id,
      });
    }

    return { ...animalBreed, ...payload };
  },

  async deleteAnimalBreed(id: string): Promise<boolean> {
    // TODO: Check that the breed is not referenced by an animal.
    await admin.firestore().collection("animalBreeds").doc(id).delete();
    await AnimalBreedsIndex.deleteObject(id);
    return true;
  },

  //// Host Family /////////////////////////////////////////////////////////////

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
    const hostFamily = await FirebaseDatabase.getHostFamily(id);
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
        assertHostFamilyNameNotUsed(name);
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
