import { User, UserGroup } from "@animeaux/shared";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { AlgoliaClient } from "../core/algolia";
import { isFirebaseError } from "../core/firebase";

export const USER_COLLECTION = "users";
export const UserIndex = AlgoliaClient.initIndex(USER_COLLECTION);

export type UserFromStore = {
  id: string;
  groups: UserGroup[];
};

export type UserFromAlgolia = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
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
