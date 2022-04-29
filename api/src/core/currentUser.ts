import { getAuth } from "firebase-admin/auth";
import { DefaultState, Middleware } from "koa";
import { getUserFromAuth, getUserFromStore } from "../entities/user.entity";
import { Context } from "./contex";
import { isFirebaseError } from "./firebase";

const ERROR_CODES_TO_IGNORE = [
  "auth/user-disabled",
  "auth/id-token-expired",
  "auth/id-token-revoked",
];

export function currentUserMiddleware(): Middleware<DefaultState, Context> {
  return async function authenticationMiddleware(context, next) {
    if (typeof context.request.headers.authorization === "string") {
      const token = context.request.headers.authorization.replace(
        "Bearer ",
        ""
      );

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
          context.currentUser = {
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

    return next();
  };
}
