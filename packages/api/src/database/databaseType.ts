import { DBUser, User, UserRole } from "@animeaux/shared";

export type Database = {
  initialize(): void;
  getUserRole(id: string): Promise<UserRole | null>;
  getUserForQueryContext(token: string): Promise<User | null>;
  getUser(id: string): Promise<DBUser | null>;
};
