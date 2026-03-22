import type { ServicePrisma } from "#i/core/prisma.service.server.js";

export class ServiceProvider {
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
