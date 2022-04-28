import { getAuth } from "firebase-admin/auth";
import { DefaultState, Middleware } from "koa";
import { getUser } from "../entities/user.entity";
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
        const currentUser = await getUser(decodedToken.uid);

        if (currentUser != null) {
          context.currentUser = currentUser;
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
