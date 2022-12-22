import { Animal, Prisma, Status } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

export class MissingAdoptionDateError extends Error {}
export class MissingAdoptionOptionError extends Error {}

export async function updateAnimalSituation(
  animalId: Animal["id"],
  data: Pick<
    Animal,
    | "adoptionDate"
    | "adoptionOption"
    | "comments"
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

    if (data.status !== Status.ADOPTED) {
      data.adoptionDate = null;
      data.adoptionOption = null;
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
