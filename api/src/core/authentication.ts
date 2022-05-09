import { CurrentUser, hasGroups, UserGroup } from "@animeaux/shared";
import { getAuth } from "firebase-admin/auth";
import { ParameterizedContext } from "koa";
import { getUserFromAuth, getUserFromStore } from "../entities/user.entity";
import { isFirebaseError } from "./firebase";
import { OperationError } from "./operations";

const ERROR_CODES_TO_IGNORE = [
  "auth/user-disabled",
  "auth/id-token-expired",
  "auth/id-token-revoked",
];

export async function getCurrentUser(
  context: ParameterizedContext
): Promise<CurrentUser | null> {
  if (typeof context.request.headers.authorization === "string") {
    const token = context.request.headers.authorization.replace("Bearer ", "");

    try {
      const decodedToken = await getAuth().verifyIdToken(token, true);
      const [userFromStore, userFromAuth] = await Promise.all([
        getUserFromStore(decodedToken.uid),
        getUserFromAuth(decodedToken.uid),
      ]);

      if (
        userFromStore != null &&
        userFromAuth != null &&
        !userFromAuth.disabled
      ) {
        return {
          id: decodedToken.uid,
          displayName: userFromAuth.displayName,
          email: userFromAuth.email,
          disabled: userFromAuth.disabled,
          groups: userFromStore.groups,
        };
      }
    } catch (error) {
      if (
        !isFirebaseError(error) ||
        !ERROR_CODES_TO_IGNORE.includes(error.code)
      ) {
        throw error;
      }
    }
  }

  return null;
}

export function assertHasUser(
  user: CurrentUser | null | undefined
): asserts user is CurrentUser {
  if (user == null) {
    throw new OperationError(401);
  }
}

export function userHasGroups(
  user: CurrentUser | null | undefined,
  groups: UserGroup[]
): user is CurrentUser {
  if (user == null) {
    return false;
  }

  return hasGroups(user, groups);
}

export function assertUserHasGroups(
  user: CurrentUser | null | undefined,
  groups: UserGroup[]
): asserts user is CurrentUser {
  assertHasUser(user);

  if (!hasGroups(user, groups)) {
    throw new OperationError(403);
  }
}
