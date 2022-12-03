import { Animal } from "@prisma/client";
import { prisma } from "~/core/db.server";

export async function updateAnimalProfile(
  animalId: Animal["id"],
  data: Pick<
    Animal,
    | "alias"
    | "birthdate"
    | "description"
    | "gender"
    | "iCadNumber"
    | "isOkCats"
    | "isOkChildren"
    | "isOkDogs"
    | "isSterilized"
    | "name"
    | "species"
  >
) {
  await prisma.animal.update({ where: { id: animalId }, data });
}
