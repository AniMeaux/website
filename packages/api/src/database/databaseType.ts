import {
  CreateUserRolePayload,
  DBUser,
  DBUserForQueryContext,
  DBUserRole,
  UserFilters,
} from "@animeaux/shared";

export type Database = {
  initialize(): void;

  // User
  getUserForQueryContext(token: string): Promise<DBUserForQueryContext | null>;
  getAllUsers(filters?: UserFilters): Promise<DBUser[]>;
  getUser(id: string): Promise<DBUser | null>;

  // User roles
  getAllUserRoles(): Promise<DBUserRole[]>;
  getUserRole(id: string): Promise<DBUserRole | null>;
  createUserRole(payload: CreateUserRolePayload): Promise<DBUserRole>;
};
