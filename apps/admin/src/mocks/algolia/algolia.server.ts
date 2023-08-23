import { animalHandlers } from "#mocks/algolia/animal.server.ts";
import { breedHandlers } from "#mocks/algolia/breed.server.ts";
import { colorHandlers } from "#mocks/algolia/color.server.ts";
import { fosterFamilyHandlers } from "#mocks/algolia/fosterFamily.server.ts";
import { userHandlers } from "#mocks/algolia/user.server.ts";

export const algoliaHandlers = [
  ...animalHandlers,
  ...breedHandlers,
  ...colorHandlers,
  ...fosterFamilyHandlers,
  ...userHandlers,
];
