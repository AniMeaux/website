import { NotFoundError, PrismaErrorCodes } from "#core/errors.server";
import { fileStorage } from "#core/file-storage.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ApplicationSearchParamsN } from "#show/exhibitors/applications/search-params";
import { ExhibitorCategory } from "#show/exhibitors/category";
import { SponsorshipOptionalCategory } from "#show/sponsors/category.js";
import { catchError } from "@animeaux/core";
import type { ShowExhibitorApplication } from "@animeaux/prisma/server";
import {
  Prisma,
  ShowExhibitorApplicationStatus,
} from "@animeaux/prisma/server";
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
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { id: exhibitorId },
      select: { application: { select: params.select } },
    });

    if (exhibitor?.application == null) {
      throw notFound();
    }

    return exhibitor.application;
  }

  async findMany<T extends Prisma.ShowExhibitorApplicationSelect>(params: {
    searchParams: ApplicationSearchParamsN.Value;
    pagination?: { page: number; countPerPage: number };
    select: T;
  }) {
    const where: Prisma.ShowExhibitorApplicationWhereInput[] = [];

    if (params.searchParams.sponsorshipCategories.size > 0) {
      const sponsorshipCategoryWhere: Prisma.ShowExhibitorApplicationWhereInput[] =
        [];

      if (
        params.searchParams.sponsorshipCategories.has(
          SponsorshipOptionalCategory.Enum.NO_SPONSORSHIP,
        )
      ) {
        sponsorshipCategoryWhere.push({ sponsorshipCategory: null });
      }

      const sponsorshipCategories = Array.from(
        params.searchParams.sponsorshipCategories,
      )
        .map(SponsorshipOptionalCategory.toDb)
        .filter(Boolean);

      if (sponsorshipCategories.length > 0) {
        sponsorshipCategoryWhere.push({
          sponsorshipCategory: { in: sponsorshipCategories },
        });
      }

      where.push({ OR: sponsorshipCategoryWhere });
    }

    if (params.searchParams.name != null) {
      where.push({
        structureName: {
          contains: params.searchParams.name,
          mode: "insensitive",
        },
      });
    }

    if (params.searchParams.standSizesId.size > 0) {
      where.push({
        desiredStandSize: {
          id: { in: Array.from(params.searchParams.standSizesId) },
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
        orderBy: FIND_ORDER_BY_SORT[params.searchParams.sort],
        select: params.select,

        ...(params.pagination != null
          ? {
              skip: params.pagination.page * params.pagination.countPerPage,
              take: params.pagination.countPerPage,
            }
          : null),
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
      let application: Prisma.ShowExhibitorApplicationGetPayload<{
        include: {
          exhibitor: { select: { id: true } };
          desiredStandSize: { select: { id: true; maxTableCount: true } };
        };
      }>;

      try {
        application = await prisma.showExhibitorApplication.update({
          where: { id },
          data,
          include: {
            exhibitor: { select: { id: true } },
            desiredStandSize: { select: { id: true, maxTableCount: true } },
          },
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
        application.exhibitor == null
      ) {
        const folder = await fileStorage.createFolder(
          application.structureName,
          { parentFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID },
        );

        await prisma.showExhibitor.create({
          data: {
            ...(application.sponsorshipCategory != null
              ? {
                  sponsorship: {
                    create: {
                      category: application.sponsorshipCategory,
                    },
                  },
                }
              : {}),

            application: { connect: { id } },
            size: { connect: { id: application.desiredStandSize.id } },

            activityFields: application.structureActivityFields,
            activityTargets: application.structureActivityTargets,
            billingAddress: application.structureAddress,
            billingCity: application.structureCity,
            billingCountry: application.structureCountry,
            billingZipCode: application.structureZipCode,
            category: ExhibitorCategory.get({
              legalStatus: application.structureLegalStatus,
              activityFields: application.structureActivityFields,
            }),
            folderId: folder.id,
            links: [application.structureUrl],
            logoPath: application.structureLogoPath,
            name: application.structureName,
            tableCount: application.desiredStandSize.maxTableCount,
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

  async delete(id: string) {
    const [error] = await catchError(() =>
      prisma.showExhibitorApplication.delete({ where: { id } }),
    );

    if (error != null) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
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
