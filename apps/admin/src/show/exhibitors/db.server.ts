import { PrismaErrorCodes } from "#core/errors.server";
import { fileStorage } from "#core/file-storage.server";
import { notifyShowApp } from "#core/notification.server";
import { orderByRank } from "#core/order-by-rank.js";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ShowExhibitorApplicationDbDelegate } from "#show/exhibitors/applications/db.server";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { InvoiceStatus } from "#show/invoice/status.js";
import { SponsorshipOptionalCategory } from "#show/sponsors/category";
import { Visibility } from "#show/visibility";
import { catchError } from "@animeaux/core";
import { Prisma } from "@animeaux/prisma/server";
import { promiseHash } from "remix-utils/promise";

export class ShowExhibitorDbDelegate {
  readonly application = new ShowExhibitorApplicationDbDelegate();

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
    searchParams: ExhibitorSearchParams;
    pagination?: { page: number; countPerPage: number };
    select: T;
  }) {
    const where: Prisma.ShowExhibitorWhereInput[] = [];
    const statusesWhere: Prisma.ShowExhibitorWhereInput[] = [];

    if (
      params.searchParams.animations.has(
        ExhibitorSearchParams.Animation.Enum.NONE,
      )
    ) {
      where.push({
        animations: { none: {} },
        onStandAnimations: null,
      });
    }

    if (
      params.searchParams.animations.has(
        ExhibitorSearchParams.Animation.Enum.ON_STAGE,
      )
    ) {
      where.push({ animations: { some: {} } });
    }

    if (
      params.searchParams.animations.has(
        ExhibitorSearchParams.Animation.Enum.ON_STAND,
      )
    ) {
      where.push({ onStandAnimations: { not: null } });
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
        descriptionStatus: {
          in: Array.from(params.searchParams.descriptionStatuses),
        },
      });
    }

    if (params.searchParams.dividerTypesId.size > 0) {
      where.push({
        dividerType: {
          id: { in: Array.from(params.searchParams.dividerTypesId) },
        },
      });
    }

    if (params.searchParams.documentsStatuses.size > 0) {
      statusesWhere.push({
        documentStatus: {
          in: Array.from(params.searchParams.documentsStatuses),
        },
      });
    }

    if (params.searchParams.dogsConfigurationStatuses.size > 0) {
      statusesWhere.push({
        dogsConfigurationStatus: {
          in: Array.from(params.searchParams.dogsConfigurationStatuses),
        },
      });
    }

    if (params.searchParams.fields.size > 0) {
      where.push({
        activityFields: {
          hasSome: Array.from(params.searchParams.fields),
        },
      });
    }

    if (params.searchParams.invoiceStatuses.size > 0) {
      const invoicesWhere: Prisma.ShowExhibitorWhereInput[] = [];

      if (params.searchParams.invoiceStatuses.has(InvoiceStatus.Enum.PAID)) {
        invoicesWhere.push({
          invoices: {
            every: { status: InvoiceStatus.Enum.PAID },
            // Ensure at least 1 invoice exist.
            some: {},
          },
        });
      }

      if (params.searchParams.invoiceStatuses.has(InvoiceStatus.Enum.TO_PAY)) {
        invoicesWhere.push({
          invoices: { some: { status: InvoiceStatus.Enum.TO_PAY } },
        });
      }

      where.push({ OR: invoicesWhere });
    }

    if (params.searchParams.laureats.size > 0) {
      const laureatWhere: Prisma.ShowExhibitorWhereInput[] = [];

      if (
        params.searchParams.laureats.has(
          ExhibitorSearchParams.Laureat.Enum.ORGANIZERS_FAVORITE,
        )
      ) {
        laureatWhere.push({ isOrganizersFavorite: true });
      }

      if (
        params.searchParams.laureats.has(
          ExhibitorSearchParams.Laureat.Enum.RISING_STAR,
        )
      ) {
        laureatWhere.push({ isRisingStar: true });
      }

      if (
        params.searchParams.laureats.has(
          ExhibitorSearchParams.Laureat.Enum.NONE,
        )
      ) {
        laureatWhere.push({
          isOrganizersFavorite: false,
          isRisingStar: false,
        });
      }

      where.push({ OR: laureatWhere });
    }

    if (params.searchParams.name != null) {
      const hits = await this.#getHits(params.searchParams.name);

      where.push({ id: { in: hits.map((hit) => hit.id) } });
    }

    if (params.searchParams.onStandAnimationsStatuses.size > 0) {
      statusesWhere.push({
        onStandAnimationsStatus: {
          in: Array.from(params.searchParams.onStandAnimationsStatuses),
        },
      });
    }

    if (params.searchParams.publicProfileStatuses.size > 0) {
      statusesWhere.push({
        publicProfileStatus: {
          in: Array.from(params.searchParams.publicProfileStatuses),
        },
      });
    }

    if (params.searchParams.sponsorshipCategories.size > 0) {
      const sponsorshipCategoryWhere: Prisma.ShowExhibitorWhereInput[] = [];

      if (
        params.searchParams.sponsorshipCategories.has(
          SponsorshipOptionalCategory.Enum.NO_SPONSORSHIP,
        )
      ) {
        sponsorshipCategoryWhere.push({ sponsorship: null });
      }

      const sponsorshipCategories = Array.from(
        params.searchParams.sponsorshipCategories,
      )
        .map(SponsorshipOptionalCategory.toDb)
        .filter(Boolean);

      if (sponsorshipCategories.length > 0) {
        sponsorshipCategoryWhere.push({
          sponsorship: { category: { in: sponsorshipCategories } },
        });
      }

      where.push({ OR: sponsorshipCategoryWhere });
    }

    if (params.searchParams.standConfigurationStatuses.size > 0) {
      statusesWhere.push({
        standConfigurationStatus: {
          in: Array.from(params.searchParams.standConfigurationStatuses),
        },
      });
    }

    if (params.searchParams.standSizesId.size > 0) {
      where.push({
        size: { id: { in: Array.from(params.searchParams.standSizesId) } },
      });
    }

    if (params.searchParams.targets.size > 0) {
      where.push({
        activityTargets: {
          hasSome: Array.from(params.searchParams.targets),
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

    return { exhibitors, totalCount };
  }

  async fuzzySearch<T extends Prisma.ShowExhibitorSelect>(
    name: undefined | string,
    {
      select,
      where,
      take,
    }: {
      select: T;
      where?: Prisma.ShowExhibitorWhereInput;
      take?: number;
    },
  ) {
    // Ensure we only use our selected properties.
    const internalSelect = { id: true } satisfies Prisma.ShowExhibitorSelect;

    // When there are no text search, return hits ordered by name.
    if (name == null) {
      return await prisma.showExhibitor.findMany({
        where,
        select: { ...select, ...internalSelect },
        orderBy: { name: "asc" },
        take,
      });
    }

    const hits = await this.#getHits(name);

    const exhibitors = (await prisma.showExhibitor.findMany({
      where: { ...where, id: { in: hits.map((hit) => hit.id) } },
      select: { ...select, ...internalSelect },
    })) as Prisma.ShowExhibitorGetPayload<{ select: typeof internalSelect }>[];

    return orderByRank(exhibitors, hits, {
      take,
    }) as Prisma.ShowExhibitorGetPayload<{
      select: typeof select & typeof internalSelect;
    }>[];
  }

  async #getHits(name: string): Promise<{ id: string; matchRank: number }[]> {
    return await prisma.$queryRaw`
      WITH
        ranked_exhibitors AS (
          SELECT
            id,
            match_sorter_rank (ARRAY["name"], ${name}) AS "matchRank"
          FROM
            "ShowExhibitor"
        )
      SELECT
        *
      FROM
        ranked_exhibitors
      WHERE
        "matchRank" < 6.7
      ORDER BY
        "matchRank" ASC
    `;
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
          data,
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

  async getFiles(id: string) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { id },
      select: {
        identificationFileId: true,
        insuranceFileId: true,
        kbisFileId: true,
      },
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return await promiseHash({
      identificationFile: this.#getFileMaybe(exhibitor.identificationFileId),
      insuranceFile: this.#getFileMaybe(exhibitor.insuranceFileId),
      kbisFile: this.#getFileMaybe(exhibitor.kbisFileId),
    });
  }

  async #getFileMaybe(fileId: null | string) {
    if (fileId == null) {
      return null;
    }

    return fileStorage.getFile(fileId);
  }

  async updateDocuments(id: string, data: ShowExhibitorDocumentsData) {
    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "documents-treated",
      exhibitorId: id,
    });
  }

  async updateDogs(id: string, data: ShowExhibitorDogsConfigurationData) {
    this.#normalizeDogs(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "dogs-configuration-treated",
      exhibitorId: id,
    });
  }

  #normalizeDogs(data: ShowExhibitorDogsConfigurationData) {
    if (data.dogsConfigurationStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.dogsConfigurationStatusMessage = null;
    }
  }

  async updatePublicProfile(id: string, data: ShowExhibitorPublicProfileData) {
    this.#normalizePublicProfile(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "public-profile-treated",
      exhibitorId: id,
    });
  }

  #normalizePublicProfile(data: ShowExhibitorPublicProfileData) {
    if (data.publicProfileStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.publicProfileStatusMessage = null;
    }
  }

  async updateDescription(id: string, data: ShowExhibitorDescriptionData) {
    this.#normalizeDescription(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "description-treated",
      exhibitorId: id,
    });
  }

  #normalizeDescription(data: ShowExhibitorDescriptionData) {
    if (data.descriptionStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.descriptionStatusMessage = null;
    }
  }

  async updateName(id: string, data: ShowExhibitorNameData) {
    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }
  }

  async updateOnStandAnimations(
    id: string,
    data: ShowExhibitorOnStandAnimationsData,
  ) {
    this.#normalizeOnStandAnimations(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "on-stand-animations-treated",
      exhibitorId: id,
    });
  }

  #normalizeOnStandAnimations(data: ShowExhibitorOnStandAnimationsData) {
    if (data.onStandAnimationsStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.onStandAnimationsStatusMessage = null;
    }
  }

  async updateStand(id: string, data: ShowExhibitorStandConfigurationData) {
    this.#normalizeStand(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "stand-configuration-treated",
      exhibitorId: id,
    });
  }

  #normalizeStand(data: ShowExhibitorStandConfigurationData) {
    if (data.standConfigurationStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.standConfigurationStatusMessage = null;
    }

    if (data.dividerTypeId == null) {
      data.dividerCount = 0;
    }

    if (data.tableCount === 0) {
      data.hasTableCloths = false;
    }
  }

  async updatePerks(id: string, data: ShowExhibitorPerksData) {
    this.#normalizePerks(data);

    try {
      await prisma.showExhibitor.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "perks-treated",
      exhibitorId: id,
    });
  }

  #normalizePerks(data: ShowExhibitorPerksData) {
    if (data.perksStatus !== ExhibitorStatus.Enum.TO_MODIFY) {
      data.perksStatusMessage = null;
    }
  }

  async delete(id: string) {
    try {
      await prisma.showExhibitor.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }
  }
}

