import { DBResourcePermissions, ResourcePermissions } from "./resource";
import { User } from "./user";

export type UserRole = {
  id: string;
  name: string;
  resourcePermissions: ResourcePermissions;
  users: User[];
};

export type DBUserRole = {
  id: string;
  name: string;
  resourcePermissions: DBResourcePermissions;
};

export type UserRoleFormPayload = {
  name: string;
  resourcePermissions: ResourcePermissions;
};

export type CreateUserRolePayload = {
  name: string;
  resourcePermissions: ResourcePermissions;
};

export type UpdateUserRolePayload = {
  id: string;
  name?: string;
  resourcePermissions?: ResourcePermissions;
};
