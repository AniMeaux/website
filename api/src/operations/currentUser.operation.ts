import { CurrentUserOperations } from "@animeaux/shared";
import { getAuth } from "firebase-admin/auth";
import { object, string } from "yup";
import { assertHasUser, getCurrentUser } from "../core/authentication";
import { isFirebaseError } from "../core/firebase";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";

export const currentUserOperations: OperationsImpl<CurrentUserOperations> = {
  async getCurrentUser(rawParams, context) {
    return await getCurrentUser(context);
  },

  async updateCurrentUserProfile(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertHasUser(currentUser);

    const params = validateParams<"updateCurrentUserProfile">(
      object({ displayName: string().trim().required() }),
      rawParams
    );

    await getAuth().updateUser(currentUser.id, {
      displayName: params.displayName,
    });

    return { ...currentUser, displayName: params.displayName };
  },

  async updateCurrentUserPassword(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertHasUser(currentUser);

    const params = validateParams<"updateCurrentUserPassword">(
      object({ password: string().required() }),
      rawParams
    );

    try {
      await getAuth().updateUser(currentUser.id, {
        password: params.password,
      });
    } catch (error) {
      if (isFirebaseError(error) && error.code === "auth/invalid-password") {
        throw new OperationError<"updateCurrentUserPassword">(400, {
          code: "week-password",
        });
      }

      throw error;
    }

    return true;
  },
};
