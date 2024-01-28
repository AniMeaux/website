import { AnimalDbDelegate, PickUpLocationDbDelegate } from "#animals/db.server";
import { BreedDbDelegate } from "#breeds/db.server";
import { ColorDbDelegate } from "#colors/db.server";
import { CurrentUserDbDelegate } from "#currentUser/db.server";
import { EventDbDelegate } from "#events/db.server";
import { FosterFamilyDbDelegate } from "#fosterFamilies/db.server";
import { PressArticleDbDelegate } from "#pressArticles/db.server";
import { UserDbDelegate } from "#users/db.server";
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
