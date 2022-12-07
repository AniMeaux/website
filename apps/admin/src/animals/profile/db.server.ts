import { Animal } from "@prisma/client";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError, OutdatedError } from "~/core/errors.server";

export class BreedNotForSpeciesError extends Error {}

export async function updateAnimalProfile(
  animalId: Animal["id"],
  updatedAt: Animal["updatedAt"],
  data: Pick<
    Animal,
    | "alias"
    | "birthdate"
    | "breedId"
    | "colorId"
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
  await prisma.$transaction(async (prisma) => {
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      select: { updatedAt: true },
    });

    if (animal == null) {
      throw new NotFoundError();
    }

    if (animal.updatedAt > updatedAt) {
      throw new OutdatedError();
    }

    if (data.breedId != null) {
      const breed = await prisma.breed.findUnique({
        where: { id: data.breedId },
        select: { species: true },
      });

      if (breed == null || breed.species !== data.species) {
        throw new BreedNotForSpeciesError();
      }
    }

    await prisma.animal.update({ where: { id: animalId }, data });
    await algolia.animal.update(animalId, {
      alias: data.alias,
      name: data.name,
      species: data.species,
    });
  });
}
