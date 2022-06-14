import { UserGroup } from "@prisma/client";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
};

export type CurrentUserOperations = {
  logIn: (params: { email: string; password: string }) => CurrentUser;
  migratePassword: (params: { token: string; password: string }) => CurrentUser;
  logOut: () => boolean;
  getCurrentUser: () => CurrentUser | null;
  updateCurrentUserProfile: (params: { displayName: string }) => CurrentUser;
  updateCurrentUserPassword: (params: { password: string }) => boolean;
};
