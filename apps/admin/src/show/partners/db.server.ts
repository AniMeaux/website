import { prisma } from "#core/prisma.server";
import { PartnerSearchParamsN } from "#show/partners/search-params";
import { Visibility } from "#show/visibility";
import type { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ShowPartnerDbDelegate {
  async findUniqueByExhibitor<T extends Prisma.ShowPartnerSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    return await prisma.showPartner.findUnique({
      where: { exhibitorId },
      select: params.select,
    });
  }

  async findMany<T extends Prisma.ShowPartnerSelect>(params: {
    searchParams: PartnerSearchParamsN.Value;
    page: number;
    countPerPage: number;
    select: T;
  }) {
    const where: Prisma.ShowPartnerWhereInput[] = [];

    if (params.searchParams.categories.size > 0) {
      where.push({
        category: { in: Array.from(params.searchParams.categories) },
      });
    }

    if (params.searchParams.exhibitor.size === 1) {
      where.push({
        exhibitorId: params.searchParams.exhibitor.has(
          PartnerSearchParamsN.Exhibitor.Enum.YES,
        )
          ? { not: null }
          : null,
      });
    }

    if (params.searchParams.name != null) {
      where.push({
        OR: [
          { name: { contains: params.searchParams.name, mode: "insensitive" } },
          {
            exhibitor: {
              profile: {
                name: {
                  contains: params.searchParams.name,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      });
    }

    if (params.searchParams.visibility.size > 0) {
      where.push({
        OR: Array.from(params.searchParams.visibility).map((visibility) => ({
          isVisible: Visibility.toBoolean(visibility),
        })),
      });
    }

    const { partners, totalCount } = await promiseHash({
      totalCount: prisma.showPartner.count({
        where: { AND: where },
      }),

      partners: prisma.showPartner.findMany({
        where: { AND: where },
        skip: params.page * params.countPerPage,
        take: params.countPerPage,
        orderBy: { name: "asc" },
        select: params.select,
      }),
    });

    return { partners, totalCount };
  }
}
