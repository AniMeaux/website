import { FosterFamily, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";

const SEARCH_COUNT = 6;

export async function fuzzySearchFosterFamilies(displayName: null | string) {
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

  const hits = await algolia.fosterFamily.search(
    { displayName },
    { hitsPerPage: SEARCH_COUNT }
  );

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
  });
}

export async function updateFosterFamily(
  fosterFamilyId: FosterFamily["id"],
  data: Pick<
    FosterFamily,
    "address" | "city" | "displayName" | "email" | "phone" | "zipCode"
  >
) {
  await prisma.$transaction(async (prisma) => {
    try {
      await prisma.fosterFamily.update({ where: { id: fosterFamilyId }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }

        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new EmailAlreadyUsedError();
        }
      }

      throw error;
    }

    await algolia.fosterFamily.update(fosterFamilyId, {
      displayName: data.displayName,
    });
  });
}

export async function createFosterFamily(
  data: Pick<
    FosterFamily,
    "address" | "city" | "displayName" | "email" | "phone" | "zipCode"
  >
) {
  return await prisma.$transaction(async (prisma) => {
    try {
      const fosterFamily = await prisma.fosterFamily.create({
        data,
        select: { id: true },
      });

      await algolia.fosterFamily.create(fosterFamily.id, {
        displayName: data.displayName,
      });

      return fosterFamily.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
          throw new EmailAlreadyUsedError();
        }
      }

      throw error;
    }
  });
}
