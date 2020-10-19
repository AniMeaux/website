import { DBUserRole, UserRole } from "./userRole";

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
};

export type DBUserFromAuth = {
  id: string;
  email: string;
  displayName: string;
};

export type DBUserFromStore = {
  id: string;
  roleId: string;
};

export type DBUser = DBUserFromAuth & DBUserFromStore;

export type DBUserForQueryContext = {
  id: string;
  email: string;
  displayName: string;
  role: DBUserRole;
};

export type UserFilters = {
  roleId?: string | null;
};
