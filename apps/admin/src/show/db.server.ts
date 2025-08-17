import { ShowExhibitorDbDelegate } from "#show/exhibitors/db.server";
import { ShowInvoiceDbDelegate } from "#show/invoice/db.server";
import { ShowSponsorDbDelegate } from "#show/sponsors/db.server";

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate();
  readonly invoice = new ShowInvoiceDbDelegate();
  readonly sponsor = new ShowSponsorDbDelegate();
}
