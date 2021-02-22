import { SearchableAnimal } from "@animeaux/shared-entities";
import { computeAvatarUrl, computePublicId } from "../cloudinary";

export function getAnimalRootPicturesFolder({ id }: { id: string }) {
  return ["animals", id];
}

export function getAnimalPictureUrl(
  animal: SearchableAnimal,
  pictureId: string
) {
  return computeAvatarUrl(
    computePublicId(getAnimalRootPicturesFolder(animal), pictureId)
  );
}

export function getAnimalAvatarUrl(animal: SearchableAnimal) {
  return getAnimalPictureUrl(animal, animal.avatarId);
}
