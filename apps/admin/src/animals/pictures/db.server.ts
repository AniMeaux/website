import { Animal } from "@prisma/client";
import difference from "lodash.difference";
import { getAllAnimalPictures } from "~/animals/pictures/allPictures";
import { deleteImage } from "~/core/cloudinary.server";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";

export async function updateAnimalPictures(
  animalId: Animal["id"],
  data: Pick<Animal, "avatar" | "pictures">
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

    if (picturesToDelete.length > 0) {
      await Promise.allSettled(picturesToDelete.map(deleteImage));
    }

    await prisma.animal.update({ where: { id: animalId }, data });
  });
}
