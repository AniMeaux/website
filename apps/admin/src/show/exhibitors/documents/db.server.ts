import { PrismaErrorCodes } from "#core/errors.server";
import { fileStorage } from "#core/file-storage.server";
import { notifyShowApp } from "#core/notification.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ShowExhibitorDocumentsDbDelegate {
  async findUniqueByExhibitor<T extends Prisma.ShowExhibitorDocumentsSelect>(
    exhibitorId: string,
    params: { select: T },
  ) {
    const documents = await prisma.showExhibitorDocuments.findUnique({
      where: { exhibitorId },
      select: params.select,
    });

    if (documents == null) {
      throw notFound();
    }

    return documents;
  }

  async getFilesByExhibitor(exhibitorId: string) {
    const documents = await prisma.showExhibitorDocuments.findUnique({
      where: { exhibitorId },
      select: {
        identificationFileId: true,
        insuranceFileId: true,
        kbisFileId: true,
      },
    });

    if (documents == null) {
      throw notFound();
    }

    return await promiseHash({
      identificationFile: this.#getFileMaybe(documents.identificationFileId),
      insuranceFile: this.#getFileMaybe(documents.insuranceFileId),
      kbisFile: this.#getFileMaybe(documents.kbisFileId),
    });
  }

  async #getFileMaybe(fileId: null | string) {
    if (fileId == null) {
      return null;
    }

    return fileStorage.getFile(fileId);
  }

  async update(exhibitorId: string, data: ShowExhibitorDocumentsData) {
    try {
      await prisma.showExhibitor.update({
        where: { id: exhibitorId },
        data: {
          updatedAt: new Date(),
          documents: { update: data },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw notFound();
        }
      }

      throw error;
    }

    await notifyShowApp({
      type: "documents-treated",
      exhibitorId,
    });
  }
}

type ShowExhibitorDocumentsData = Pick<
  Prisma.ShowExhibitorDocumentsUpdateInput,
  "status" | "statusMessage"
>;
