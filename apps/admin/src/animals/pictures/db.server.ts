import { ActivityAction } from "#activity/action.js";
import { Activity } from "#activity/db.server.js";
import { ActivityResource } from "#activity/resource.js";
import { getAllAnimalPictures } from "#animals/pictures/all-pictures";
import { deleteImage } from "#core/cloudinary.server";
import { NotFoundError } from "#core/errors.server";
import { prisma } from "#core/prisma.server";
import type { Animal } from "@prisma/client";
import difference from "lodash.difference";

export type AnimalPictures = Pick<Animal, "avatar" | "pictures">;

export class AnimalPictureDbDelegate {
  async update(
    animalId: Animal["id"],
    data: AnimalPictures,
    currentUser: { id: string },
  ) {
    await prisma.$transaction(async (prisma) => {
      const currentAnimal = await prisma.animal.findUnique({
        where: { id: animalId },
      });

      if (currentAnimal == null) {
        throw new NotFoundError();
      }

      const picturesToDelete = difference(
        getAllAnimalPictures(currentAnimal),
        getAllAnimalPictures(data),
      );

      const newAnimal = await prisma.animal.update({
        where: { id: animalId },
        data,
      });

      if (picturesToDelete.length > 0) {
        await Promise.allSettled(picturesToDelete.map(deleteImage));
      }

      await Activity.create({
        currentUser,
        action: ActivityAction.Enum.UPDATE,
        resource: ActivityResource.Enum.ANIMAL,
        resourceId: animalId,
        before: currentAnimal,
        after: newAnimal,
      });
    });
  }
}
