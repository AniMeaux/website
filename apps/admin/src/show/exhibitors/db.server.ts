import { PrismaErrorCodes } from "#core/errors.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ShowExhibitorApplicationDbDelegate } from "#show/exhibitors/applications/db.server";
import { ShowExhibitorDocumentsDbDelegate } from "#show/exhibitors/documents/db.server";
import { ShowExhibitorDogsConfigurationDbDelegate } from "#show/exhibitors/dogs-configuration/db.server";
import { Payment } from "#show/exhibitors/payment";
import { ShowExhibitorProfileDbDelegate } from "#show/exhibitors/profile/db.server";
import { ExhibitorSearchParamsN } from "#show/exhibitors/search-params";
import { ShowExhibitorStandConfigurationDbDelegate } from "#show/exhibitors/stand-configuration/db.server";
import { Visibility } from "#show/visibility";
import { catchError } from "@animeaux/core";
import { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ShowExhibitorDbDelegate {
  readonly application = new ShowExhibitorApplicationDbDelegate();
  readonly documents = new ShowExhibitorDocumentsDbDelegate();
  readonly dogsConfiguration = new ShowExhibitorDogsConfigurationDbDelegate();
  readonly profile = new ShowExhibitorProfileDbDelegate();
  readonly standConfiguration = new ShowExhibitorStandConfigurationDbDelegate();

  async findUnique<T extends Prisma.ShowExhibitorSelect>(
    id: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { id },
      select: params.select,
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return exhibitor;
  }

  async findMany<T extends Prisma.ShowExhibitorSelect>(params: {
    searchParams: ExhibitorSearchParamsN.Value;
    page: number;
    countPerPage: number;
    select: T;
  }) {
    const where: Prisma.ShowExhibitorWhereInput[] = [];
    const statusesWhere: Prisma.ShowExhibitorWhereInput[] = [];

    if (
      params.searchParams.animations.has(ExhibitorSearchParamsN.Animation.NONE)
    ) {
      where.push({
        animations: { none: {} },
        profile: { onStandAnimations: null },
      });
    }

    if (
      params.searchParams.animations.has(
        ExhibitorSearchParamsN.Animation.ON_STAGE,
      )
    ) {
      where.push({ animations: { some: {} } });
    }

    if (
      params.searchParams.animations.has(
        ExhibitorSearchParamsN.Animation.ON_STAND,
      )
    ) {
      where.push({ profile: { onStandAnimations: { not: null } } });
    }

    if (params.searchParams.applicationStatuses.size > 0) {
      statusesWhere.push({
        application: {
          status: { in: Array.from(params.searchParams.applicationStatuses) },
        },
      });
    }

    if (params.searchParams.descriptionStatuses.size > 0) {
      statusesWhere.push({
        profile: {
          descriptionStatus: {
            in: Array.from(params.searchParams.descriptionStatuses),
          },
        },
      });
    }

    if (params.searchParams.documentsStatuses.size > 0) {
      statusesWhere.push({
        documents: {
          status: {
            in: Array.from(params.searchParams.documentsStatuses),
          },
        },
      });
    }

    if (params.searchParams.dogsConfigurationStatuses.size > 0) {
      statusesWhere.push({
        dogsConfiguration: {
          status: {
            in: Array.from(params.searchParams.dogsConfigurationStatuses),
          },
        },
      });
    }

    if (params.searchParams.fields.size > 0) {
      where.push({
        profile: {
          activityFields: {
            hasSome: Array.from(params.searchParams.fields),
          },
        },
      });
    }

    if (params.searchParams.name != null) {
      where.push({
        profile: {
          name: {
            contains: params.searchParams.name,
            mode: "insensitive",
          },
        },
      });
    }

    if (params.searchParams.onStandAnimationsStatuses.size > 0) {
      statusesWhere.push({
        profile: {
          onStandAnimationsStatus: {
            in: Array.from(params.searchParams.onStandAnimationsStatuses),
          },
        },
      });
    }

    if (params.searchParams.partnershipCategories.size > 0) {
      where.push({
        partnership: {
          category: {
            in: Array.from(params.searchParams.partnershipCategories),
          },
        },
      });
    }

    if (params.searchParams.payment.size > 0) {
      where.push({
        OR: Array.from(params.searchParams.payment).map((payment) => ({
          hasPaid: Payment.toBoolean(payment),
        })),
      });
    }

    if (params.searchParams.publicProfileStatuses.size > 0) {
      statusesWhere.push({
        profile: {
          publicProfileStatus: {
            in: Array.from(params.searchParams.publicProfileStatuses),
          },
        },
      });
    }

    if (params.searchParams.standConfigurationStatuses.size > 0) {
      statusesWhere.push({
        standConfiguration: {
          status: {
            in: Array.from(params.searchParams.standConfigurationStatuses),
          },
        },
      });
    }

    if (params.searchParams.targets.size > 0) {
      where.push({
        profile: {
          activityTargets: {
            hasSome: Array.from(params.searchParams.targets),
          },
        },
      });
    }

    if (params.searchParams.visibility.size > 0) {
      where.push({
        OR: Array.from(params.searchParams.visibility).map((visibility) => ({
          isVisible: Visibility.toBoolean(visibility),
        })),
      });
    }

    if (statusesWhere.length > 0) {
      where.push({ OR: statusesWhere });
    }

    const { exhibitors, totalCount } = await promiseHash({
      totalCount: prisma.showExhibitor.count({
        where: { AND: where },
      }),

      exhibitors: prisma.showExhibitor.findMany({
        where: { AND: where },
        skip: params.page * params.countPerPage,
        take: params.countPerPage,
        orderBy: FIND_ORDER_BY_SORT[params.searchParams.sort],
        select: params.select,
      }),
    });

    return { exhibitors, totalCount };
  }

  async update(exhibitorId: string, data: ShowExhibitorData) {
    const [error, becameVisible] = await catchError(() =>
      prisma.$transaction(async (prisma) => {
        const previousExhibitor = await prisma.showExhibitor.findUnique({
          where: { id: exhibitorId },
          select: { isVisible: true },
        });

        if (previousExhibitor == null) {
          throw notFound();
        }

        const exhibitor = await prisma.showExhibitor.update({
          where: { id: exhibitorId },
          data: {
            hasPaid: data.hasPaid,
            isVisible: data.isVisible,

            standConfiguration: {
              update: {
                locationNumber: data.locationNumber,
                standNumber: data.standNumber,
              },
            },
          },
          select: { isVisible: true },
        });

        return exhibitor.isVisible && !previousExhibitor.isVisible;
      }),
    );

    if (error != null) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    if (becameVisible) {
      await notifyShowApp({
        type: "exhibitor-visible",
        exhibitorId,
      });
    }
  }
}

const FIND_ORDER_BY_SORT: Record<
  ExhibitorSearchParamsN.Sort,
  Prisma.ShowExhibitorFindManyArgs["orderBy"]
> = {
  [ExhibitorSearchParamsN.Sort.NAME]: { profile: { name: "asc" } },
  [ExhibitorSearchParamsN.Sort.UPDATED_AT]: { updatedAt: "desc" },
};

type ShowExhibitorData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "hasPaid" | "isVisible"
> &
  Pick<
    Prisma.ShowExhibitorStandConfigurationUpdateInput,
    "locationNumber" | "standNumber"
  >;
