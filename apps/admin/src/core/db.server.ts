import {
  AnimalDbDelegate,
  PickUpLocationDbDelegate,
} from "#i/animals/db.server";
import { BreedDbDelegate } from "#i/breeds/db.server";
import { ColorDbDelegate } from "#i/colors/db.server";
import { CurrentUserDbDelegate } from "#i/current-user/db.server";
import { EventDbDelegate } from "#i/events/db.server";
import { FosterFamilyDbDelegate } from "#i/foster-families/db.server";
import { PressArticleDbDelegate } from "#i/press-articles/db.server";
import { ShowDbDelegate } from "#i/show/db.server";
import { UserDbDelegate } from "#i/users/db.server";

class DbClient {
  readonly animal = new AnimalDbDelegate();
  readonly breed = new BreedDbDelegate();
  readonly color = new ColorDbDelegate();
  readonly currentUser = new CurrentUserDbDelegate();
  readonly event = new EventDbDelegate();
  readonly fosterFamily = new FosterFamilyDbDelegate();
  readonly pickUpLocation = new PickUpLocationDbDelegate();
  readonly pressArticle = new PressArticleDbDelegate();
  readonly show = new ShowDbDelegate();
  readonly user = new UserDbDelegate();
}

export const db = new DbClient();
