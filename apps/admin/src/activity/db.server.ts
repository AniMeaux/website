import type { ActivitySearchParams } from "#activity/search-params";
import { prisma } from "#core/prisma.server.js";
import { notFound } from "#core/response.server.js";
import type { Prisma } from "@prisma/client";
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
}
