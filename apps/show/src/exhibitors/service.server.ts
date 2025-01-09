import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import type { Services } from "#core/services/service.server";
import { Service } from "#core/services/service.server";
import { ServiceApplication } from "#exhibitors/application/service.server";
import { ServiceDocuments } from "#exhibitors/documents/service.server";
import { ServiceDogsConfiguration } from "#exhibitors/dogs-configuration/service.server";
import { ServiceProfile } from "#exhibitors/profile/service.server";
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

  async getVisibleCount() {
    return await prisma.showExhibitor.count({
      where: { isVisible: true },
    });
  }
}
