import { prisma } from "#core/prisma.server";
import { Service } from "#core/services/service.server";

export class ServiceProvider extends Service {
  async getManyVisible() {
    return await prisma.showProvider.findMany({
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
