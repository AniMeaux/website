import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { SponsorSearchParamsN } from "#show/sponsors/search-params";
import { Visibility } from "#show/visibility";
import type { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ShowSponsorDbDelegate {
  async findUnique<T extends Prisma.ShowSponsorSelect>(
    id: string,
    params: { select: T },
  ) {
    const sponsor = await prisma.showSponsor.findUnique({
      where: { id },
      select: params.select,
    });

    if (sponsor == null) {
      throw notFound();
    }

    return sponsor;
  }

  async findUniqueByExhibitor<T extends Prisma.ShowSponsorSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    return await prisma.showSponsor.findUnique({
      where: { exhibitorId },
      select: params.select,
    });
  }

  async findMany<T extends Prisma.ShowSponsorSelect>(params: {
    searchParams: SponsorSearchParamsN.Value;
    page: number;
    countPerPage: number;
    select: T;
  }) {
    const where: Prisma.ShowSponsorWhereInput[] = [];

    if (params.searchParams.categories.size > 0) {
      where.push({
        category: { in: Array.from(params.searchParams.categories) },
      });
    }

    if (params.searchParams.exhibitor.size === 1) {
      where.push({
        exhibitorId: params.searchParams.exhibitor.has(
          SponsorSearchParamsN.Exhibitor.Enum.YES,
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
              name: {
                contains: params.searchParams.name,
                mode: "insensitive",
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

    const { sponsors, totalCount } = await promiseHash({
      totalCount: prisma.showSponsor.count({
        where: { AND: where },
      }),

      sponsors: prisma.showSponsor.findMany({
        where: { AND: where },
        skip: params.page * params.countPerPage,
        take: params.countPerPage,
        orderBy: { name: "asc" },
        select: params.select,
      }),
    });

    return { sponsors, totalCount };
  }
}