const FIND_ORDER_BY_SORT: Record<
  ExhibitorSearchParams.Sort.Enum,
  Prisma.ShowExhibitorFindManyArgs["orderBy"]
> = {
  [ExhibitorSearchParams.Sort.Enum.DIVIDER_COUNT]: [
    { dividerCount: "desc" },
    { name: "asc" },
  ],
  [ExhibitorSearchParams.Sort.Enum.NAME]: { name: "asc" },
  [ExhibitorSearchParams.Sort.Enum.UPDATED_AT]: { updatedAt: "desc" },
};

type ShowExhibitorData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  | "isOrganizer"
  | "isOrganizersFavorite"
  | "isRisingStar"
  | "isVisible"
  | "locationNumber"
  | "standNumber"
>;

type ShowExhibitorDocumentsData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "documentStatus" | "documentStatusMessage"
>;

type ShowExhibitorDogsConfigurationData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "dogsConfigurationStatus" | "dogsConfigurationStatusMessage"
>;

type ShowExhibitorPublicProfileData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  | "activityFields"
  | "activityTargets"
  | "category"
  | "links"
  | "publicProfileStatus"
  | "publicProfileStatusMessage"
>;

type ShowExhibitorDescriptionData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "description" | "descriptionStatus" | "descriptionStatusMessage"
>;

type ShowExhibitorNameData = Pick<Prisma.ShowExhibitorUpdateInput, "name">;

type ShowExhibitorOnStandAnimationsData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  | "onStandAnimations"
  | "onStandAnimationsStatus"
  | "onStandAnimationsStatusMessage"
>;

type ShowExhibitorPerksData = Pick<
  Prisma.ShowExhibitorUncheckedUpdateInput,
  | "appetizerPeopleCount"
  | "breakfastPeopleCountSaturday"
  | "breakfastPeopleCountSunday"
  | "perksStatus"
  | "perksStatusMessage"
>;

type ShowExhibitorStandConfigurationData = Pick<
  Prisma.ShowExhibitorUncheckedUpdateInput,
  | "chairCount"
  | "dividerCount"
  | "dividerTypeId"
  | "hasCorner"
  | "hasElectricalConnection"
  | "hasTableCloths"
  | "installationDay"
  | "peopleCount"
  | "sizeId"
  | "standConfigurationStatus"
  | "standConfigurationStatusMessage"
  | "tableCount"
>;
