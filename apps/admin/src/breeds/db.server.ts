import { algolia } from "#core/algolia/algolia.server";
import {
  AlreadyExistError,
  NotFoundError,
  PrismaErrorCodes,
  ReferencedError,
} from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { Breed, Species } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { fuzzySearchBreeds } from "@prisma/client/sql";
import invariant from "tiny-invariant";

export class BreedDbDelegate {
  async create(data: BreedData) {
    await prisma.$transaction(async (prisma) => {
      try {
        const breed = await prisma.breed.create({
          data,
          select: { id: true },
        });

        await algolia.breed.create({ ...data, id: breed.id });
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

      await algolia.breed.update({ ...data, id });
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
    const speciesArray = Array.from(species ?? []);

    // When there are no text search, return hits ordered by name.
    if (name == null) {
      return await prisma.breed.findMany({
        where: {
          species: speciesArray.length === 0 ? undefined : { in: speciesArray },
        },
        select: { id: true, name: true, species: true },
        orderBy: { name: "asc" },
        take: maxHitCount,
      });
    }

    const hits = await prisma.$queryRawTyped(
      fuzzySearchBreeds(name, speciesArray, maxHitCount),
    );

    const breeds = await prisma.breed.findMany({
      where: { id: { in: hits.map((hit) => hit.id) } },
      select: { id: true, name: true, species: true },
    });

    return hits.map((hit) => {
      const breed = breeds.find((breed) => breed.id === hit.id);
      invariant(breed != null, "breed hit should exists.");

      return breed;
    });
  }
}

type BreedData = Pick<Breed, "name" | "species">;
