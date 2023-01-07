import { FosterFamily, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";

const SEARCH_COUNT = 6;

export async function fuzzySearchFosterFamilies({
  displayName,
}: {
  displayName: null | string;
}) {
  // Don't use Algolia when there are no text search.
  if (displayName == null) {
    const fosterFamilies = await prisma.fosterFamily.findMany({
      select: { id: true, displayName: true, city: true, zipCode: true },
      orderBy: { displayName: "asc" },
      take: SEARCH_COUNT,
    });

    return fosterFamilies.map((fosterFamily) => ({
      ...fosterFamily,
      highlightedDisplayName: fosterFamily.displayName,
    }));
  }

  const hits = await algolia.fosterFamily.search(displayName, {
    hitsPerPage: SEARCH_COUNT,
  });

  const fosterFamilies = await prisma.fosterFamily.findMany({
    where: { id: { in: hits.map((hit) => hit.id) } },
    select: { city: true, id: true, zipCode: true },
  });

  return hits.map((hit) => {
    const fosterFamily = fosterFamilies.find(
      (fosterFamily) => fosterFamily.id === hit.id
    );
    invariant(
      fosterFamily != null,
      "Foster family from algolia should exists."
    );

    return { ...hit, ...fosterFamily };
  });
}

export async function deleteFosterFamily(fosterFamilyId: FosterFamily["id"]) {
  await prisma.$transaction(async (prisma) => {
    try {
      await prisma.fosterFamily.delete({ where: { id: fosterFamilyId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorCodes.NOT_FOUND: {
            throw new NotFoundError();
          }

          case PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED: {
            throw new ReferencedError();
          }
        }
      }

      throw error;
    }

    await algolia.fosterFamily.delete(fosterFamilyId);
    await algolia.searchableResource.deleteFosterFamily(fosterFamilyId);
  });
}
