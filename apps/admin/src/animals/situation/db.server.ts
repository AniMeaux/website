import { ACTIVE_ANIMAL_STATUS } from "#/animals/status";
import { algolia } from "#/core/algolia/algolia.server";
import { prisma } from "#/core/db.server";
import { NotFoundError } from "#/core/errors.server";
import { Animal, Prisma, Status, UserGroup } from "@prisma/client";

export class MissingAdoptionDateError extends Error {}
export class MissingAdoptionOptionError extends Error {}
export class MissingManagerError extends Error {}
export class NotManagerError extends Error {}

export async function updateAnimalSituation(
  animalId: Animal["id"],
  data: Pick<
    Animal,
    | "adoptionDate"
    | "adoptionOption"
    | "comments"
    | "fosterFamilyId"
    | "managerId"
    | "pickUpDate"
    | "pickUpReason"
    | "status"
  >
) {
  await prisma.$transaction(async (prisma) => {
    if (data.status === Status.ADOPTED) {
      if (data.adoptionDate == null) {
        throw new MissingAdoptionDateError();
      }
      if (data.adoptionOption == null) {
        throw new MissingAdoptionOptionError();
      }
    }

    if (data.managerId == null) {
      const animal = await prisma.animal.findUnique({
        where: { id: animalId },
        select: { managerId: true },
      });

      // Allow old animals (without a manager) to be updated without setting
      // one. But we can't unset a manager.
      if (animal?.managerId != null) {
        throw new MissingManagerError();
      }
    } else {
      const manager = await prisma.user.findFirst({
        where: {
          id: data.managerId,
          isDisabled: false,
          groups: { has: UserGroup.ANIMAL_MANAGER },
        },
      });

      if (manager == null) {
        throw new NotManagerError();
      }
    }

    if (data.status !== Status.ADOPTED) {
      data.adoptionDate = null;
      data.adoptionOption = null;
    }

    if (!ACTIVE_ANIMAL_STATUS.includes(data.status)) {
      data.fosterFamilyId = null;
    }

    try {
      const animal = await prisma.animal.update({
        where: { id: animalId },
        data,
        select: { alias: true, name: true },
      });

      await algolia.animal.update(animalId, {
        status: data.status,
      });

      await algolia.searchableResource.updateAnimal(animalId, {
        alias: animal.alias,
        name: animal.name,
        pickUpDate: data.pickUpDate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Not found.
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === "P2025") {
          throw new NotFoundError();
        }
      }

      throw error;
    }
  });
}
