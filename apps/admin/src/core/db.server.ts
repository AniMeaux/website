import {
  AnimalDbDelegate,
  PickUpLocationDbDelegate,
} from "#i/animals/db.server.js"
import { BreedDbDelegate } from "#i/breeds/db.server.js"
import { ColorDbDelegate } from "#i/colors/db.server.js"
import { CurrentUserDbDelegate } from "#i/current-user/db.server.js"
import { EventDbDelegate } from "#i/events/db.server.js"
import { FosterFamilyDbDelegate } from "#i/foster-families/db.server.js"
import { PressArticleDbDelegate } from "#i/press-articles/db.server.js"
import { ShowDbDelegate } from "#i/show/db.server.js"
import { UserDbDelegate } from "#i/users/db.server.js"

class DbClient {
  readonly animal = new AnimalDbDelegate()
  readonly breed = new BreedDbDelegate()
  readonly color = new ColorDbDelegate()
  readonly currentUser = new CurrentUserDbDelegate()
  readonly event = new EventDbDelegate()
  readonly fosterFamily = new FosterFamilyDbDelegate()
  readonly pickUpLocation = new PickUpLocationDbDelegate()
  readonly pressArticle = new PressArticleDbDelegate()
  readonly show = new ShowDbDelegate()
  readonly user = new UserDbDelegate()
}

export const db = new DbClient()
