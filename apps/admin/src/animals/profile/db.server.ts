import { Animal, Prisma } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

export class BreedNotForSpeciesError extends Error {}

export async function updateAnimalProfile(
  animalId: Animal["id"],
  data: Pick<
    Animal,
    | "alias"
    | "birthdate"
    | "breedId"
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
  if (data.breedId != null) {
    const breed = await prisma.breed.findUnique({
      where: { id: data.breedId },
      select: { species: true },
    });

    if (breed == null || breed.species !== data.species) {
      throw new BreedNotForSpeciesError();
    }
  }

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
