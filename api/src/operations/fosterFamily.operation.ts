import {
  FosterFamily,
  FosterFamilyBrief,
  FosterFamilyHostedAnimal,
  FosterFamilyOperations,
  FosterFamilySearchHit,
  UserGroup,
} from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { object, string } from "yup";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import { getDisplayName } from "../entities/animal.entity";
import {
  FosterFamilyFromAlgolia,
  FosterFamilyIndex,
  getFormattedAddress,
  getShortLocation,
} from "../entities/fosterFamily.entity";

const fosterFamilyWithIncludes = Prisma.validator<Prisma.FosterFamilyArgs>()({
  include: {
    fosterAnimals: {
      orderBy: { name: "asc" },
      select: {
        id: true,
        avatar: true,
        name: true,
        alias: true,
      },
    },
  },
});

export const fosterFamilyOperations: OperationsImpl<FosterFamilyOperations> = {
  async getAllFosterFamilies(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const fosterFamilies = await prisma.fosterFamily.findMany({
      select: { id: true, displayName: true, city: true, zipCode: true },
      orderBy: { displayName: "asc" },
    });

    return fosterFamilies.map<FosterFamilyBrief>((fosterFamily) => ({
      id: fosterFamily.id,
      name: fosterFamily.displayName,
      location: getShortLocation(fosterFamily),
    }));
  },

  async searchFosterFamilies(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"searchFosterFamilies">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await FosterFamilyIndex.search<FosterFamilyFromAlgolia>(
      params.search
    );

    return result.hits.map<FosterFamilySearchHit>((hit) => ({
      id: hit.objectID,
      name: hit.displayName,
      highlightedName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  },

  async getFosterFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"getFosterFamily">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const fosterFamily = await prisma.fosterFamily.findUnique({
      ...fosterFamilyWithIncludes,
      where: { id: params.id },
    });

    if (fosterFamily == null) {
      throw new OperationError(404);
    }

    return mapToFosterFamily(fosterFamily);
  },

  async createFosterFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"createFosterFamily">(
      object({
        name: string().trim().required(),
        phone: string().trim().required(),
        email: string().trim().email().required(),
        zipCode: string()
          .trim()
          .matches(/^\d{5}$/)
          .required(),
        city: string().trim().required(),
        address: string().trim().required(),
      }),
      rawParams
    );

    try {
      const fosterFamily = await prisma.fosterFamily.create({
        ...fosterFamilyWithIncludes,
        data: {
          displayName: params.name,
          phone: params.phone,
          email: params.email,
          zipCode: params.zipCode,
          city: params.city,
          address: params.address,
        },
      });

      const fosterFamilyFromAlgolia: FosterFamilyFromAlgolia = {
        displayName: fosterFamily.displayName,
      };

      await FosterFamilyIndex.saveObject({
        ...fosterFamilyFromAlgolia,
        objectID: fosterFamily.id,
      });

      return mapToFosterFamily(fosterFamily);
    } catch (error) {
      // Unique constraint failed.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new OperationError<"createFosterFamily">(400, {
          code: "already-exists",
        });
      }

      throw error;
    }
  },

  async updateFosterFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateFosterFamily">(
      object({
        id: string().uuid().required(),
        name: string().trim().required(),
        phone: string().trim().required(),
        email: string().trim().email().required(),
        zipCode: string()
          .trim()
          .matches(/^\d{5}$/)
          .required(),
        city: string().trim().required(),
        address: string().trim().required(),
      }),
      rawParams
    );

    const where: Prisma.FosterFamilyWhereUniqueInput = { id: params.id };

    if ((await prisma.fosterFamily.count({ where })) === 0) {
      throw new OperationError(404);
    }

    try {
      const fosterFamily = await prisma.fosterFamily.update({
        ...fosterFamilyWithIncludes,
        where,
        data: {
          displayName: params.name,
          phone: params.phone,
          email: params.email,
          zipCode: params.zipCode,
          city: params.city,
          address: params.address,
        },
      });

      const fosterFamilyFromAlgolia: FosterFamilyFromAlgolia = {
        displayName: fosterFamily.displayName,
      };

      await FosterFamilyIndex.partialUpdateObject({
        ...fosterFamilyFromAlgolia,
        objectID: fosterFamily.id,
      });

      return mapToFosterFamily(fosterFamily);
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
          throw new OperationError<"updateFosterFamily">(400, {
            code: "already-exists",
          });
        }
      }

      throw error;
    }
  },

  async deleteFosterFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"deleteFosterFamily">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    try {
      await prisma.fosterFamily.delete({ where: { id: params.id } });
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

    await FosterFamilyIndex.deleteObject(params.id);

    return true;
  },
};

function mapToFosterFamily(
  fosterFamily: Prisma.FosterFamilyGetPayload<typeof fosterFamilyWithIncludes>
): FosterFamily {
  return {
    id: fosterFamily.id,
    name: fosterFamily.displayName,
    phone: fosterFamily.phone,
    email: fosterFamily.email,
    zipCode: fosterFamily.zipCode,
    city: fosterFamily.city,
    address: fosterFamily.address,
    formattedAddress: getFormattedAddress(fosterFamily),
    hostedAnimals: fosterFamily.fosterAnimals.map<FosterFamilyHostedAnimal>(
      (animal) => ({
        id: animal.id,
        avatarId: animal.avatar,
        name: getDisplayName(animal),
      })
    ),
  };
}
