import { ShowExhibitorDbDelegate } from "#show/exhibitors/db.server";
import { ShowSponsorDbDelegate } from "#show/sponsors/db.server";

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate();
  readonly sponsor = new ShowSponsorDbDelegate();
}
