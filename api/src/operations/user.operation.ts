import { User, UserGroup, UserOperations } from "@animeaux/shared";
import { getAuth, UpdateRequest } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import orderBy from "lodash.orderby";
import { array, mixed, object, string } from "yup";
import { assertUserHasGroups } from "../core/authentication";
import { isFirebaseError } from "../core/firebase";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";

const USER_COLLECTION = "users";

type UserFromStore = {
  id: string;
  groups: UserGroup[];
};

export const userOperations: OperationsImpl<UserOperations> = {
  async getUser(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getUser">(
      object({ id: string().required() }),
      rawParams
    );

    const user = await getUser(params.id);
    if (user == null) {
      throw new OperationError(404);
    }

    return user;
  },

  async getAllUsers(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    return orderBy(
      await getAllUsers(),
      [(user) => user.disabled, (user) => user.displayName],
      ["asc", "asc"]
    );
  },

  async createUser(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

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

      return {
        id: userRecord.uid,
        displayName: userRecord.displayName!,
        email: userRecord.email!,
        disabled: userRecord.disabled,
        groups: userFromStore.groups,
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
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

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

    const user = await getUser(params.id);
    if (user == null) {
      throw new OperationError(404);
    }

    // Don't allow an admin (only admins can access users) to lock himself out.
    if (
      context.currentUser.id === params.id &&
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
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"toggleUserBlockedStatus">(
      object({ id: string().required() }),
      rawParams
    );

    // Don't allow a use to block himself.
    if (context.currentUser.id === params.id) {
      throw new OperationError(400);
    }

    const user = await userOperations.getUser({ id: params.id }, context);
    await getAuth().updateUser(params.id, { disabled: !user.disabled });
    return { ...user, disabled: !user.disabled };
  },

  async deleteUser(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteUser">(
      object({ id: string().required() }),
      rawParams
    );

    // Don't allow a user to delete himself.
    if (context.currentUser.id === params.id) {
      throw new OperationError(400);
    }

    await getFirestore().collection(USER_COLLECTION).doc(params.id).delete();
    await getAuth().deleteUser(params.id);
    return true;
  },
};

export async function getUser(userId: string): Promise<User | null> {
  const userSnapshot = await getFirestore()
    .collection(USER_COLLECTION)
    .doc(userId)
    .get();

  const groups = (userSnapshot.data() as UserFromStore)?.groups ?? null;
  if (groups == null) {
    return null;
  }

  try {
    const userRecord = await getAuth().getUser(userId);

    return {
      id: userRecord.uid,
      displayName: userRecord.displayName!,
      email: userRecord.email!,
      disabled: userRecord.disabled,
      groups,
    };
  } catch (error) {
    // Catch auth/user-not-found as we _expect_ this error, other errors are
    // not expected.
    // See https://firebase.google.com/docs/auth/admin/errors
    if (isFirebaseError(error) && error.code === "auth/user-not-found") {
      return null;
    }

    throw error;
  }
}

export async function getAllUsers() {
  const [usersSnapshot, usersFromAuth] = await Promise.all([
    getFirestore().collection(USER_COLLECTION).get(),
    getAuth().listUsers(),
  ]);

  const users: User[] = [];

  usersSnapshot.docs.forEach((doc) => {
    const userFromStore = doc.data() as UserFromStore;
    const userRecord = usersFromAuth.users.find(
      (userFromAuth) => userFromStore.id === userFromAuth.uid
    );

    if (userRecord != null) {
      users.push({
        id: userRecord.uid,
        displayName: userRecord.displayName!,
        email: userRecord.email!,
        disabled: userRecord.disabled,
        groups: userFromStore.groups,
      });
    }
  });

  return users;
}
