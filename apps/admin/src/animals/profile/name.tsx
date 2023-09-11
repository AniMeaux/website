export function getAnimalDisplayName(animal: {
  name: string;
  alias?: null | string;
}) {
  if (animal.alias === null) {
    return animal.name;
  }

  return `${animal.name} (${animal.alias})`;
}
