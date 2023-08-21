import { Animal, AnimalDraft, Prisma } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { algolia } from "~/core/algolia/algolia.server";
import { NotFoundError, PrismaErrorCodes } from "~/core/errors.server";
import { Routes } from "~/core/navigation";
import { prisma } from "~/core/prisma.server";

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

export class AnimalProfileDbDelegate {
  async update(animalId: Animal["id"], data: AnimalProfile) {
    await prisma.$transaction(async (prisma) => {
      await this.validate(prisma, data);

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

  async updateDraft(ownerId: AnimalDraft["ownerId"], data: AnimalProfile) {
    await prisma.$transaction(async (prisma) => {
      await this.validate(prisma, data);

      await prisma.animalDraft.upsert({
        where: { ownerId },
        update: data,
        create: { ...data, ownerId },
      });
    });
  }

  async validate(prisma: Prisma.TransactionClient, data: AnimalProfile) {
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

  async assertDraftIsValid(draft?: null | AnimalDraftProfile) {
    if (!this.draftHasProfile(draft)) {
      throw redirect(Routes.animals.new.profile.toString());
    }

    try {
      await this.validate(prisma, draft);
    } catch (error) {
      throw redirect(Routes.animals.new.profile.toString());
    }
  }

  draftHasProfile(draft?: null | AnimalDraftProfile): draft is AnimalProfile {
    return (
      draft != null &&
      draft.birthdate != null &&
      draft.gender != null &&
      draft.name != null &&
      draft.species != null
    );
  }
}
