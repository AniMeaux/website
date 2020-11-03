import { DBUserForQueryContext } from "@animeaux/shared";

export type AuthContext = {
  user: DBUserForQueryContext | null;
};

export type QueryContext = {
  user: DBUserForQueryContext;
};
