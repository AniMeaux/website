import { CurrentUserOperations } from "@animeaux/shared";
import { getAuth } from "firebase-admin/auth";
import { object, string } from "yup";
import {
  assertDontHaveUser,
  assertHasUser,
  getCurrentUser,
} from "../core/authentication";
import { prisma } from "../core/db";
import { initializeFirebase, isFirebaseError } from "../core/firebase";
import { OperationError, OperationsImpl } from "../core/operations";
import { generatePasswordHash, isSamePassword } from "../core/password";
import { deleteSession, setUserIdInSession } from "../core/session";
import { validateParams } from "../core/validation";
import { mapCurrentUser } from "../entities/currentUser.entity";
import {
  SearchableResourceFromAlgolia,
  SearchableResourcesIndex,
  SearchableResourceType,
} from "../entities/searchableResources.entity";
import { UserFromAlgolia, UserIndex } from "../entities/user.entity";

const FIREBASE_ERROR_CODES_TO_IGNORE = [
  "auth/user-disabled",
  "auth/id-token-expired",
  "auth/id-token-revoked",
];

export const currentUserOperations: OperationsImpl<CurrentUserOperations> = {
  async logIn(rawParams, context) {
    assertDontHaveUser(await getCurrentUser(context));

    const params = validateParams<"logIn">(
      object({
        email: string().required(),
        password: string().required(),
      }),
      rawParams
    );

    const user = await prisma.user.findUnique({
      where: { email: params.email },
      include: { password: true },
    });

    if (user?.password == null) {
      // Prevent finding out which emails exists through a timing attack.
      // We want to take approximately the same time to respond so we fake a
      // password comparison.
      await isSamePassword(
        "Hello there",
        // "Obiwan Kenobi?"
        "879d5935bab9b03280188c1806cf5ae751579b3342c51e788c43be14e0109ab8b98da03f5fa2cc96c85ca192eda9aaf892cba7ba1fc3b7d1a4a1eb8956a65c53.6a71cc1003ad30a5c6abf0d53baa2c5d"
      );

      throw new OperationError(400);
    }

    if (!(await isSamePassword(params.password, user.password.hash))) {
      throw new OperationError(400);
    }

    setUserIdInSession(context, user.id);

    return mapCurrentUser(user);
  },

  async migratePassword(rawParams, context) {
    assertDontHaveUser(await getCurrentUser(context));

    const params = validateParams<"migratePassword">(
      object({
        token: string().required(),
        password: string().required(),
      }),
      rawParams
    );

    try {
      initializeFirebase();
      const decodedToken = await getAuth().verifyIdToken(params.token, true);
      const hash = await generatePasswordHash(params.password);
      const user = await prisma.user.update({
        where: { legacyId: decodedToken.uid },
        data: { password: { create: { hash: hash } } },
      });

      setUserIdInSession(context, user.id);

      return mapCurrentUser(user);
    } catch (error) {
      if (
        isFirebaseError(error) &&
        FIREBASE_ERROR_CODES_TO_IGNORE.includes(error.code)
      ) {
        throw new OperationError(400);
      }

      throw error;
    }
  },

  async logOut(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertHasUser(currentUser);
    await deleteSession(context);
    return true;
  },

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

    const newCurrentUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { displayName: params.displayName },
    });

    const userFromAlgolia: Partial<UserFromAlgolia> = {
      displayName: newCurrentUser.displayName,
    };

    await UserIndex.partialUpdateObject({
      ...userFromAlgolia,
      objectID: newCurrentUser.id,
    });

    const searchableUserFromAlgolia: SearchableResourceFromAlgolia = {
      type: SearchableResourceType.USER,
      data: { displayName: newCurrentUser.displayName },
    };

    await SearchableResourcesIndex.saveObject({
      ...searchableUserFromAlgolia,
      objectID: newCurrentUser.id,
    });

    return mapCurrentUser(newCurrentUser);
  },

  async updateCurrentUserPassword(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertHasUser(currentUser);

    const params = validateParams<"updateCurrentUserPassword">(
      object({ password: string().required() }),
      rawParams
    );

    const hash = await generatePasswordHash(params.password);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        shouldChangePassword: false,
        password: { update: { hash } },
      },
    });

    return true;
  },
};
