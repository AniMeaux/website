import { ShowExhibitorDbDelegate } from "#show/exhibitors/db.server";
import { ShowPartnerDbDelegate } from "#show/partners/db.server";

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate();
  readonly partner = new ShowPartnerDbDelegate();
}
