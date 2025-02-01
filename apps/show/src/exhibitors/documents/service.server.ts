import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { Service } from "#core/services/service.server";
import type { Prisma, ShowExhibitorDocuments } from "@prisma/client";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export class ServiceDocuments extends Service {
  async getByToken<T extends Prisma.ShowExhibitorDocumentsSelect>(
    token: string,
    params: { select: T },
  ) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: { documents: { select: params.select } },
    });

    if (exhibitor?.documents == null) {
      throw notFound();
    }

    return exhibitor.documents;
  }

  async getByExhibitor<T extends Prisma.ShowExhibitorDocumentsSelect>(
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

  async getFilesByToken(token: string) {
    const exhibitor = await prisma.showExhibitor.findUnique({
      where: { token },
      select: {
        documents: {
          select: {
            identificationFileId: true,
            insuranceFileId: true,
            kbisFileId: true,
          },
        },
      },
    });

    if (exhibitor?.documents == null) {
      throw notFound();
    }

    return await this.#getFiles(exhibitor.documents);
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

    return await this.#getFiles(documents);
  }

  async #getFiles(
    documents: Pick<
      ShowExhibitorDocuments,
      "identificationFileId" | "insuranceFileId" | "kbisFileId"
    >,
  ) {
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

    return this.services.drive.getFile(fileId);
  }

  async update(token: string, data: DocumentsData) {
    await prisma.showExhibitor.update({
      where: { token },
      data: {
        updatedAt: new Date(),

        documents: {
          update: {
            ...data,
            status: ShowExhibitorDocumentsStatus.AWAITING_VALIDATION,
          },
        },
      },
    });

    return true;
  }
}

type DocumentsData = Pick<
  Prisma.ShowExhibitorDocumentsUpdateInput,
  "identificationFileId" | "insuranceFileId" | "kbisFileId"
>;
