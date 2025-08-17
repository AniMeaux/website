import { AlreadyExistError, PrismaErrorCodes } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { catchError } from "@animeaux/core";
import { Prisma } from "@prisma/client";

export class ShowInvoiceDbDelegate {
  async update(invoiceId: string, data: ShowInvoiceData) {
    const [error, becamePaid] = await catchError(() =>
      prisma.$transaction(async (prisma) => {
        const previousInvoice = await prisma.showInvoice.findUnique({
          where: { id: invoiceId },
          select: { status: true },
        });

        if (previousInvoice == null) {
          throw notFound();
        }

        const invoice = await prisma.showInvoice.update({
          where: { id: invoiceId },
          data: {
            amount: data.amount,
            dueDate: data.dueDate,
            number: data.number,
            status: data.status,
            url: data.url,
          },
          select: { status: true },
        });

        return invoice.status && !previousInvoice.status;
      }),
    );

    if (error != null) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_FOUND: {
            throw notFound();
          }

          case PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED: {
            throw new AlreadyExistError();
          }
        }
      }

      throw error;
    }

    if (becamePaid) {
      // TODO
    }
  }
}

type ShowInvoiceData = Pick<
  Prisma.ShowInvoiceUpdateInput,
  "amount" | "dueDate" | "number" | "status" | "url"
>;
