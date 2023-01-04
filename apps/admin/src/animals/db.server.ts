import { AnimalDraft } from "@prisma/client";
import { AnimalPictures } from "~/animals/pictures/db.server";
import { hasProfile, validateProfile } from "~/animals/profile/db.server";
import { PickUpLocationSearchParams } from "~/animals/searchParams";
import {
  hasSituation,
  normalizeSituation,
  validateSituation,
} from "~/animals/situation/db.server";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";

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
      pickUpLocation: data.pickUpLocation,
      species: data.species,
      status: data.status,
    });

    await algolia.searchableResource.createOrUpdateAnimal(animal.id, {
      alias: data.alias,
      name: data.name,
      pickUpDate: data.pickUpDate,
    });

    return animal.id;
  });
}
