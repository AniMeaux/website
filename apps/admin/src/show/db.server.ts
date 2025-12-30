import { ShowDividerTypeDbDelegate } from "#i/show/divider-type/db.server";
import { ShowExhibitorDbDelegate } from "#i/show/exhibitors/db.server";
import { ShowInvoiceDbDelegate } from "#i/show/invoice/db.server";
import { ShowSponsorDbDelegate } from "#i/show/sponsors/db.server";
import { ShowStandSizeDbDelegate } from "#i/show/stand-size/db.server";

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate();
  readonly dividerType = new ShowDividerTypeDbDelegate();
  readonly invoice = new ShowInvoiceDbDelegate();
  readonly sponsor = new ShowSponsorDbDelegate();
  readonly standSize = new ShowStandSizeDbDelegate();
}
