import { Animal } from "@prisma/client";
import difference from "lodash.difference";
import { getAllAnimalPictures } from "~/animals/pictures/allPictures";
import { deleteImage } from "~/core/cloudinary.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

export type AnimalPictures = Pick<Animal, "avatar" | "pictures">;

export async function updateAnimalPictures(
  animalId: Animal["id"],
  data: AnimalPictures
) {
  await prisma.$transaction(async (prisma) => {
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      select: { avatar: true, pictures: true },
    });

    if (animal == null) {
      throw new NotFoundError();
    }

    const picturesToDelete = difference(
      getAllAnimalPictures(animal),
      getAllAnimalPictures(data)
    );

    await prisma.animal.update({ where: { id: animalId }, data });

    if (picturesToDelete.length > 0) {
      await Promise.allSettled(picturesToDelete.map(deleteImage));
    }
  });
}
