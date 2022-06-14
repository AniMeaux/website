import {
  AnimalColorOperations,
  AnimalColorSearchHit,
  UserGroup,
} from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { object, string } from "yup";
import { DEFAULT_SEARCH_OPTIONS } from "../core/algolia";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import { ColorFromAlgolia, ColorIndex } from "../entities/animalColor.entity";

export const animalColorOperations: OperationsImpl<AnimalColorOperations> = {
  async getAllAnimalColors(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    return await prisma.color.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  },

  async searchAnimalColors(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
      UserGroup.VETERINARIAN,
    ]);

    const params = validateParams<"searchAnimalColors">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await ColorIndex.search<ColorFromAlgolia>(
      params.search,
      DEFAULT_SEARCH_OPTIONS
    );

    return result.hits.map<AnimalColorSearchHit>((hit) => ({
      id: hit.objectID,
      name: hit.name,
      highlightedName: hit._highlightResult?.name?.value ?? hit.name,
    }));
  },

  async getAnimalColor(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAnimalColor">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const color = await prisma.color.findUnique({
      where: { id: params.id },
      select: { id: true, name: true },
    });

    if (color == null) {
      throw new OperationError(404);
    }

    return color;
  },

  async createAnimalColor(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createAnimalColor">(
      object({ name: string().trim().required() }),
      rawParams
    );

    try {
      const color = await prisma.color.create({
        select: { id: true, name: true },
        data: { name: params.name },
      });

      const colorFromAlgolia: ColorFromAlgolia = {
        name: color.name,
      };

      await ColorIndex.saveObject({
        ...colorFromAlgolia,
        objectID: color.id,
      });

      return color;
    } catch (error) {
      // Unique constraint failed.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new OperationError<"createAnimalColor">(400, {
          code: "already-exists",
        });
      }

      throw error;
    }
  },

  async updateAnimalColor(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateAnimalColor">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
      }),
      rawParams
    );

    const where: Prisma.ColorWhereUniqueInput = { id: params.id };

    if ((await prisma.color.count({ where })) === 0) {
      throw new OperationError(404);
    }

    try {
      const color = await prisma.color.update({
        where,
        select: { id: true, name: true },
        data: { name: params.name },
      });

      const colorFromAlgolia: ColorFromAlgolia = {
        name: color.name,
      };

      await ColorIndex.partialUpdateObject({
        ...colorFromAlgolia,
        objectID: color.id,
      });

      return color;
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
          throw new OperationError<"updateAnimalColor">(400, {
            code: "already-exists",
          });
        }
      }

      throw error;
    }
  },

  async deleteAnimalColor(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteAnimalColor">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    try {
      await prisma.color.delete({ where: { id: params.id } });
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

    await ColorIndex.deleteObject(params.id);

    return true;
  },
};
