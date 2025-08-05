import { ActivityAction } from "#activity/action";
import { ActivityActorType } from "#activity/actor-type";
import { ActivityResource } from "#activity/resource";
import type { ActivitySearchParams } from "#activity/search-params";
import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import type { Prisma } from "@prisma/client";
import { captureException } from "@sentry/remix";
import isEqual from "lodash.isequal";
import pick from "lodash.pick";
import { promiseHash } from "remix-utils/promise";

export namespace Activity {
  export async function findUnique<T extends Prisma.ActivitySelect>(
    id: string,
    params: { select: T },
  ) {
    const activity = await prisma.activity.findUnique({
      where: { id },
      select: params.select,
    });

    if (activity == null) {
      throw notFound();
    }

    return activity;
  }

  export async function findMany<T extends Prisma.ActivitySelect>(params: {
    searchParams: ActivitySearchParams.Value;
    page: number;
    countPerPage: number;
    select: T;
  }) {
    const where: Prisma.ActivityWhereInput[] = [];

    if (params.searchParams.actions.size > 0) {
      where.push({ action: { in: Array.from(params.searchParams.actions) } });
    }

    if (
      params.searchParams.dateStart != null ||
      params.searchParams.dateEnd != null
    ) {
      const createdAt: Prisma.DateTimeFilter = {};

      if (params.searchParams.dateStart != null) {
        createdAt.gte = params.searchParams.dateStart;
      }

      if (params.searchParams.dateEnd != null) {
        createdAt.lte = params.searchParams.dateEnd;
      }

      where.push({ createdAt });
    }

    if (params.searchParams.resources.size > 0) {
      where.push({
        resource: { in: Array.from(params.searchParams.resources) },
      });
    }

    if (params.searchParams.resourceId != null) {
      where.push({
        resourceId: {
          contains: params.searchParams.resourceId,
          mode: "insensitive",
        },
      });
    }

    if (params.searchParams.usersId.size > 0) {
      where.push({
        actorId: { in: Array.from(params.searchParams.usersId) },
      });
    }

    const { activities, totalCount } = await promiseHash({
      totalCount: prisma.activity.count({ where: { AND: where } }),

      activities: prisma.activity.findMany({
        where: { AND: where },
        skip: params.page * params.countPerPage,
        take: params.countPerPage,
        orderBy: { createdAt: "desc" },
        select: params.select,
      }),
    });

    return { activities, totalCount };
  }

  export async function create(params: Params) {
    try {
      await prisma.activity.create({
        data: {
          actorType:
            params.cronId != null
              ? ActivityActorType.Enum.CRON
              : ActivityActorType.Enum.USER,

          actorId: params.cronId ?? params.currentUser.id,
          userIdRef: params.currentUser?.id,

          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,

          ...simplifyDiff(params),

          ...(params.action === ActivityAction.Enum.DELETE
            ? {}
            : params.resource === ActivityResource.Enum.ANIMAL
              ? { animalId: params.resourceId }
              : { fosterFamilyId: params.resourceId }),
        },
      });
    } catch (error) {
      console.error("error:", error);
      captureException(error, { extra: { params: JSON.stringify(params) } });
    }
  }

  function simplifyDiff(params: Params): {
    before?: Prisma.JsonObject;
    after?: Prisma.JsonObject;
  } {
    switch (params.action) {
      case ActivityAction.Enum.CREATE: {
        return { after: toPrismaJson(params.after) };
      }

      case ActivityAction.Enum.DELETE: {
        return { before: toPrismaJson(params.before) };
      }

      case ActivityAction.Enum.UPDATE: {
        const { before, after } = diffObjects(params.before, params.after);

        return {
          before: toPrismaJson(before),
          after: toPrismaJson(after),
        };
      }

      default: {
        return params satisfies never;
      }
    }
  }

  function toPrismaJson(
    object: undefined | object,
  ): undefined | Prisma.JsonObject {
    if (object === undefined) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => {
        if (value instanceof Date) {
          return [key, value.toISOString()];
        }

        return [key, value];
      }),
    );
  }

  type ParamsUser = {
    currentUser: { id: string };
    cronId?: undefined;
  };

  type ParamsCron = {
    currentUser?: undefined;
    cronId: string;
  };

  type ParamsResource = {
    resource: ActivityResource.Enum;
    resourceId: string;
  };

  type ParamsCreate = {
    action: typeof ActivityAction.Enum.CREATE;
    before?: undefined;
    after: DiffableObject;
  };

  type ParamsDelete = {
    action: typeof ActivityAction.Enum.DELETE;
    before: DiffableObject;
    after?: undefined;
  };

  type ParamsUpdate = {
    action: typeof ActivityAction.Enum.UPDATE;
    before: DiffableObject;
    after: DiffableObject;
  };

  type Params = ParamsResource &
    (ParamsUser | ParamsCron) &
    (ParamsCreate | ParamsDelete | ParamsUpdate);

  function diffObjects(
    before: DiffableObject,
    after: DiffableObject,
  ): { before: DiffableObject; after: DiffableObject } {
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

    const changedKeys = Array.from(allKeys).filter(
      (key) => !isEqual(before[key], after[key]),
    );

    return {
      before: pick(before, changedKeys),
      after: pick(after, changedKeys),
    };
  }

  type DiffableObject = Record<string, DiffableValue>;

  type DiffableValue = string | number | boolean | Date | DiffableArray | null;

  type DiffableArray = DiffableValue[];
}
