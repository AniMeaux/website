import { DBUserForQueryContext } from "@animeaux/shared";

export type QueryContext = {
  user: DBUserForQueryContext | null;
};
