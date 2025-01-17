import { ShowExhibitorApplicationDbDelegate } from "#show/exhibitors/applications/db.server";

export class ShowExhibitorDbDelegate {
  readonly application = new ShowExhibitorApplicationDbDelegate();
}
