import {
  ManagedAnimal,
  User as PublicUser,
  UserBrief,
  UserGroup,
  UserOperations,
} from "@animeaux/shared";
import { Prisma } from "@prisma/client";
import { array, mixed, object, string } from "yup";
import { assertUserHasGroups, getCurrentUser } from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { generatePasswordHash } from "../core/password";
import { validateParams } from "../core/validation";
import { getDisplayName } from "../entities/animal.entity";
import {
  SearchableResourceFromAlgolia,
  SearchableResourcesIndex,
  SearchableResourceType,
} from "../entities/searchableResources.entity";
import { UserFromAlgolia, UserIndex } from "../entities/user.entity";

const userWithIncludes = Prisma.validator<Prisma.UserArgs>()({
  include: {
    managedAnimals: {
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

export const userOperations: OperationsImpl<UserOperations> = {
  async getAllUsers(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const users = await prisma.user.findMany({
      select: { id: true, displayName: true, isDisabled: true, groups: true },
      orderBy: [{ isDisabled: "asc" }, { displayName: "asc" }],
    });

    return users.map<UserBrief>((user) => ({
      id: user.id,
      displayName: user.displayName,
      disabled: user.isDisabled,
      groups: user.groups,
    }));
  },

  async getUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getUser">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const user = await prisma.user.findUnique({
      ...userWithIncludes,
      where: { id: params.id },
    });

    if (user == null) {
      throw new OperationError(404);
    }

    return mapToPublicUser(user);
  },

  async createUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createUser">(
      object({
        email: string().trim().email().required(),
        displayName: string().trim().required(),
        password: string().required(),
        groups: array()
          .of(mixed().oneOf(Object.values(UserGroup)).required())
          .required()
          .min(1),
      }),
      rawParams
    );

    const passwordHash = await generatePasswordHash(params.password);

    try {
      const user = await prisma.user.create({
        ...userWithIncludes,
        data: {
          email: params.email,
          displayName: params.displayName,
          groups: params.groups,
          password: { create: { hash: passwordHash } },
        },
      });

      const userFromAlgolia: UserFromAlgolia = {
        displayName: user.displayName,
        groups: user.groups,
        isDisabled: user.isDisabled,
      };

      await UserIndex.saveObject({
        ...userFromAlgolia,
        objectID: user.id,
      });

      const searchableUserFromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.USER,
        data: { displayName: user.displayName },
      };

      await SearchableResourcesIndex.saveObject({
        ...searchableUserFromAlgolia,
        objectID: user.id,
      });

      return mapToPublicUser(user);
    } catch (error) {
      // Unique constraint failed.
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new OperationError<"createUser">(400, {
          code: "already-exists",
        });
      }

      throw error;
    }
  },

  async updateUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateUser">(
      object({
        id: string().uuid().required(),
        displayName: string().trim().required(),
        password: string().defined(),
        groups: array()
          .of(mixed().oneOf(Object.values(UserGroup)).required())
          .required()
          .min(1),
      }),
      rawParams
    );

    const where: Prisma.UserWhereUniqueInput = { id: params.id };

    if ((await prisma.user.count({ where })) === 0) {
      throw new OperationError(404);
    }

    // Don't allow an admin (only admins can access users) to lock himself out.
    if (
      currentUser.id === params.id &&
      !params.groups.includes(UserGroup.ADMIN)
    ) {
      throw new OperationError(400);
    }

    const passwordHash =
      params.password === ""
        ? null
        : await generatePasswordHash(params.password);

    try {
      const user = await prisma.user.update({
        ...userWithIncludes,
        where,
        data: {
          displayName: params.displayName,
          groups: params.groups,
          password:
            passwordHash == null
              ? undefined
              : {
                  upsert: {
                    update: { hash: passwordHash },
                    create: { hash: passwordHash },
                  },
                },
        },
      });

      const userFromAlgolia: UserFromAlgolia = {
        displayName: user.displayName,
        groups: user.groups,
        isDisabled: user.isDisabled,
      };

      await UserIndex.partialUpdateObject({
        ...userFromAlgolia,
        objectID: params.id,
      });

      const searchableUserFromAlgolia: SearchableResourceFromAlgolia = {
        type: SearchableResourceType.USER,
        data: { displayName: user.displayName },
      };

      await SearchableResourcesIndex.saveObject({
        ...searchableUserFromAlgolia,
        objectID: user.id,
      });

      return mapToPublicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found.
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === "P2025") {
          throw new OperationError(404);
        }
      }

      throw error;
    }
  },

  async toggleUserBlockedStatus(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"toggleUserBlockedStatus">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    // Don't allow a use to block himself.
    if (currentUser.id === params.id) {
      throw new OperationError(400);
    }

    const user = await prisma.$transaction(async (prisma) => {
      const where: Prisma.UserWhereUniqueInput = { id: params.id };

      const user = await prisma.user.findUnique({
        where,
        select: { isDisabled: true },
      });

      if (user == null) {
        throw new OperationError(404);
      }

      return await prisma.user.update({
        ...userWithIncludes,
        where,
        data: { isDisabled: !user.isDisabled },
      });
    });

    const userFromAlgolia: Partial<UserFromAlgolia> = {
      isDisabled: user.isDisabled,
    };

    await UserIndex.partialUpdateObject({
      ...userFromAlgolia,
      objectID: params.id,
    });

    return mapToPublicUser(user);
  },

  async deleteUser(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteUser">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    // Don't allow a user to delete himself.
    if (currentUser.id === params.id) {
      throw new OperationError(400);
    }

    try {
      await prisma.user.delete({ where: { id: params.id } });
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

    await UserIndex.deleteObject(params.id);
    await SearchableResourcesIndex.deleteObject(params.id);

    return true;
  },
};

function mapToPublicUser(
  user: Prisma.UserGetPayload<typeof userWithIncludes>
): PublicUser {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    disabled: user.isDisabled,
    groups: user.groups,
    managedAnimals: user.managedAnimals.map<ManagedAnimal>((animal) => ({
      id: animal.id,
      avatarId: animal.avatar,
      name: getDisplayName(animal),
    })),
  };
}
