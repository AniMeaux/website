import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import type { Services } from "#core/services/service.server";
import { Service } from "#core/services/service.server";
import { ServiceApplication } from "#exhibitors/application/service.server";
import { ServiceDocuments } from "#exhibitors/documents/service.server";
import { ServiceDogsConfiguration } from "#exhibitors/dogs-configuration/service.server";
import { ServiceProfile } from "#exhibitors/profile/service.server";
import { ExhibitorSearchParamsN } from "#exhibitors/search-params";
import { ServiceStandConfiguration } from "#exhibitors/stand-configuration/service.server";
import type { Prisma } from "@prisma/client";

export class ServiceExhibitor extends Service {
  readonly application: ServiceApplication;
  readonly documents: ServiceDocuments;
  readonly dogsConfiguration: ServiceDogsConfiguration;
  readonly profile: ServiceProfile;
  readonly standConfiguration: ServiceStandConfiguration;

  constructor(services: Services) {
    super(services);

    this.application = new ServiceApplication(services);
    this.documents = new ServiceDocuments(services);
    this.dogsConfiguration = new ServiceDogsConfiguration(services);
    this.profile = new ServiceProfile(services);
    this.standConfiguration = new ServiceStandConfiguration(services);
  }

  async get<T extends Prisma.ShowExhibitorSelect>(
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

  async getByToken<T extends Prisma.ShowExhibitorSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: params.select,
    });

    if (exhibitor == null) {
      throw notFound();
    }

    return exhibitor;
  }

  async getCount() {
    return await prisma.showExhibitor.count();
  }

  async findManyVisible<T extends Prisma.ShowExhibitorSelect>(params: {
    searchParams: ExhibitorSearchParamsN.Value;
    select: T;
  }) {
    const where: Prisma.ShowExhibitorWhereInput[] = [{ isVisible: true }];

    if (params.searchParams.targets.size > 0) {
      where.push({
        profile: {
          activityTargets: { hasSome: Array.from(params.searchParams.targets) },
        },
      });
    }

    if (params.searchParams.fields.size > 0) {
      where.push({
        profile: {
          activityFields: { hasSome: Array.from(params.searchParams.fields) },
        },
      });
    }

    if (params.searchParams.isPartner) {
      if (process.env.ORGANIZER_EXHIBITOR_ID == null) {
        where.push({ partnership: { isVisible: true } });
      } else {
        where.push({
          OR: [
            { partnership: { isVisible: true } },
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
      where.push({ profile: { onStandAnimations: { not: null } } });
    }

    return await prisma.showExhibitor.findMany({
      where: { AND: where },
      orderBy: { profile: { name: "asc" } },
      select: params.select,
    });
  }
}
