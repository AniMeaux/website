import { Animal, AnimalDraft, Prisma } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

type ProfileKeys =
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
  | "species";

type AnimalProfile = Pick<Animal, ProfileKeys>;
type AnimalDraftProfile = Pick<AnimalDraft, ProfileKeys>;

export class BreedNotForSpeciesError extends Error {}

export async function updateAnimalProfile(
  animalId: Animal["id"],
  data: AnimalProfile
) {
  await prisma.$transaction(async (prisma) => {
    await validate(prisma, data);

    try {
      const animal = await prisma.animal.update({
        where: { id: animalId },
        data,
        select: { pickUpDate: true },
      });

      await algolia.animal.update(animalId, {
        alias: data.alias,
        name: data.name,
        species: data.species,
      });

      await algolia.searchableResource.updateAnimal(animalId, {
        alias: data.alias,
        name: data.name,
        pickUpDate: animal.pickUpDate,
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

export async function updateAnimalProfileDraft(
  ownerId: AnimalDraft["ownerId"],
  data: AnimalProfile
) {
  await prisma.$transaction(async (prisma) => {
    await validate(prisma, data);

    await prisma.animalDraft.upsert({
      where: { ownerId },
      update: data,
      create: { ...data, ownerId },
    });
  });
}

async function validate(prisma: Prisma.TransactionClient, data: AnimalProfile) {
  if (data.breedId != null) {
    const breed = await prisma.breed.findUnique({
      where: { id: data.breedId },
      select: { species: true },
    });

    if (breed == null || breed.species !== data.species) {
      throw new BreedNotForSpeciesError();
    }
  }
}

export function assertDraftHasProfile(
  draft?: null | AnimalDraftProfile
): asserts draft is AnimalProfile {
  if (
    draft == null ||
    draft.birthdate == null ||
    draft.gender == null ||
    draft.isSterilized == null ||
    draft.name == null ||
    draft.species == null
  ) {
    throw redirect("/animals/new-profile");
  }
}
