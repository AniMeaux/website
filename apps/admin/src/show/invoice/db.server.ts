import { AlreadyExistError, PrismaErrorCodes } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { catchError } from "@animeaux/core";
import { Prisma } from "@prisma/client";

export class ShowInvoiceDbDelegate {
  async create(data: CreateData) {
    const [error] = await catchError(() =>
      prisma.showInvoice.create({
        data: {
          exhibitorId: data.exhibitorId,
          amount: data.amount,
          dueDate: data.dueDate,
          number: data.number,
          status: data.status,
          url: data.url,
        },
        select: { id: true },
      }),
    );

    if (error != null) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new AlreadyExistError();
        }
      }

      throw error;
    }
  }

  async update(invoiceId: string, data: UpdateData) {
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

type CreateData = Pick<
  Prisma.ShowInvoiceUncheckedCreateInput,
  "amount" | "dueDate" | "exhibitorId" | "number" | "status" | "url"
>;

type UpdateData = Pick<
  Prisma.ShowInvoiceUpdateInput,
  "amount" | "dueDate" | "number" | "status" | "url"
>;
