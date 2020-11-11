import {
  AnimalBreedFilters,
  AnimalSpecies,
  CreateAnimalBreedPayload,
  CreateUserPayload,
  CreateUserRolePayload,
  DBAnimalBreed,
  DBUser,
  DBUserForQueryContext,
  DBUserFromAuth,
  DBUserFromStore,
  DBUserRole,
  DEFAULT_RESOURCE_PERMISSIONS,
  EMAIL_PATTERN,
  ErrorCode,
  getErrorCode,
  hasErrorCode,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
  UpdateUserPayload,
  UpdateUserRolePayload,
  UserFilters,
} from "@animeaux/shared";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { v4 as uuid } from "uuid";
import { Database } from "./databaseType";

function mapFirebaseUser(user: admin.auth.UserRecord): DBUserFromAuth {
  return {
    id: user.uid,
    displayName: user.displayName ?? user.email!,
    email: user.email!,
    disabled: user.disabled,
  };
}

async function getUserRoleIdForUser(userId: string): Promise<string | null> {
  const userSnapshot = await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .get();

  return (userSnapshot.data() as DBUserFromStore)?.roleId ?? null;
}

async function assertUserRoleNameNotUsed(name: string) {
  const userRoleSnapshot = await admin
    .firestore()
    .collection("userRoles")
    .where("name", "==", name)
    .get();

  if (!userRoleSnapshot.empty) {
    throw new UserInputError(ErrorCode.USER_ROLE_NAME_ALREADY_USED);
  }
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

const AlgoliaClient = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

const AnimalBreedsIndex = AlgoliaClient.initIndex("animalBreeds");

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

  //// User Role ///////////////////////////////////////////////////////////////

  async getAllUserRoles(): Promise<DBUserRole[]> {
    const userRolesSnapshot = await admin
      .firestore()
      .collection("userRoles")
      .orderBy("name", "asc")
      .get();

    return userRolesSnapshot.docs.map((doc) => doc.data() as DBUserRole);
  },

  async getUserRole(id: string): Promise<DBUserRole | null> {
    const userRoleSnapshot = await admin
      .firestore()
      .collection("userRoles")
      .doc(id)
      .get();

    const dbUserRole = (userRoleSnapshot.data() as DBUserRole) ?? null;

    if (dbUserRole != null) {
      return {
        ...dbUserRole,
        resourcePermissions: {
          // Some resource keys are allowed to be missing from the data in
          // which case they have a default value.
          ...DEFAULT_RESOURCE_PERMISSIONS,
          ...dbUserRole.resourcePermissions,
        },
      };
    }

    return null;
  },

  async createUserRole({
    name,
    resourcePermissions,
  }: CreateUserRolePayload): Promise<DBUserRole> {
    name = name.trim();

    if (name === "") {
      throw new UserInputError(ErrorCode.USER_ROLE_MISSING_NAME);
    }

    await assertUserRoleNameNotUsed(name);

    const userRole: DBUserRole = {
      id: uuid(),
      name,
      resourcePermissions,
    };

    await admin
      .firestore()
      .collection("userRoles")
      .doc(userRole.id)
      .set(userRole);

    return userRole;
  },

  async updateUserRole({
    id,
    name,
    resourcePermissions,
  }: UpdateUserRolePayload): Promise<DBUserRole> {
    const userRole = await FirebaseDatabase.getUserRole(id);
    if (userRole == null) {
      throw new UserInputError(ErrorCode.USER_ROLE_NOT_FOUND);
    }

    const payload: Partial<DBUserRole> = {};

    if (name != null) {
      name = name.trim();

      if (name === "") {
        throw new UserInputError(ErrorCode.USER_ROLE_MISSING_NAME);
      }

      if (name !== userRole.name) {
        assertUserRoleNameNotUsed(name);
        payload.name = name;
      }
    }

    if (
      resourcePermissions != null &&
      !isEqual(resourcePermissions, userRole.resourcePermissions)
    ) {
      payload.resourcePermissions = resourcePermissions;
    }

    if (!isEmpty(payload)) {
      await admin.firestore().collection("userRoles").doc(id).update(payload);
    }

    return { ...userRole, ...payload };
  },

  async deleteUserRole(id: string): Promise<boolean> {
    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .where("roleId", "==", id)
      .get();

    if (usersSnapshot.docs.length > 0) {
      throw new UserInputError(ErrorCode.USER_ROLE_IS_REFERENCED);
    }

    await admin.firestore().collection("userRoles").doc(id).delete();
    return true;
  },

  //// User ////////////////////////////////////////////////////////////////////

  async getUserForQueryContext(
    token: string
  ): Promise<DBUserForQueryContext | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token, true);
      const userRecord = await admin.auth().getUser(decodedToken.uid);

      if (userRecord.disabled) {
        return null;
      }

      const roleId = await getUserRoleIdForUser(userRecord.uid);
      if (roleId == null) {
        return null;
      }

      const role = await FirebaseDatabase.getUserRole(roleId);
      if (role == null) {
        return null;
      }

      return { ...mapFirebaseUser(userRecord), role };
    } catch (error) {
      return null;
    }
  },

  async getAllUsers(
    currentUser: DBUserForQueryContext,
    filters: UserFilters = {}
  ): Promise<DBUser[]> {
    let usersFromStoreQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = admin
      .firestore()
      .collection("users");

    if (filters.roleId != null) {
      usersFromStoreQuery = usersFromStoreQuery.where(
        "roleId",
        "==",
        filters.roleId
      );
    }

    const [usersFromAuth, usersSnapshot] = await Promise.all([
      admin.auth().listUsers(),
      usersFromStoreQuery.get(),
    ]);

    let users: DBUser[] = [];
    let disabledUsers: DBUser[] = [];

    usersSnapshot.docs.forEach((doc) => {
      const userFromStore = doc.data() as DBUserFromStore;
      const userRecord = usersFromAuth.users.find(
        (userFromAuth) => userFromStore.id === userFromAuth.uid
      );

      if (userRecord != null) {
        const user: DBUser = {
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

    // Only show disabled users to authorized users.
    if (currentUser.role.resourcePermissions.user) {
      users = users.concat(
        orderBy(disabledUsers, [(u) => u.displayName], "asc")
      );
    }

    return users;
  },

  async getUser(
    currentUser: DBUserForQueryContext,
    id: string
  ): Promise<DBUser | null> {
    try {
      const [userRecord, roleId] = await Promise.all([
        admin.auth().getUser(id),
        getUserRoleIdForUser(id),
      ]);

      if (userRecord == null || roleId == null) {
        return null;
      }

      // Only show disabled users to authorized users.
      if (userRecord.disabled && !currentUser.role.resourcePermissions.user) {
        return null;
      }

      return { ...mapFirebaseUser(userRecord), roleId };
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
    roleId,
  }: CreateUserPayload): Promise<DBUser> {
    displayName = displayName.trim();
    email = email.trim();

    if (displayName === "") {
      throw new UserInputError(ErrorCode.USER_MISSING_DISPLAY_NAME);
    }

    if (!EMAIL_PATTERN.test(email)) {
      throw new UserInputError(ErrorCode.USER_INVALID_EMAIL);
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
        roleId,
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
    currentUser: DBUserForQueryContext,
    { id, displayName, password, roleId }: UpdateUserPayload
  ): Promise<DBUser> {
    const user = await FirebaseDatabase.getUser(currentUser, id);
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

    if (roleId != null && roleId !== user.roleId) {
      userFromStorePayload.roleId = roleId;
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

  async deleteUser(
    currentUser: DBUserForQueryContext,
    id: string
  ): Promise<boolean> {
    if (currentUser.id === id) {
      throw new UserInputError(ErrorCode.USER_IS_CURRENT_USER);
    }

    await admin.firestore().collection("users").doc(id).delete();
    await admin.auth().deleteUser(id);
    return true;
  },

  async toggleUserBlockedStatus(
    currentUser: DBUserForQueryContext,
    id: string
  ): Promise<DBUser> {
    if (currentUser.id === id) {
      throw new UserInputError(ErrorCode.USER_IS_CURRENT_USER);
    }

    const user = await FirebaseDatabase.getUser(currentUser, id);
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
};
