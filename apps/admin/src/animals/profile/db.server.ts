import { ActivityAction } from "#activity/action.js";
import { Activity } from "#activity/db.server.js";
import { ActivityResource } from "#activity/resource.js";
import { NotFoundError } from "#core/errors.server";
import { Routes } from "#core/navigation";
import { prisma } from "#core/prisma.server";
import type { Animal, AnimalDraft, Prisma } from "@animeaux/prisma/server";
import { redirect } from "@remix-run/node";

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
  async update(
    id: Animal["id"],
    data: AnimalProfile,
    currentUser: { id: string },
  ) {
    await prisma.$transaction(async (prisma) => {
      await this.validate(prisma, data);

      const currentAnimal = await prisma.animal.findUnique({ where: { id } });

      if (currentAnimal == null) {
        throw new NotFoundError();
      }

      const newAnimal = await prisma.animal.update({ where: { id }, data });

      await Activity.create({
        currentUser,
        action: ActivityAction.Enum.UPDATE,
        resource: ActivityResource.Enum.ANIMAL,
        resourceId: id,
        before: currentAnimal,
        after: newAnimal,
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
