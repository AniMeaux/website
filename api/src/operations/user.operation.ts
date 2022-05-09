import {
  ManagedAnimal,
  User,
  UserBrief,
  UserGroup,
  UserOperations,
} from "@animeaux/shared";
import { getAuth, UpdateRequest } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import orderBy from "lodash.orderby";
import { array, mixed, object, string } from "yup";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { isFirebaseError } from "../core/firebase";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import {
  AnimalFromStore,
  ANIMAL_COLLECTION,
  getDisplayName,
} from "../entities/animal.entity";
import {
  getAllUsers,
  getUserFromAuth,
  getUserFromStore,
  UserFromAlgolia,
  UserFromStore,
  UserIndex,
  USER_COLLECTION,
} from "../entities/user.entity";

export const userOperations: OperationsImpl<UserOperations> = {
  async getUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getUser">(
      object({ id: string().required() }),
      rawParams
    );

    const [userFromStore, userFromAuth] = await Promise.all([
      getUserFromStore(params.id),
      getUserFromAuth(params.id),
    ]);

    if (userFromStore == null || userFromAuth == null) {
      throw new OperationError(404);
    }

    return {
      id: params.id,
      displayName: userFromAuth.displayName,
      email: userFromAuth.email,
      disabled: userFromAuth.disabled,
      groups: userFromStore.groups,
      managedAnimals: await getManagedAnimals(params.id),
    };
  },

  async getAllUsers(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const users = await getAllUsers();
    const userBriefs = users.map<UserBrief>((user) => ({
      id: user.id,
      displayName: user.displayName,
      disabled: user.disabled,
      groups: user.groups,
    }));

    return orderBy(
      userBriefs,
      [(user) => user.disabled, (user) => user.displayName],
      ["asc", "asc"]
    );
  },

  async createUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createUser">(
      object({
        email: string().trim().email().required(),
        displayName: string().trim().required(),
        password: string().required(),
        groups: array()
          .of(mixed().oneOf(Object.values(UserGroup)).required())
          .required()
          .min(1),
      }),
      rawParams
    );

    try {
      const userRecord = await getAuth().createUser(params);

      const userFromStore: UserFromStore = {
        id: userRecord.uid,
        groups: params.groups,
      };

      await getFirestore()
        .collection(USER_COLLECTION)
        .doc(userFromStore.id)
        .set(userFromStore);

      const userFromAlgolia: UserFromAlgolia = {
        id: userRecord.uid,
        email: userRecord.email!,
        displayName: userRecord.displayName!,
        disabled: userRecord.disabled,
        groups: userFromStore.groups,
      };

      await UserIndex.saveObject({
        ...userFromAlgolia,
        objectID: userFromAlgolia.id,
      });

      return {
        id: userRecord.uid,
        displayName: userRecord.displayName!,
        email: userRecord.email!,
        disabled: userRecord.disabled,
        groups: userFromStore.groups,
        managedAnimals: [],
      };
    } catch (error) {
      if (isFirebaseError(error)) {
        if (error.code === "auth/invalid-password") {
          throw new OperationError<"createUser">(400, {
            code: "week-password",
          });
        }

        if (error.code === "auth/email-already-exists") {
          throw new OperationError<"createUser">(400, {
            code: "email-already-exists",
          });
        }
      }

      throw error;
    }
  },

  async updateUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateUser">(
      object({
        id: string().required(),
        displayName: string().trim().required(),
        password: string().defined(),
        groups: array()
          .of(mixed().oneOf(Object.values(UserGroup)).required())
          .required()
          .min(1),
      }),
      rawParams
    );

    const user = await userOperations.getUser({ id: params.id }, context);

    // Don't allow an admin (only admins can access users) to lock himself out.
    if (
      currentUser.id === params.id &&
      !params.groups.includes(UserGroup.ADMIN)
    ) {
      throw new OperationError(400);
    }

    try {
      const userUpdate: UpdateRequest = { displayName: params.displayName };
      if (params.password !== "") {
        userUpdate.password = params.password;
      }

      await getAuth().updateUser(params.id, userUpdate);

      const userFromStore: UserFromStore = {
        id: params.id,
        groups: params.groups,
      };

      await getFirestore()
        .collection(USER_COLLECTION)
        .doc(userFromStore.id)
        .update(userFromStore);

      const userFromAlgolia: Partial<UserFromAlgolia> = {
        displayName: params.displayName,
        groups: params.groups,
      };

      await UserIndex.partialUpdateObject({
        ...userFromAlgolia,
        objectID: params.id,
      });

      return {
        ...user,
        displayName: params.displayName,
        groups: params.groups,
      };
    } catch (error) {
      if (isFirebaseError(error) && error.code === "auth/invalid-password") {
        throw new OperationError<"updateUser">(400, {
          code: "week-password",
        });
      }

      throw error;
    }
  },

  async toggleUserBlockedStatus(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"toggleUserBlockedStatus">(
      object({ id: string().required() }),
      rawParams
    );

    const user = await userOperations.getUser({ id: params.id }, context);

    // Don't allow a use to block himself.
    if (currentUser.id === params.id) {
      throw new OperationError(400);
    }

    const newDisabled = !user.disabled;
    await getAuth().updateUser(params.id, { disabled: newDisabled });

    const userFromAlgolia: Partial<UserFromAlgolia> = {
      disabled: newDisabled,
    };

    await UserIndex.partialUpdateObject({
      ...userFromAlgolia,
      objectID: params.id,
    });

    return { ...user, disabled: newDisabled };
  },

  async deleteUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteUser">(
      object({ id: string().required() }),
      rawParams
    );

    await userOperations.getUser({ id: params.id }, context);

    // Don't allow a user to delete himself.
    if (currentUser.id === params.id) {
      throw new OperationError(400);
    }

    // TODO: Check that the user is not referenced by an animal.
    await getFirestore().collection(USER_COLLECTION).doc(params.id).delete();
    await getAuth().deleteUser(params.id);
    await UserIndex.deleteObject(params.id);

    return true;
  },
};

async function getManagedAnimals(userId: User["id"]) {
  const snapshots = await getFirestore()
    .collection(ANIMAL_COLLECTION)
    .where("managerId", "==", userId)
    .get();

  const animals = snapshots.docs.map<ManagedAnimal>((doc) => {
    const animal = doc.data() as AnimalFromStore;

    return {
      id: animal.id,
      avatarId: animal.avatarId,
      name: getDisplayName(animal),
    };
  });

  // A specific index is required to order by a field not in the filters.
  return orderBy(animals, (animal) => animal.name);
}
