import { Animal, Prisma } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

export async function updateAnimalProfile(
  animalId: Animal["id"],
  data: Pick<
    Animal,
    | "alias"
    | "birthdate"
    | "description"
    | "gender"
    | "iCadNumber"
    | "isOkCats"
    | "isOkChildren"
    | "isOkDogs"
    | "isSterilized"
    | "name"
    | "species"
  >
) {
  try {
    await prisma.animal.update({ where: { id: animalId }, data });
    await algolia.animal.update(animalId, {
      alias: data.alias,
      name: data.name,
      species: data.species,
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
}
