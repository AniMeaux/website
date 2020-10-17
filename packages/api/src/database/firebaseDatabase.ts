import {
  CreateUserRolePayload,
  DBUser,
  DBUserFromAuth,
  DBUserFromStore,
  DBUserRole,
  DEFAULT_RESOURCE_PERMISSIONS,
  hasErrorCode,
  ErrorCode,
  User,
  UserRole,
} from "@animeaux/shared";
import { UserInputError } from "apollo-server";
import * as admin from "firebase-admin";
import { v4 as uuid } from "uuid";
import { Database } from "./databaseType";

function mapFirebaseUser(user: admin.auth.UserRecord): DBUserFromAuth {
  return {
    id: user.uid,
    displayName: user.displayName ?? user.email!,
    email: user.email!,
  };
}

async function getUserRoleIdForUser(userId: string): Promise<string> {
  const userSnapshot = await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .get();

  return (userSnapshot.data() as DBUserFromStore).roleId;
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

      const roleId = await getUserRoleIdForUser(userRecord.uid);
      const role = (await FirebaseDatabase.getUserRole(roleId))!;

      return { ...mapFirebaseUser(userRecord), role };
    } catch (error) {
      return null;
    }
  },

  async getUser(id: string): Promise<DBUser | null> {
    try {
      const [userRecord, roleId] = await Promise.all([
        admin.auth().getUser(id),
        getUserRoleIdForUser(id),
      ]);

      return { ...mapFirebaseUser(userRecord), roleId };
    } catch (error) {
      // See https://firebase.google.com/docs/auth/admin/errors
      if (hasErrorCode(error, "auth/user-not-found")) {
        return null;
      }

      throw error;
    }
  },

  //// User Role ///////////////////////////////////////////////////////////////

  async getAllUserRoles(): Promise<DBUserRole[]> {
    const userRolesSnapshot = await admin
      .firestore()
      .collection("userRoles")
      .get();

    return userRolesSnapshot.docs.map((doc) => doc.data() as DBUserRole);
  },

  async getUserRole(id: string): Promise<UserRole | null> {
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

    const userRolesCollection = admin.firestore().collection("userRoles");
    const userRoleSnapshot = await userRolesCollection
      .where("name", "==", name)
      .get();

    if (!userRoleSnapshot.empty) {
      throw new UserInputError(ErrorCode.USER_ROLE_NAME_ALREADY_USED);
    }

    const userRole: DBUserRole = {
      id: uuid(),
      name,
      resourcePermissions,
    };

    await userRolesCollection.doc(userRole.id).set(userRole);

    return userRole;
  },
};
