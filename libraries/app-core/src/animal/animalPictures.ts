import { SearchableAnimal } from "@animeaux/shared-entities";
import {
  computeAvatarUrl,
  computePictureUrl,
  computePublicId,
} from "../cloudinary";

export function getAnimalRootPicturesFolder({ id }: { id: string }) {
  return ["animals", id];
}

export function getAnimalPictureUrl(
  animal: SearchableAnimal,
  pictureId: string
) {
  return computePictureUrl(
    computePublicId(getAnimalRootPicturesFolder(animal), pictureId)
  );
}

export function getAnimalAvatarUrl(animal: SearchableAnimal) {
  return computeAvatarUrl(
    computePublicId(getAnimalRootPicturesFolder(animal), animal.avatarId)
  );
}
