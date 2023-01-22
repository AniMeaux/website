import { Prisma, User, UserGroup } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";
import { generatePasswordHash } from "~/users/password.server";

const SEARCH_COUNT = 6;

export async function fuzzySearchUsers({
  displayName,
  groups,
  isDisabled,
}: {
  displayName: null | string;
  groups: UserGroup[];
  isDisabled: null | boolean;
}) {
  // Don't use Algolia when there are no text search.
  if (displayName == null) {
    const managers = await prisma.user.findMany({
      where: {
        groups: groups.length === 0 ? undefined : { hasSome: groups },
        isDisabled: isDisabled ?? undefined,
      },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
      take: SEARCH_COUNT,
    });

    return managers.map((manager) => ({
      ...manager,
      highlightedDisplayName: manager.displayName,
    }));
  }

  return await algolia.user.search(
    { displayName, groups, isDisabled },
    { hitsPerPage: SEARCH_COUNT }
  );
}

export class DisableMyselfError extends Error {}

export async function setUserIsDisabled(
  userId: User["id"],
  currentUser: Pick<User, "id">,
  isDisabled: boolean
) {
  // Don't allow a user to disable himself.
  if (currentUser.id === userId) {
    throw new DisableMyselfError();
  }

  await prisma.$transaction(async (prisma) => {
    try {
      await prisma.user.update({ where: { id: userId }, data: { isDisabled } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
    }

    await algolia.user.update(userId, { isDisabled });
  });
}

export class DeleteMyselfError extends Error {}

export async function deleteUser(
  userId: User["id"],
  currentUser: Pick<User, "id">
) {
  // Don't allow a user to delete himself.
  if (currentUser.id === userId) {
    throw new DeleteMyselfError();
  }

  await prisma.$transaction(async (prisma) => {
    try {
      await prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_FOUND: {
            throw new NotFoundError();
          }

          case PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED: {
            throw new ReferencedError();
          }
        }
      }

      throw error;
    }

    await algolia.user.delete(userId);
  });
}

export class MissingPasswordError extends Error {}

export async function createUser({
  displayName,
  email,
  groups,
  temporaryPassword,
}: Pick<User, "displayName" | "email" | "groups"> & {
  temporaryPassword: string;
}) {
  if (temporaryPassword === "") {
    throw new MissingPasswordError();
  }

  const passwordHash = await generatePasswordHash(temporaryPassword);

  return await prisma.$transaction(async (prisma) => {
    try {
      const user = await prisma.user.create({
        data: {
          displayName,
          email,
          groups,
          password: { create: { hash: passwordHash } },
        },
        select: { id: true, isDisabled: true },
      });

      await algolia.user.create(user.id, {
        displayName,
        groups,
        isDisabled: user.isDisabled,
      });

      return user.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new EmailAlreadyUsedError();
        }
      }

      throw error;
    }
  });
}

export class LockMyselfError extends Error {}

export async function updateUser(
  userId: User["id"],
  {
    displayName,
    email,
    groups,
    temporaryPassword,
  }: Pick<User, "displayName" | "email" | "groups"> & {
    temporaryPassword: string;
  },
  currentUser: Pick<User, "id">
) {
  // Don't allow an admin (only admins can access users) to lock himself out.
  if (currentUser.id === userId && !groups.includes(UserGroup.ADMIN)) {
    throw new LockMyselfError();
  }

  const passwordHash =
    temporaryPassword === ""
      ? null
      : await generatePasswordHash(temporaryPassword);

  await prisma.$transaction(async (prisma) => {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          displayName,
          email,
          groups,
          shouldChangePassword: passwordHash != null || undefined,
          password:
            passwordHash == null
              ? undefined
              : { update: { hash: passwordHash } },
        },
        select: { id: true },
      });

      await algolia.user.update(user.id, { displayName, groups });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_FOUND: {
            throw new NotFoundError();
          }

          case PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED: {
            throw new EmailAlreadyUsedError();
          }
        }
      }

      throw error;
    }
  });
}
