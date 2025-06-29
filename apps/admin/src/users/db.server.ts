import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { orderByRank } from "#core/order-by-rank";
import { prisma } from "#core/prisma.server";
import type { UserSearchParams } from "#users/search-params";
import { UserSort } from "#users/search-params";
import { generatePasswordHash } from "@animeaux/password";
import type { SearchParamsIO } from "@animeaux/search-params-io";
import type { User } from "@prisma/client";
import { Prisma, UserGroup } from "@prisma/client";
import { DateTime } from "luxon";

export class DisableMyselfError extends Error {}
export class DeleteMyselfError extends Error {}
export class MissingPasswordError extends Error {}
export class LockMyselfError extends Error {}

export class UserDbDelegate {
  async fuzzySearch<T extends Prisma.UserSelect>(
    displayName: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.UserWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.UserSelect;

    // When there are no text search, return hits ordered by name.
    if (displayName == null) {
      return await prisma.user.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: { displayName: "asc" },
        take,
      });
    }

    const hits = await this.getHits(displayName);

    const users = (await prisma.user.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.UserGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(users, hits, { take }) as Prisma.UserGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
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
  }

  async delete(userId: User["id"], currentUser: Pick<User, "id">) {
    // Don't allow a user to delete himself.
    if (currentUser.id === userId) {
      throw new DeleteMyselfError();
    }

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

    try {
      const user = await prisma.user.create({
        data: {
          displayName,
          email,
          groups,
          password: { create: { hash: passwordHash } },
        },
        select: { id: true },
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

    try {
      await prisma.user.update({
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
  }

  async createFindManyParams(
    searchParams: SearchParamsIO.Infer<typeof UserSearchParams>,
  ) {
    const where: Prisma.UserWhereInput[] = [];

    if (searchParams.groups.size > 0) {
      where.push({ groups: { hasSome: Array.from(searchParams.groups) } });
    }

    if (
      searchParams.lastActivityStart != null ||
      searchParams.lastActivityEnd != null
    ) {
      const lastActivityAt: Prisma.DateTimeFilter = {};

      if (searchParams.lastActivityStart != null) {
        lastActivityAt.gte = searchParams.lastActivityStart;
      }

      if (searchParams.lastActivityEnd != null) {
        lastActivityAt.lte = DateTime.fromJSDate(searchParams.lastActivityEnd)
          .endOf("day")
          .toJSDate();
      }

      where.push({ lastActivityAt });
    }

    if (searchParams.noActivity) {
      where.push({ lastActivityAt: null });
    }

    if (searchParams.displayName != null) {
      const hits = await this.getHits(searchParams.displayName);

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    const orderBy = USER_ORDER_BY[searchParams.sort];

    return {
      orderBy,
      where: { AND: where },
    } satisfies Prisma.UserFindManyArgs;
  }

  private async getHits(
    displayName: string,
  ): Promise<{ id: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_users AS (
          SELECT
            id,
            match_sorter_rank (ARRAY["displayName"], ${displayName}) AS "matchRank"
          FROM
            "User"
        )
      SELECT
        *
      FROM
        ranked_users
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
  }
}

const USER_ORDER_BY: Record<UserSort, Prisma.UserFindManyArgs["orderBy"]> = {
  [UserSort.NAME]: { displayName: "asc" },
  [UserSort.LAST_ACTIVITY]: { lastActivityAt: "desc" },
};
