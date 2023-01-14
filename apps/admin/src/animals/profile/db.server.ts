import { Animal, AnimalDraft, Prisma } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";

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
  | "name"
  | "species";

export type AnimalProfile = Pick<Animal, ProfileKeys>;
type AnimalDraftProfile = Pick<AnimalDraft, ProfileKeys>;

export class BreedNotForSpeciesError extends Error {}

export async function updateAnimalProfile(
  animalId: Animal["id"],
  data: AnimalProfile
) {
  await prisma.$transaction(async (prisma) => {
    await validateProfile(prisma, data);

    try {
      await prisma.animal.update({ where: { id: animalId }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
    }

    await algolia.animal.update(animalId, {
      alias: data.alias,
      name: data.name,
      species: data.species,
    });
  });
}

export async function updateAnimalProfileDraft(
  ownerId: AnimalDraft["ownerId"],
  data: AnimalProfile
) {
  await prisma.$transaction(async (prisma) => {
    await validateProfile(prisma, data);

    await prisma.animalDraft.upsert({
      where: { ownerId },
      update: data,
      create: { ...data, ownerId },
    });
  });
}

export async function validateProfile(
  prisma: Prisma.TransactionClient,
  data: AnimalProfile
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
}

export async function assertDraftHasValidProfile(
  draft?: null | AnimalDraftProfile
) {
  if (!hasProfile(draft)) {
    throw redirect("/animals/new/profile");
  }

  try {
    await validateProfile(prisma, draft);
  } catch (error) {
    throw redirect("/animals/new/profile");
  }
}

export function hasProfile(
  draft?: null | AnimalDraftProfile
): draft is AnimalProfile {
  return (
    draft != null &&
    draft.birthdate != null &&
    draft.gender != null &&
    draft.name != null &&
    draft.species != null
  );
}
