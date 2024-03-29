import { algolia } from "#core/algolia/algolia.server";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { UserHit } from "@animeaux/algolia-client";
import { generatePasswordHash } from "@animeaux/password";
import type { User } from "@prisma/client";
import { Prisma, UserGroup } from "@prisma/client";

export class DisableMyselfError extends Error {}
export class DeleteMyselfError extends Error {}
export class MissingPasswordError extends Error {}
export class LockMyselfError extends Error {}

export class UserDbDelegate {
  async fuzzySearch({
    displayName,
    groups = [],
    isDisabled,
    maxHitCount,
  }: {
    displayName?: string;
    groups?: UserGroup[];
    isDisabled?: boolean;
    maxHitCount: number;
  }): Promise<UserHit[]> {
    // Don't use Algolia when there are no text search.
    if (displayName == null) {
      const users = await prisma.user.findMany({
        where: {
          groups: groups.length === 0 ? undefined : { hasSome: groups },
          isDisabled: isDisabled ?? undefined,
        },
        select: { id: true, displayName: true, groups: true, isDisabled: true },
        orderBy: { displayName: "asc" },
        take: maxHitCount,
      });

      return users.map((user) => ({
        ...user,
        _highlighted: { displayName: user.displayName },
      }));
    }

    return await algolia.user.findMany({
      where: { displayName, groups, isDisabled },
      hitsPerPage: maxHitCount,
    });
  }

  async setIsDisabled(
    id: User["id"],
    currentUser: Pick<User, "id">,
    isDisabled: boolean,
  ) {
    // Don't allow a user to disable himself.
    if (currentUser.id === id) {
      throw new DisableMyselfError();
    }

    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.user.update({ where: { id }, data: { isDisabled } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            throw new NotFoundError();
          }
        }

        throw error;
      }

      await algolia.user.update({ id, isDisabled });
    });
  }

  async delete(userId: User["id"], currentUser: Pick<User, "id">) {
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

  async create({
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

        await algolia.user.create({
          id: user.id,
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

  async update(
    userId: User["id"],
    {
      displayName,
      email,
      groups,
      temporaryPassword,
    }: Pick<User, "displayName" | "email" | "groups"> & {
      temporaryPassword: string;
    },
    currentUser: Pick<User, "id">,
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

        await algolia.user.update({ id: user.id, displayName, groups });
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
}
