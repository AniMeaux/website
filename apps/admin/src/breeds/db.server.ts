import { Breed, Prisma, Species } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import {
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "~/core/errors.server";
import { prisma } from "~/core/prisma.server";

export class BreedDbDelegate {
  async delete(id: Breed["id"]) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.breed.delete({ where: { id } });
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

      await algolia.breed.delete(id);
    });
  }

  async fuzzySearch({
    name,
    species = [],
    maxHitCount,
  }: {
    name?: string;
    species?: Species[];
    maxHitCount: number;
  }) {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const breeds = await prisma.breed.findMany({
        where: { species: species == null ? undefined : { in: species } },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });

      return breeds.map((breed) => ({
        ...breed,
        highlightedName: breed.name,
      }));
    }

    return await algolia.breed.search({
      name,
      species,
      hitsPerPage: maxHitCount,
    });
  }
}
