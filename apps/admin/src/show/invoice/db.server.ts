import { AlreadyExistError, PrismaErrorCodes } from "#i/core/errors.server";
import { notifyShowApp } from "#i/core/notification.server.js";
import { prisma } from "#i/core/prisma.server";
import { notFound } from "#i/core/response.server";
import { InvoiceStatus } from "#i/show/invoice/status";
import { catchError } from "@animeaux/core";
import { Prisma } from "@animeaux/prisma/server";

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

    await notifyShowApp({
      type: "new-invoice",
      exhibitorId: data.exhibitorId,
    });
  }

  async update(invoiceId: string, data: UpdateData) {
    const [error, invoice] = await catchError(() =>
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
          select: { status: true, exhibitorId: true },
        });

        return {
          ...invoice,
          becamePaid:
            invoice.status === InvoiceStatus.Enum.PAID &&
            previousInvoice.status !== InvoiceStatus.Enum.PAID,
        };
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

    if (invoice.becamePaid) {
      await notifyShowApp({
        type: "invoice-paid",
        exhibitorId: invoice.exhibitorId,
        invoiceId,
      });
    }
  }

  async delete(invoiceId: string) {
    try {
      await prisma.showInvoice.delete({ where: { id: invoiceId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
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
