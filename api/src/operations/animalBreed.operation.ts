import {
  AnimalBreedOperations,
  AnimalBreedSearchHit,
  AnimalSpecies,
  UserGroup,
} from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { mixed, object, string } from "yup";
import { createSearchFilters } from "../core/algolia";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import { BreedFromAlgolia, BreedIndex } from "../entities/animalBreed.entity";

export const animalBreedOperations: OperationsImpl<AnimalBreedOperations> = {
  async getAllAnimalBreeds(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    return await prisma.breed.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, species: true },
    });
  },

  async searchAnimalBreeds(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"searchAnimalBreeds">(
      object({
        search: string().strict(true).defined(),
        species: mixed<AnimalSpecies>().oneOf(Object.values(AnimalSpecies)),
      }),
      rawParams
    );

    const result = await BreedIndex.search<BreedFromAlgolia>(params.search, {
      filters: createSearchFilters({ species: params.species }),
    });

    return result.hits.map<AnimalBreedSearchHit>((hit) => ({
      id: hit.objectID,
      name: hit.name,
      species: hit.species,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  },

  async getAnimalBreed(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAnimalBreed">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const breed = await prisma.breed.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, species: true },
    });

    if (breed == null) {
      throw new OperationError(404);
    }

    return breed;
  },

  async createAnimalBreed(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createAnimalBreed">(
      object({
        name: string().trim().required(),
        species: mixed<AnimalSpecies>()
          .oneOf(Object.values(AnimalSpecies))
          .required(),
      }),
      rawParams
    );

    try {
      const breed = await prisma.breed.create({
        select: { id: true, name: true, species: true },
        data: { name: params.name, species: params.species },
      });

      const breedFromAlgolia: BreedFromAlgolia = {
        name: breed.name,
        species: breed.species,
      };

      await BreedIndex.saveObject({
        ...breedFromAlgolia,
        objectID: breed.id,
      });

      return breed;
    } catch (error) {
      // Unique constraint failed.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new OperationError<"createAnimalBreed">(400, {
          code: "already-exists",
        });
      }

      throw error;
    }
  },

  async updateAnimalBreed(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateAnimalBreed">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
        species: mixed<AnimalSpecies>()
          .oneOf(Object.values(AnimalSpecies))
          .required(),
      }),
      rawParams
    );

    try {
      const breed = await prisma.breed.update({
        where: { id: params.id },
        select: { id: true, name: true, species: true },
        data: { name: params.name, species: params.species },
      });

      const breedFromAlgolia: BreedFromAlgolia = {
        name: breed.name,
        species: breed.species,
      };

      await BreedIndex.partialUpdateObject({
        ...breedFromAlgolia,
        objectID: params.id,
      });

      return breed;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found.
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === "P2025") {
          throw new OperationError(404);
        }

        // Unique constraint failed.
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
        if (error.code === "P2002") {
          throw new OperationError<"updateAnimalBreed">(400, {
            code: "already-exists",
          });
        }
      }

      throw error;
    }
  },

  async deleteAnimalBreed(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteAnimalBreed">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    try {
      await prisma.breed.delete({ where: { id: params.id } });
    } catch (error) {
      // Not found.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new OperationError(404);
      }

      throw error;
    }

    await BreedIndex.deleteObject(params.id);

    return true;
  },
};
