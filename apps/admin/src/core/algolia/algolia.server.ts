import { AlgoliaClient } from "@animeaux/algolia-client";
import { singleton } from "@animeaux/core";

export const algolia = singleton("algolia", () => new AlgoliaClient());
