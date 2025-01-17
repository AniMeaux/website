import { ShowExhibitorDbDelegate } from "#show/exhibitors/db.server";

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate();
}
