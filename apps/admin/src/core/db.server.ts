import {
  AnimalDbDelegate,
  PickUpLocationDbDelegate,
} from "#animals/db.server.ts";
import { BreedDbDelegate } from "#breeds/db.server.ts";
import { ColorDbDelegate } from "#colors/db.server.ts";
import { CurrentUserDbDelegate } from "#currentUser/db.server.ts";
import { EventDbDelegate } from "#events/db.server.ts";
import { FosterFamilyDbDelegate } from "#fosterFamilies/db.server.ts";
import { PressArticleDbDelegate } from "#pressArticles/db.server.ts";
import { UserDbDelegate } from "#users/db.server.ts";
import { singleton } from "@animeaux/core";

class DbClient {
  readonly animal = new AnimalDbDelegate();
  readonly breed = new BreedDbDelegate();
  readonly color = new ColorDbDelegate();
  readonly currentUser = new CurrentUserDbDelegate();
  readonly event = new EventDbDelegate();
  readonly fosterFamily = new FosterFamilyDbDelegate();
  readonly pickUpLocation = new PickUpLocationDbDelegate();
  readonly pressArticle = new PressArticleDbDelegate();
  readonly user = new UserDbDelegate();
}

export const db = singleton("db", () => new DbClient());
