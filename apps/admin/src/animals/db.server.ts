import { Animal, AnimalDraft, Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { getAllAnimalPictures } from "~/animals/pictures/allPictures";
import { AnimalPictures } from "~/animals/pictures/db.server";
import { hasProfile, validateProfile } from "~/animals/profile/db.server";
import { PickUpLocationSearchParams } from "~/animals/searchParams";
import {
  hasSituation,
  normalizeSituation,
  validateSituation,
} from "~/animals/situation/db.server";
import { algolia } from "~/core/algolia/algolia.server";
import { deleteImage } from "~/core/cloudinary.server";
import { prisma } from "~/core/db.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";

export async function searchPickUpLocation(
  searchParams: PickUpLocationSearchParams,
  maxCount: number
) {
  const text = searchParams.getText();

  return await algolia.animal.searchPickUpLocation(text ?? "", {
    maxFacetHits: maxCount,
  });
}

class StepNotValidError extends Error {}

export async function createAnimal(
  draft: null | AnimalDraft,
  pictures: AnimalPictures
) {
  return await prisma.$transaction(async (prisma) => {
    if (!hasProfile(draft) || !hasSituation(draft)) {
      throw new StepNotValidError();
    }

    await validateProfile(prisma, draft);
    await validateSituation(prisma, draft);
    normalizeSituation(draft);

    const { ownerId, createdAt, updatedAt, ...data } = draft;

    const animal = await prisma.animal.create({
      data: { ...data, ...pictures },
      select: { id: true },
    });

    await prisma.animalDraft.delete({ where: { ownerId } });

    await algolia.animal.create(animal.id, {
      alias: data.alias,
      name: data.name,
      pickUpDate: data.pickUpDate.getTime(),
      pickUpLocation: data.pickUpLocation,
      species: data.species,
      status: data.status,
    });

    return animal.id;
  });
}

export async function deleteAnimal(animalId: Animal["id"]) {
  await prisma.$transaction(async (prisma) => {
    try {
      const animal = await prisma.animal.delete({
        where: { id: animalId },
        select: { avatar: true, pictures: true },
      });

      await Promise.allSettled(getAllAnimalPictures(animal).map(deleteImage));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCodes.NOT_FOUND) {
          throw new NotFoundError();
        }
      }

      throw error;
    }

    await algolia.animal.delete(animalId);
  });
}

export async function fuzzySearchAnimals(
  nameOrAlias: string,
  maxCount: number
) {
  const hits = await algolia.animal.search(
    { nameOrAlias },
    { hitsPerPage: maxCount }
  );

  const animals = await prisma.animal.findMany({
    where: { id: { in: hits.map((hit) => hit.id) } },
    select: {
      avatar: true,
      id: true,
      species: true,
      breed: { select: { name: true } },
      color: { select: { name: true } },
    },
  });

  return hits.map((hit) => {
    const animal = animals.find((animal) => animal.id === hit.id);
    invariant(animal != null, "Animal from algolia should exists.");
    return { ...hit, ...animal };
  });
}
