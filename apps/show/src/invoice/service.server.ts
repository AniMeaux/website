import type { ServicePrisma } from "#core/prisma.service.server.js";
import { notFound } from "#core/response.server.js";
import type { Prisma } from "@prisma/client";

export class ServiceInvoice {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async get<T extends Prisma.ShowInvoiceSelect>(
    id: string,
    params: { select: T },
  ) {
    const invoice = await this.prisma.showInvoice.findUnique({
      where: { id },
      select: params.select,
    });

    if (invoice == null) {
      throw notFound();
    }

    return invoice;
  }

  async getManyByToken<T extends Prisma.ShowInvoiceSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await this.prisma.showExhibitor.findUnique({
      where: { token },
      select: {
        invoices: {
          orderBy: { createdAt: "desc" },
          select: params.select,
        },
      },
    });

    if (exhibitor?.invoices == null) {
      throw notFound();
    }

    return exhibitor.invoices;
  }
}
