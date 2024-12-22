import { ShowExhibitorApplicationDbDelegate } from "#show/applications/db.server";

export class ShowDbDelegate {
  readonly exhibitorApplication = new ShowExhibitorApplicationDbDelegate();
}
