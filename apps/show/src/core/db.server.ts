import { ExhibitorApplicationDbDelegate } from "#exhibitor-application/db.server";

class DbClient {
  readonly exhibitorApplication = new ExhibitorApplicationDbDelegate();
}

export const db = new DbClient();
