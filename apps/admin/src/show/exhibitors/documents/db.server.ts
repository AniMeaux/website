import { googleClient } from "#core/google-client.server";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import type { Prisma } from "@prisma/client";
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

    return googleClient.getFile(fileId);
  }
}
