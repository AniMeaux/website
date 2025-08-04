import type { ServicePrisma } from "#core/prisma.service.server.js";

export class ServiceProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getManyVisible() {
    return await this.prisma.showProvider.findMany({
      where: { isVisible: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        logoPath: true,
        name: true,
        url: true,
      },
    });
  }
}
