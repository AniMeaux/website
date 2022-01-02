import {
  CreateUserPayload,
  DBUserFromAuth,
  DBUserFromStore,
  EMAIL_PATTERN,
  ErrorCode,
  getErrorCode,
  hasErrorCode,
  haveSameGroups,
  UpdateUserPayload,
  User,
  UserGroup,
} from "@animeaux/shared-entities";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import isEmpty from "lodash.isempty";
import orderBy from "lodash.orderby";
import { UserDatabase } from "../../databaseType";

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

export const userDatabase: UserDatabase = {
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
    } catch (error: any) {
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
    if (displayName === "") {
      throw new UserInputError(ErrorCode.USER_MISSING_DISPLAY_NAME);
    }

    email = email.trim();
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
    } catch (error: any) {
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
    const user = await userDatabase.getUser(id);
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
      } catch (error: any) {
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

    const user = await userDatabase.getUser(id);
    if (user == null) {
      throw new UserInputError(ErrorCode.USER_NOT_FOUND);
    }

    const payload: Partial<DBUserFromAuth> = { disabled: !user.disabled };
    await admin.auth().updateUser(id, payload);
    return { ...user, ...payload };
  },
};
