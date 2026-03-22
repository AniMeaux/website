import { ShowDividerTypeDbDelegate } from "#i/show/divider-type/db.server.js"
import { ShowExhibitorDbDelegate } from "#i/show/exhibitors/db.server.js"
import { ShowInvoiceDbDelegate } from "#i/show/invoice/db.server.js"
import { ShowSponsorDbDelegate } from "#i/show/sponsors/db.server.js"
import { ShowStandSizeDbDelegate } from "#i/show/stand-size/db.server.js"

export class ShowDbDelegate {
  readonly exhibitor = new ShowExhibitorDbDelegate()
  readonly dividerType = new ShowDividerTypeDbDelegate()
  readonly invoice = new ShowInvoiceDbDelegate()
  readonly sponsor = new ShowSponsorDbDelegate()
  readonly standSize = new ShowStandSizeDbDelegate()
}
