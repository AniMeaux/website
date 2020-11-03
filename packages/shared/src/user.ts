import { DBUserRole, UserRole } from "./userRole";

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  disabled: boolean;
};

export type DBUserFromAuth = {
  id: string;
  email: string;
  displayName: string;
  disabled: boolean;
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
  disabled: boolean;
};

export type UserFormPayload = {
  email: string;
  displayName: string;
  password: string;
  roleId: string | null;
};

export type CreateUserPayload = {
  email: string;
  displayName: string;
  password: string;
  roleId: string;
};

export type UpdateUserPayload = {
  id: string;
  displayName?: string;
  password?: string;
  roleId?: string;
};

export type UserFilters = {
  roleId?: string | null;
};
