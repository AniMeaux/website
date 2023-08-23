import { algolia } from "#core/algolia/algolia.server.ts";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server.ts";
import { prisma } from "#core/prisma.server.ts";
import { Breed, Prisma, Species } from "@prisma/client";

export class BreedDbDelegate {
  async create(data: BreedData) {
    await prisma.$transaction(async (prisma) => {
      try {
        const breed = await prisma.breed.create({
          data,
          select: { id: true },
        });

        await algolia.breed.create(breed.id, {
          name: data.name,
          species: data.species,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new AlreadyExistError();
          }
        }

        throw error;
      }
    });
  }

  async update(id: Breed["id"], data: BreedData) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.breed.update({ where: { id }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new AlreadyExistError();
          }
        }

        throw error;
      }

      await algolia.breed.update(id, {
        name: data.name,
        species: data.species,
      });
    });
  }

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
    species,
    maxHitCount,
  }: {
    name?: string;
    species?: Iterable<Species>;
    maxHitCount: number;
  }) {
    // Don't use Algolia when there are no text search.
    if (name == null) {
      const speciesArray = Array.from(species ?? []);
      const breeds = await prisma.breed.findMany({
        where: {
          species: speciesArray.length === 0 ? undefined : { in: speciesArray },
        },
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

type BreedData = Pick<Breed, "name" | "species">;
