import { getAllAnimalPictures } from "#animals/pictures/allPictures.ts";
import type { AnimalPictures } from "#animals/pictures/db.server.ts";
import { AnimalPictureDbDelegate } from "#animals/pictures/db.server.ts";
import { AnimalProfileDbDelegate } from "#animals/profile/db.server.ts";
import { AnimalSituationDbDelegate } from "#animals/situation/db.server.ts";
import { algolia } from "#core/algolia/algolia.server.ts";
import { deleteImage } from "#core/cloudinary.server.ts";
import { NotFoundError, PrismaErrorCodes } from "#core/errors.server.ts";
import { prisma } from "#core/prisma.server.ts";
import type { Animal, AnimalDraft } from "@prisma/client";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";

export class AnimalDbDelegate {
  readonly picture = new AnimalPictureDbDelegate();
  readonly profile = new AnimalProfileDbDelegate();
  readonly situation = new AnimalSituationDbDelegate();

  async fuzzySearchPickUpLocation({
    text = "",
    maxHitCount,
  }: {
    text?: string;
    maxHitCount: number;
  }) {
    return await algolia.animal.searchPickUpLocation({
      text,
      maxFacetHits: maxHitCount,
    });
  }

  async create(draft: null | AnimalDraft, pictures: AnimalPictures) {
    return await prisma.$transaction(async (prisma) => {
      if (
        !this.profile.draftHasProfile(draft) ||
        !this.situation.draftHasSituation(draft)
      ) {
        throw new StepNotValidError();
      }

      await this.profile.validate(prisma, draft);
      await this.situation.validate(prisma, draft);
      this.situation.normalize(draft);

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

  async delete(animalId: Animal["id"]) {
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

  async fuzzySearch({
    nameOrAlias,
    maxHitCount,
  }: {
    nameOrAlias: string;
    maxHitCount: number;
  }) {
    const hits = await algolia.animal.search({
      nameOrAlias,
      hitsPerPage: maxHitCount,
    });

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
}

class StepNotValidError extends Error {}
