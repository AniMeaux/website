import { animalHandlers } from "#/mocks/algolia/animal.server";
import { breedHandlers } from "#/mocks/algolia/breed.server";
import { colorHandlers } from "#/mocks/algolia/color.server";
import { searchableResourcesHandlers } from "#/mocks/algolia/searchableResource.server";
import { userHandlers } from "#/mocks/algolia/user.server";

export const algoliaHandlers = [
  ...animalHandlers,
  ...breedHandlers,
  ...colorHandlers,
  ...searchableResourcesHandlers,
  ...userHandlers,
];
