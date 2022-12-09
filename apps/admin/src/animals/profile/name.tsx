import { Animal } from "@prisma/client";

export function getAnimalDisplayName(animal: Pick<Animal, "name" | "alias">) {
  if (animal.alias === null) {
    return animal.name;
  }

  return `${animal.name} (${animal.alias})`;
}
