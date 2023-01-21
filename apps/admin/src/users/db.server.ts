import { Prisma, User, UserGroup } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";

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
