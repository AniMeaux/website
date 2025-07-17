import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { fileStorage } from "#core/file-storage.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ApplicationPartnershipCategory } from "#show/exhibitors/applications/partnership-category";
import { ApplicationSearchParamsN } from "#show/exhibitors/applications/search-params";
import { TABLE_COUNT_BY_SIZE } from "#show/exhibitors/stand-configuration/table";
import type { ShowExhibitorApplication } from "@prisma/client";
import { Prisma, ShowExhibitorApplicationStatus } from "@prisma/client";
import partition from "lodash.partition";
import { promiseHash } from "remix-utils/promise";

export class MissingRefusalMessageError extends Error {}

export class ShowExhibitorApplicationDbDelegate {
  async findUnique<T extends Prisma.ShowExhibitorApplicationSelect>(
    id: string,
    params: { select: T },
  ) {
    const application = await prisma.showExhibitorApplication.findUnique({
      where: { id },
      select: params.select,
    });

    if (application == null) {
      throw notFound();
    }

    return application;
  }

  async findUniqueByExhibitor<T extends Prisma.ShowExhibitorApplicationSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    const application = await prisma.showExhibitorApplication.findUnique({
      where: { exhibitorId },
      select: params.select,
    });

    if (application == null) {
      throw notFound();
    }

    return application;
  }

  async findMany<T extends Prisma.ShowExhibitorApplicationSelect>(params: {
    searchParams: ApplicationSearchParamsN.Value;
    page: number;
    countPerPage: number;
    select: T;
  }) {
    const where: Prisma.ShowExhibitorApplicationWhereInput[] = [];

    if (params.searchParams.partnershipCategories.size > 0) {
      const [partnershipCategories, otherPartnershipCategories] = partition(
        Array.from(params.searchParams.partnershipCategories),
        ApplicationPartnershipCategory.isPartnershipCategory,
      );

      where.push({
        OR: [
          { partnershipCategory: { in: partnershipCategories } },
          { otherPartnershipCategory: { in: otherPartnershipCategories } },
        ],
      });
    }

    if (params.searchParams.name != null) {
      where.push({
        structureName: {
          contains: params.searchParams.name,
          mode: "insensitive",
        },
      });
    }

    if (params.searchParams.statuses.size > 0) {
      where.push({ status: { in: Array.from(params.searchParams.statuses) } });
    }

    if (params.searchParams.targets.size > 0) {
      where.push({
        structureActivityTargets: {
          hasSome: Array.from(params.searchParams.targets),
        },
      });
    }

    if (params.searchParams.fields.size > 0) {
      where.push({
        structureActivityFields: {
          hasSome: Array.from(params.searchParams.fields),
        },
      });
    }

    const { applications, totalCount } = await promiseHash({
      totalCount: prisma.showExhibitorApplication.count({
        where: { AND: where },
      }),

      applications: prisma.showExhibitorApplication.findMany({
        where: { AND: where },
        skip: params.page * params.countPerPage,
        take: params.countPerPage,
        orderBy: FIND_ORDER_BY_SORT[params.searchParams.sort],
        select: params.select,
      }),
    });

    return { applications, totalCount };
  }

  async update(
    id: ShowExhibitorApplication["id"],
    data: ShowExhibitorApplicationData,
  ) {
    this.validate(data);
    this.normalize(data);

    await prisma.$transaction(async (prisma) => {
      let application: ShowExhibitorApplication;

      try {
        application = await prisma.showExhibitorApplication.update({
          where: { id },
          data,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.NOT_FOUND) {
            throw new NotFoundError();
          }
        }

        throw error;
      }

      if (
        data.status === ShowExhibitorApplicationStatus.VALIDATED &&
        application.exhibitorId == null
      ) {
        const folder = await fileStorage.createFolder(
          application.structureName,
          { parentFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID },
        );

        await prisma.showExhibitor.create({
          data: {
            ...(application.partnershipCategory != null
              ? {
                  partnership: {
                    create: {
                      category: application.partnershipCategory,
                    },
                  },
                }
              : {}),

            application: { connect: { id } },

            documents: { create: { folderId: folder.id } },

            dogsConfiguration: { create: {} },

            profile: {
              create: {
                activityTargets: application.structureActivityTargets,
                activityFields: application.structureActivityFields,
                links: [application.structureUrl],
                logoPath: application.structureLogoPath,
                name: application.structureName,
              },
            },

            standConfiguration: {
              create: {
                size: application.desiredStandSize,
                tableCount: TABLE_COUNT_BY_SIZE[application.desiredStandSize],
              },
            },
          },
        });
      }
    });

    await notifyShowApp({
      type: "application-status-updated",
      applicationId: id,
    });
  }

  private validate(newData: ShowExhibitorApplicationData) {
    if (
      newData.status === ShowExhibitorApplicationStatus.REFUSED &&
      newData.refusalMessage == null
    ) {
      throw new MissingRefusalMessageError();
    }
  }

  normalize(data: ShowExhibitorApplicationData) {
    if (data.status !== ShowExhibitorApplicationStatus.REFUSED) {
      data.refusalMessage = null;
    }
  }
}

type ShowExhibitorApplicationData = Pick<
  ShowExhibitorApplication,
  "status" | "refusalMessage"
>;

const FIND_ORDER_BY_SORT: Record<
  ApplicationSearchParamsN.Sort,
  Prisma.ShowExhibitorApplicationFindManyArgs["orderBy"]
> = {
  [ApplicationSearchParamsN.Sort.CREATED_AT]: { createdAt: "desc" },
  [ApplicationSearchParamsN.Sort.NAME]: { structureName: "asc" },
};
