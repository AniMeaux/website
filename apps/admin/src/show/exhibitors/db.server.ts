import { PrismaErrorCodes } from "#core/errors.server";
import { fileStorage } from "#core/file-storage.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { ShowExhibitorApplicationDbDelegate } from "#show/exhibitors/applications/db.server";
import { ExhibitorSearchParamsN } from "#show/exhibitors/search-params";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { InvoiceStatus } from "#show/invoice/status.js";
import { SponsorshipOptionalCategory } from "#show/sponsors/category";
import { Visibility } from "#show/visibility";
import { catchError } from "@animeaux/core";
import { Prisma } from "@prisma/client";
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
        onStandAnimations: null,
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

    if (params.searchParams.name != null) {
      where.push({
        name: {
          contains: params.searchParams.name,
          mode: "insensitive",
        },
      });
    }

    if (params.searchParams.onStandAnimationsStatuses.size > 0) {
      statusesWhere.push({
        onStandAnimationsStatus: {
          in: Array.from(params.searchParams.onStandAnimationsStatuses),
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

    if (params.searchParams.publicProfileStatuses.size > 0) {
      statusesWhere.push({
        publicProfileStatus: {
          in: Array.from(params.searchParams.publicProfileStatuses),
        },
      });
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
            isVisible: data.isVisible,
            locationNumber: data.locationNumber,
            standNumber: data.standNumber,
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
  }
}

const FIND_ORDER_BY_SORT: Record<
  ExhibitorSearchParamsN.Sort,
  Prisma.ShowExhibitorFindManyArgs["orderBy"]
> = {
  [ExhibitorSearchParamsN.Sort.NAME]: { name: "asc" },
  [ExhibitorSearchParamsN.Sort.UPDATED_AT]: { updatedAt: "desc" },
};

type ShowExhibitorData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "isVisible" | "locationNumber" | "standNumber"
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

type ShowExhibitorStandConfigurationData = Pick<
  Prisma.ShowExhibitorUncheckedUpdateInput,
  | "chairCount"
  | "dividerCount"
  | "dividerType"
  | "hasElectricalConnection"
  | "hasTablecloths"
  | "installationDay"
  | "peopleCount"
  | "sizeId"
  | "standConfigurationStatus"
  | "standConfigurationStatusMessage"
  | "tableCount"
>;
