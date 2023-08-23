import { AnimalAlgoliaDelegate } from "#animals/algolia.server.ts";
import { BreedAlgoliaDelegate } from "#breeds/algolia.server.ts";
import { ColorAlgoliaDelegate } from "#colors/algolia.server.ts";
import { singleton } from "#core/singleton.server.ts";
import { FosterFamilyAlgoliaDelegate } from "#fosterFamilies/algolia.server.ts";
import { UserAlgoliaDelegate } from "#users/algolia.server.ts";
import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";

class AlgoliaClient {
  readonly animal: AnimalAlgoliaDelegate;
  readonly breed: BreedAlgoliaDelegate;
  readonly color: ColorAlgoliaDelegate;
  readonly fosterFamily: FosterFamilyAlgoliaDelegate;
  readonly user: UserAlgoliaDelegate;

  constructor(appId: string, apiKey: string) {
    const client = algoliasearch(appId, apiKey);
    this.animal = new AnimalAlgoliaDelegate(client);
    this.breed = new BreedAlgoliaDelegate(client);
    this.color = new ColorAlgoliaDelegate(client);
    this.fosterFamily = new FosterFamilyAlgoliaDelegate(client);
    this.user = new UserAlgoliaDelegate(client);
  }
}

export const algolia = singleton("algolia", () => {
  invariant(process.env.ALGOLIA_ID != null, "ALGOLIA_ID must be defined.");

  invariant(
    process.env.ALGOLIA_ADMIN_KEY != null,
    "ALGOLIA_ADMIN_KEY must be defined."
  );

  return new AlgoliaClient(
    process.env.ALGOLIA_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
});
