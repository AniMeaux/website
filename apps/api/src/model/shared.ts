import { User } from "@animeaux/shared-entities";

export type AuthContext = {
  user: User | null;
};

export type QueryContext = {
  user: User;
};
