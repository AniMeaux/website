import { FosterFamily, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import {
  EmailAlreadyUsedError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";
import { prisma } from "~/core/prisma.server";

export class MissingSpeciesToHostError extends Error {}

export class FosterFamilyDbDelegate {
  async fuzzySearch({
    displayName,
    maxHitCount,
  }: {
    displayName?: string;
    maxHitCount: number;
  }) {
    // Don't use Algolia when there are no text search.
    if (displayName == null) {
      const fosterFamilies = await prisma.fosterFamily.findMany({
        select: { id: true, displayName: true, city: true, zipCode: true },
        orderBy: { displayName: "asc" },
        take: maxHitCount,
      });

      return fosterFamilies.map((fosterFamily) => ({
        ...fosterFamily,
        highlightedDisplayName: fosterFamily.displayName,
      }));
    }

    const hits = await algolia.fosterFamily.search({
      displayName,
      hitsPerPage: maxHitCount,
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

  async delete(fosterFamilyId: FosterFamily["id"]) {
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

  async update(fosterFamilyId: FosterFamily["id"], data: FosterFamilyData) {
    await prisma.$transaction(async (prisma) => {
      const fosterFamily = await prisma.fosterFamily.findUnique({
        where: { id: fosterFamilyId },
        select: { speciesToHost: true },
      });
      if (fosterFamily == null) {
        throw new NotFoundError();
      }

      this.validateFosterFamily(data, fosterFamily);

      try {
        await prisma.fosterFamily.update({
          where: { id: fosterFamilyId },
          data,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

  async create(data: FosterFamilyData) {
    return await prisma.$transaction(async (prisma) => {
      this.validateFosterFamily(data);

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

  private validateFosterFamily(
    newData: FosterFamilyData,
    currentData?: null | Pick<FosterFamily, "speciesToHost">
  ) {
    if (newData.speciesToHost.length === 0) {
      // Allow old foster family (without species to host) to be updated without
      // setting them. But we can't unset them.
      if (currentData == null || currentData.speciesToHost.length > 0)
        throw new MissingSpeciesToHostError();
    }
  }
}

type FosterFamilyData = Pick<
  FosterFamily,
  | "address"
  | "city"
  | "comments"
  | "displayName"
  | "email"
  | "phone"
  | "speciesAlreadyPresent"
  | "speciesToHost"
  | "zipCode"
>;
