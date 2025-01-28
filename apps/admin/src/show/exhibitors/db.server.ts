import { prisma } from "#core/prisma.server";
import { ShowExhibitorApplicationDbDelegate } from "#show/exhibitors/applications/db.server";
import { paymentToBoolean } from "#show/exhibitors/payment";
import { ExhibitorSearchParamsN } from "#show/exhibitors/search-params";
import { visibilityToBoolean } from "#show/visibility";
import type { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ShowExhibitorDbDelegate {
  readonly application = new ShowExhibitorApplicationDbDelegate();

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
          hasPaid: paymentToBoolean(payment),
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
          isVisible: visibilityToBoolean(visibility),
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
}

const FIND_ORDER_BY_SORT: Record<
  ExhibitorSearchParamsN.Sort,
  Prisma.ShowExhibitorFindManyArgs["orderBy"]
> = {
  [ExhibitorSearchParamsN.Sort.NAME]: { profile: { name: "asc" } },
  [ExhibitorSearchParamsN.Sort.UPDATED_AT]: { updatedAt: "desc" },
};
