import { animalHandlers } from "~/mocks/algolia/animal.server";
import { userHandlers } from "~/mocks/algolia/user.server";

export const algoliaHandlers = [...userHandlers, ...animalHandlers];
