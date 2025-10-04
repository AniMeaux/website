import type { ServiceBlurhash } from "#core/image/blurhash.service.server.js";
import { ImageData } from "#core/image/data.js";
import type { ServicePrisma } from "#core/prisma.service.server.js";
import { notFound } from "#core/response.server.js";
import { ExhibitorSearchParamsN } from "#exhibitors/search-params.js";
import type { FileStorage } from "@animeaux/file-storage/server";
import type { Prisma, ShowExhibitor } from "@prisma/client";
import { ShowExhibitorStatus } from "@prisma/client";
import { captureException } from "@sentry/remix";
import { promiseHash } from "remix-utils/promise";

export class ServiceExhibitor {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private prisma: ServicePrisma,
    private fileStorage: FileStorage,
    private blurhash: ServiceBlurhash,
  ) {}

  async get<T extends Prisma.ShowExhibitorSelect>(
    id: string,
    params: { select: T },
  ) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { id },
      select: params.select,
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return exhibitor;
  }

  async getByToken<T extends Prisma.ShowExhibitorSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { token },
      select: params.select,
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return exhibitor;
  }

  async getCount() {
    return await this.prisma.showExhibitor.count();
  }

  async findManyVisible<T extends Prisma.ShowExhibitorSelect>(params: {
    searchParams: ExhibitorSearchParamsN.Value;
    select: T;
  }) {
    const where: Prisma.ShowExhibitorWhereInput[] = [{ isVisible: true }];

    if (params.searchParams.targets.size > 0) {
      where.push({
        activityTargets: { hasSome: Array.from(params.searchParams.targets) },
      });
    }

    if (params.searchParams.fields.size > 0) {
      where.push({
        activityFields: { hasSome: Array.from(params.searchParams.fields) },
      });
    }

    if (params.searchParams.isSponsor) {
      if (process.env.ORGANIZER_EXHIBITOR_ID == null) {
        where.push({ sponsorship: { isVisible: true } });
      } else {
        where.push({
          OR: [
            { sponsorship: { isVisible: true } },
            { id: process.env.ORGANIZER_EXHIBITOR_ID },
          ],
        });
      }
    }

    if (
      params.searchParams.eventTypes.has(
        ExhibitorSearchParamsN.EventType.Enum.ON_STAGE,
      )
    ) {
      where.push({ animations: { some: { isVisible: true } } });
    }

    if (
      params.searchParams.eventTypes.has(
        ExhibitorSearchParamsN.EventType.Enum.ON_STAND,
      )
    ) {
      where.push({
        onStandAnimationsStatus: ShowExhibitorStatus.VALIDATED,
        onStandAnimations: { not: null },
      });
    }

    return await this.prisma.showExhibitor.findMany({
      where: { AND: where },
      orderBy: { name: "asc" },
      select: params.select,
    });
  }

  async getFilesByToken(token: string) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { token },
      select: {
        identificationFileId: true,
        insuranceFileId: true,
        kbisFileId: true,
      },
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return await this.#getFiles(exhibitor);
  }

  async getFilesByExhibitor(exhibitorId: string) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { id: exhibitorId },
      select: {
        identificationFileId: true,
        insuranceFileId: true,
        kbisFileId: true,
      },
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return await this.#getFiles(exhibitor);
  }

  async #getFiles(
    exhibitor: Pick<
      ShowExhibitor,
      "identificationFileId" | "insuranceFileId" | "kbisFileId"
    >,
  ) {
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

    return this.fileStorage.getFile(fileId);
  }

  async updateDocuments(token: string, data: DocumentsData) {
    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        documentStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }

  async updateDogs(token: string, data: ExhibitorDogData[]) {
    return await this.prisma.$transaction(async (prisma) => {
      const exhibitor = await prisma.showExhibitor.update({
        where: { token },
        data: {
          dogsConfigurationStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
        },
        select: { id: true },
      });

      await prisma.showExhibitorDog.deleteMany({
        where: { exhibitorId: exhibitor.id },
      });

      await prisma.showExhibitorDog.createMany({
        data: data.map((dog) => ({
          ...dog,

          exhibitorId: exhibitor.id,
        })),
      });

      return true;
    });
  }

  async updatePublicProfile(token: string, data: ExhibitorPublicProfileData) {
    const logoPath =
      typeof data.logoPath === "string" ? data.logoPath : data.logoPath?.set;

    if (logoPath != null) {
      try {
        const blurhash = await this.blurhash.create(logoPath);
        data.logoPath = ImageData.stringify({ id: logoPath, blurhash });
      } catch (error) {
        console.error(error);
        captureException(error, { extra: { logoPath } });
      }
    }

    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        publicProfileStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }

  async updateDescription(token: string, data: ExhibitorDescriptionData) {
    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        descriptionStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }

  async updateOnStandAnimations(
    token: string,
    data: ExhibitorOnStandAnimationsData,
  ) {
    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        onStandAnimationsStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }

  async updateStand(token: string, data: ExhibitorStandConfigurationData) {
    this.#normalizeStand(data);

    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        standConfigurationStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }

  #normalizeStand(data: ExhibitorStandConfigurationData) {
    if (data.dividerTypeId == null) {
      data.dividerCount = 0;
    }

    if (data.tableCount === 0) {
      data.hasTableCloths = false;
    }
  }

  async updatePerks(token: string, data: ExhibitorPerksData) {
    await this.prisma.showExhibitor.update({
      where: { token },
      data: {
        ...data,

        perksStatus: ShowExhibitorStatus.AWAITING_VALIDATION,
      },
    });

    return true;
  }
}

type DocumentsData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "identificationFileId" | "insuranceFileId" | "kbisFileId"
>;

type ExhibitorDogData = Pick<
  Prisma.ShowExhibitorDogCreateManyInput,
  "gender" | "idNumber" | "isCategorized" | "isSterilized"
>;

type ExhibitorPublicProfileData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "activityFields" | "activityTargets" | "links" | "logoPath"
>;

type ExhibitorDescriptionData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "description"
>;

type ExhibitorOnStandAnimationsData = Pick<
  Prisma.ShowExhibitorUpdateInput,
  "onStandAnimations"
>;

type ExhibitorStandConfigurationData = Pick<
  Prisma.ShowExhibitorUncheckedUpdateInput,
  | "chairCount"
  | "dividerCount"
  | "dividerTypeId"
  | "hasCorner"
  | "hasElectricalConnection"
  | "hasTableCloths"
  | "installationDay"
  | "peopleCount"
  | "placementComment"
  | "sizeId"
  | "tableCount"
  | "zone"
>;

type ExhibitorPerksData = Pick<
  Prisma.ShowExhibitorUncheckedUpdateInput,
  | "appetizerPeopleCount"
  | "breakfastPeopleCountSaturday"
  | "breakfastPeopleCountSunday"
>;
