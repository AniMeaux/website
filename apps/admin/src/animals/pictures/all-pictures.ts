import type { Animal } from "@animeaux/prisma/client";

export function getAllAnimalPictures(
  animal: Pick<Animal, "avatar" | "pictures">,
) {
  return [animal.avatar].concat(animal.pictures);
}
