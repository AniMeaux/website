import { UserRole } from "./userRole";

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
};

export type DBUserFromAuth = Omit<User, "role">;

export type DBUserFromStore = Pick<User, "id"> & {
  roleId: string;
};

export type DBUser = Omit<User, "role"> & {
  roleId: string;
};
