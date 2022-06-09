import {
  HostFamily,
  HostFamilyBrief,
  HostFamilyHostedAnimal,
  HostFamilyOperations,
  HostFamilySearchHit,
  UserGroup,
} from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { object, string } from "yup";
import { DEFAULT_SEARCH_OPTIONS } from "../core/algolia";
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

export const fosterFamilyOperations: OperationsImpl<HostFamilyOperations> = {
  async getAllHostFamilies(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const fosterFamilies = await prisma.fosterFamily.findMany({
      select: { id: true, displayName: true, city: true, zipCode: true },
      orderBy: { displayName: "asc" },
    });

    return fosterFamilies.map<HostFamilyBrief>((fosterFamily) => ({
      id: fosterFamily.id,
      name: fosterFamily.displayName,
      location: getShortLocation(fosterFamily),
    }));
  },

  async searchHostFamilies(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"searchHostFamilies">(
      object({ search: string().strict(true).defined() }),
      rawParams
    );

    const result = await FosterFamilyIndex.search<FosterFamilyFromAlgolia>(
      params.search,
      DEFAULT_SEARCH_OPTIONS
    );

    return result.hits.map<HostFamilySearchHit>((hit) => ({
      id: hit.objectID,
      name: hit.displayName,
      highlightedName:
        hit._highlightResult?.displayName?.value ?? hit.displayName,
    }));
  },

  async getHostFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"getHostFamily">(
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

    return mapToHostFamily(fosterFamily);
  },

  async createHostFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"createHostFamily">(
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

      return mapToHostFamily(fosterFamily);
    } catch (error) {
      // Unique constraint failed.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new OperationError<"createHostFamily">(400, {
          code: "already-exists",
        });
      }

      throw error;
    }
  },

  async updateHostFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"updateHostFamily">(
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

      return mapToHostFamily(fosterFamily);
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
          throw new OperationError<"updateHostFamily">(400, {
            code: "already-exists",
          });
        }
      }

      throw error;
    }
  },

  async deleteHostFamily(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [
      UserGroup.ADMIN,
      UserGroup.ANIMAL_MANAGER,
    ]);

    const params = validateParams<"deleteHostFamily">(
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

function mapToHostFamily(
  fosterFamily: Prisma.FosterFamilyGetPayload<typeof fosterFamilyWithIncludes>
): HostFamily {
  return {
    id: fosterFamily.id,
    name: fosterFamily.displayName,
    phone: fosterFamily.phone,
    email: fosterFamily.email,
    zipCode: fosterFamily.zipCode,
    city: fosterFamily.city,
    address: fosterFamily.address,
    formattedAddress: getFormattedAddress(fosterFamily),
    hostedAnimals: fosterFamily.fosterAnimals.map<HostFamilyHostedAnimal>(
      (animal) => ({
        id: animal.id,
        avatarId: animal.avatar,
        name: getDisplayName(animal),
      })
    ),
  };
}
