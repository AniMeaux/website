import { DBUser, DBUserRole, User, UserRole } from "@animeaux/shared";

export type Database = {
  initialize(): void;

  // User
  getUserForQueryContext(token: string): Promise<User | null>;
  getUser(id: string): Promise<DBUser | null>;

  // User roles
  getAllUserRoles(): Promise<DBUserRole[]>;
  getUserRole(id: string): Promise<UserRole | null>;
};
